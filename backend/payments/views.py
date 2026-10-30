
import os
import hashlib
import json
from decimal import Decimal, ROUND_HALF_UP

import stripe

from django.db import IntegrityError, transaction
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from products.models import Product
from customize.models import SiteSetting
from orders.models import Order, OrderItem
from orders.serializers import OrderSerializer


def get_stripe_key():
    key = os.getenv("STRIPE_SECRET_KEY")

    if not key:
        raise ValueError("Stripe secret key is not configured.")

    stripe.api_key = key


def get_cart_fingerprint(items):
    if not isinstance(items, list) or not items:
        raise ValueError("Your cart is empty or invalid.")

    normalized_items = []

    for item in items:
        if not isinstance(item, dict):
            raise ValueError("Invalid cart item.")

        try:
            product_id = int(item.get("productId"))
            quantity = int(item.get("quantity"))
        except (TypeError, ValueError):
            raise ValueError("Invalid product ID or quantity.")

        if product_id < 1 or quantity < 1:
            raise ValueError("Invalid product ID or quantity.")

        normalized_items.append({
            "productId": product_id,
            "quantity": quantity,
            "size": str(item.get("size") or ""),
            "color": str(item.get("color") or ""),
        })

    normalized_items.sort(
        key=lambda item: (
            item["productId"],
            item["size"],
            item["color"],
            item["quantity"],
        )
    )

    canonical_json = json.dumps(
        normalized_items,
        sort_keys=True,
        separators=(",", ":"),
    )

    return hashlib.sha256(
        canonical_json.encode("utf-8")
    ).hexdigest()


def calculate_order(items):
    if not isinstance(items, list) or not items:
        raise ValueError("Your cart is empty or invalid.")

    # Validate and normalize incoming cart items.
    normalized_items = []
    quantities_by_product = {}

    for item in items:
        if not isinstance(item, dict):
            raise ValueError("Invalid cart item.")

        try:
            product_id = int(item.get("productId"))
            quantity = int(item.get("quantity"))
        except (TypeError, ValueError):
            raise ValueError("Invalid product ID or quantity.")

        if product_id < 1 or quantity < 1:
            raise ValueError("Invalid product ID or quantity.")

        normalized_items.append({
            "product_id": product_id,
            "quantity": quantity,
            "size": str(item.get("size") or ""),
            "color": str(item.get("color") or ""),
        })

        quantities_by_product[product_id] = (
            quantities_by_product.get(product_id, 0) + quantity
        )

    # Lock and validate each product once, including duplicate cart entries.
    products_by_id = {}

    for product_id, total_quantity in quantities_by_product.items():
        try:
            product = Product.objects.select_for_update().get(
                pk=product_id
            )
        except Product.DoesNotExist:
            raise ValueError(
                f"Product {product_id} was not found."
            )

        if product.stock < total_quantity:
            raise ValueError(
                f"Insufficient stock for {product.name}. "
                f"Available: {product.stock}."
            )

        products_by_id[product_id] = product

    subtotal = Decimal("0.00")
    validated_items = []

    for item in normalized_items:
        product = products_by_id[item["product_id"]]

        price = product.price

        if (
            product.discount_price is not None
            and Decimal("0") < product.discount_price < product.price
        ):
            price = product.discount_price

        quantity = item["quantity"]
        subtotal += price * quantity

        validated_items.append({
            "product": product,
            "product_name": product.name,
            "quantity": quantity,
            "price": price,
            "size": item["size"],
            "color": item["color"],
        })

    setting = SiteSetting.objects.first()

    delivery_fee = (
        setting.delivery_fee
        if setting
        else Decimal("0.00")
    )

    total = subtotal + delivery_fee

    amount = int(
        (total * Decimal("100")).quantize(
            Decimal("1"),
            rounding=ROUND_HALF_UP,
        )
    )

    return validated_items, subtotal, delivery_fee, total, amount


def get_existing_order_response(payment_intent_id, user):
    existing_order = Order.objects.filter(
        stripe_payment_intent_id=payment_intent_id
    ).first()

    if not existing_order:
        return None

    # Never return another user's order.
    if existing_order.user_id != user.pk:
        return Response(
            {"error": "You are not allowed to access this order."},
            status=status.HTTP_403_FORBIDDEN,
        )

    return Response(
        {
            "message": "Order has already been confirmed.",
            "order": OrderSerializer(existing_order).data,
        },
        status=status.HTTP_200_OK,
    )


class CreatePaymentIntentView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            get_stripe_key()

            items = request.data.get("items")
            fingerprint = get_cart_fingerprint(items)

            # Calculate the amount using trusted database prices.
            with transaction.atomic():
                _, _, _, total, amount = calculate_order(items)

            if amount <= 0:
                return Response(
                    {
                        "error": (
                            "Payment amount must be greater than zero."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            intent = stripe.PaymentIntent.create(
                amount=amount,
                currency="pkr",
                metadata={
                    "cart_fingerprint": fingerprint,
                    "user_id": str(request.user.pk),
                },
            )

            return Response(
                {
                    "client_secret": intent.client_secret,
                    "payment_intent_id": intent.id,
                    "total": str(total),
                    "currency": "pkr",
                },
                status=status.HTTP_200_OK,
            )

        except ValueError as exc:
            return Response(
                {"error": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        except stripe.StripeError:
            return Response(
                {
                    "error": (
                        "Stripe could not initialize the payment."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )


class ConfirmStripeOrderView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data

        required_fields = [
            "fullName",
            "phone",
            "email",
            "city",
            "postalCode",
            "address",
            "payment_intent_id",
        ]

        for field in required_fields:
            if not data.get(field):
                return Response(
                    {"error": f"{field} is required."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        payment_intent_id = str(
            data["payment_intent_id"]
        ).strip()

        try:
            get_stripe_key()

            # Verify payment directly with Stripe.
            intent = stripe.PaymentIntent.retrieve(
                payment_intent_id
            )

            if intent.status != "succeeded":
                return Response(
                    {"error": "Payment has not been completed."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if intent.currency.lower() != "pkr":
                return Response(
                    {"error": "Payment currency does not match."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Ensure this payment intent belongs to the logged-in user.
            metadata = (
                intent.metadata.to_dict()
                if intent.metadata
                else {}
            )

            if metadata.get("user_id") != str(request.user.pk):
                return Response(
                    {
                        "error": (
                            "This payment does not belong to your account."
                        )
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )

            # Return an already-created order instead of duplicating it.
            existing_response = get_existing_order_response(
                payment_intent_id,
                request.user,
            )

            if existing_response is not None:
                return existing_response

            items = data.get("items")
            fingerprint = get_cart_fingerprint(items)

            saved_fingerprint = metadata.get("cart_fingerprint")

            if (
                not saved_fingerprint
                or saved_fingerprint != fingerprint
            ):
                return Response(
                    {
                        "error": (
                            "Cart does not match the original payment."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            with transaction.atomic():
                # Recheck inside the transaction to reduce duplicate orders.
                existing_order = Order.objects.filter(
                    stripe_payment_intent_id=payment_intent_id
                ).first()

                if existing_order:
                    if existing_order.user_id != request.user.pk:
                        return Response(
                            {
                                "error": (
                                    "You are not allowed to access this order."
                                )
                            },
                            status=status.HTTP_403_FORBIDDEN,
                        )

                    return Response(
                        {
                            "message": (
                                "Order has already been confirmed."
                            ),
                            "order": OrderSerializer(
                                existing_order
                            ).data,
                        },
                        status=status.HTTP_200_OK,
                    )

                (
                    validated_items,
                    subtotal,
                    delivery_fee,
                    total,
                    expected_amount,
                ) = calculate_order(items)

                if intent.amount != expected_amount:
                    return Response(
                        {
                            "error": (
                                "Payment amount does not match the order."
                            )
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                order = Order.objects.create(
                    user=request.user,
                    full_name=str(data["fullName"]).strip(),
                    phone=str(data["phone"]).strip(),
                    email=str(data["email"]).strip(),
                    city=str(data["city"]).strip(),
                    postal_code=str(data["postalCode"]).strip(),
                    address=str(data["address"]).strip(),
                    notes=str(data.get("notes") or "").strip(),
                    payment_method="stripe",
                    payment_status="paid",
                    order_status="confirmed",
                    subtotal=subtotal,
                    delivery_fee=delivery_fee,
                    total=total,
                    stripe_payment_intent_id=payment_intent_id,
                )

                for item in validated_items:
                    OrderItem.objects.create(
                        order=order,
                        **item,
                    )

                # Reduce stock only after the payment is verified.
                for product_id, quantity in {
                    item["product"].pk: 0
                    for item in validated_items
                }.items():
                    product = next(
                        item["product"]
                        for item in validated_items
                        if item["product"].pk == product_id
                    )
                    total_quantity = sum(
                        item["quantity"]
                        for item in validated_items
                        if item["product"].pk == product_id
                    )
                    product.stock -= total_quantity
                    product.save(update_fields=["stock"])

            return Response(
                {
                    "message": "Payment successful. Order confirmed.",
                    "order": OrderSerializer(order).data,
                },
                status=status.HTTP_201_CREATED,
            )

        except IntegrityError:
            existing_order = Order.objects.filter(
                stripe_payment_intent_id=payment_intent_id
            ).first()

            if (
                existing_order
                and existing_order.user_id == request.user.pk
            ):
                return Response(
                    {
                        "message": (
                            "Order has already been confirmed."
                        ),
                        "order": OrderSerializer(
                            existing_order
                        ).data,
                    },
                    status=status.HTTP_200_OK,
                )

            return Response(
                {"error": "Could not confirm the order safely."},
                status=status.HTTP_409_CONFLICT,
            )

        except ValueError as exc:
            return Response(
                {"error": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        except stripe.StripeError:
            return Response(
                {
                    "error": (
                        "Stripe payment verification failed."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
