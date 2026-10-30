
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.db import transaction
from django.db.models import Count, Sum, Q
from rest_framework import status
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from products.models import Product
from customize.models import SiteSetting
from .models import Order, OrderItem
from .serializers import OrderSerializer


User = get_user_model()


class CreateCODOrderView(APIView):
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
        ]

        for field in required_fields:
            if not data.get(field):
                return Response(
                    {"error": f"{field} is required."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        items = data.get("items")

        if not isinstance(items, list) or not items:
            return Response(
                {"error": "Your cart is empty or invalid."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        with transaction.atomic():
            subtotal = Decimal("0.00")
            validated_items = []
            quantities_by_product = {}

            for item in items:
                if not isinstance(item, dict):
                    return Response(
                        {"error": "Invalid cart item."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                try:
                    product_id = int(item.get("productId"))
                    quantity = int(item.get("quantity"))
                except (TypeError, ValueError):
                    return Response(
                        {"error": "Invalid product or quantity."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                if quantity < 1:
                    return Response(
                        {"error": "Quantity must be at least 1."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                quantities_by_product[product_id] = (
                    quantities_by_product.get(product_id, 0) + quantity
                )

                try:
                    product = Product.objects.get(pk=product_id)
                except Product.DoesNotExist:
                    return Response(
                        {"error": f"Product {product_id} not found."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                price = product.price

                if (
                    product.discount_price is not None
                    and Decimal("0") < product.discount_price < product.price
                ):
                    price = product.discount_price

                size = str(item.get("size") or "")
                color = str(item.get("color") or "")

                subtotal += price * quantity

                validated_items.append(
                    {
                        "product": product,
                        "product_name": product.name,
                        "quantity": quantity,
                        "price": price,
                        "size": size,
                        "color": color,
                    }
                )

            for product_id, quantity in quantities_by_product.items():
                product = Product.objects.get(pk=product_id)

                if product.stock < quantity:
                    return Response(
                        {
                            "error": (
                                f"Insufficient stock for {product.name}. "
                                f"Available: {product.stock}."
                            )
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            setting = SiteSetting.objects.first()
            delivery_fee = (
                setting.delivery_fee if setting else Decimal("0.00")
            )
            total = subtotal + delivery_fee

            order = Order.objects.create(
                user=request.user,
                full_name=str(data["fullName"]).strip(),
                phone=str(data["phone"]).strip(),
                email=str(data["email"]).strip(),
                city=str(data["city"]).strip(),
                postal_code=str(data["postalCode"]).strip(),
                address=str(data["address"]).strip(),
                notes=str(data.get("notes") or "").strip(),
                payment_method="cod",
                payment_status="pending",
                order_status="pending",
                subtotal=subtotal,
                delivery_fee=delivery_fee,
                total=total,
            )

            for item in validated_items:
                OrderItem.objects.create(order=order, **item)

            for product_id, quantity in quantities_by_product.items():
                product = Product.objects.get(pk=product_id)
                product.stock -= quantity
                product.save(update_fields=["stock"])

        return Response(
            {
                "message": "Order placed successfully.",
                "order": OrderSerializer(
                    order,
                    context={"request": request},
                ).data,
            },
            status=status.HTTP_201_CREATED,
        )


class AdminOrderListView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAdminUser]

    def get(self, request):
        orders = (
            Order.objects
            .prefetch_related("items", "items__product__images")
            .order_by("-created_at")
        )

        serializer = OrderSerializer(
            orders,
            many=True,
            context={"request": request},
        )

        return Response(
            {
                "count": orders.count(),
                "results": serializer.data,
            }
        )


class AdminOrderDetailView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAdminUser]

    def get(self, request, order_id):
        try:
            order = (
                Order.objects
                .prefetch_related(
                    "items",
                    "items__product__images",
                )
                .get(id=order_id)
            )
        except Order.DoesNotExist:
            return Response(
                {"error": "Order not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = OrderSerializer(
            order,
            context={"request": request},
        )

        return Response(serializer.data, status=status.HTTP_200_OK)


class MyOrdersView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = (
            Order.objects
            .filter(user=request.user)
            .prefetch_related("items", "items__product__images")
            .order_by("-created_at")
        )

        serializer = OrderSerializer(
            orders,
            many=True,
            context={"request": request},
        )

        return Response(
            {
                "count": orders.count(),
                "results": serializer.data,
            }
        )


class AdminCustomerListView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAdminUser]

    def get(self, request):
        customers = (
            User.objects
            .filter(is_staff=False, is_superuser=False)
            .annotate(
                total_orders=Count("orders", distinct=True),
                total_spent=Sum("orders__total"),
            )
            .order_by("username")
        )

        results = []

        for customer in customers:
            results.append(
                {
                    "id": customer.pk,
                    "username": customer.get_username(),
                    "email": customer.email or "",
                    "total_orders": customer.total_orders or 0,
                    "total_spent": str(
                        customer.total_spent or Decimal("0.00")
                    ),
                }
            )

        return Response(
            {
                "count": len(results),
                "results": results,
            },
            status=status.HTTP_200_OK,
        )


class AdminCustomerDetailView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAdminUser]

    def get(self, request, customer_id):
        try:
            customer = User.objects.get(
                pk=customer_id,
                is_staff=False,
                is_superuser=False,
            )
        except User.DoesNotExist:
            return Response(
                {"error": "Customer not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        orders = (
            Order.objects
            .filter(user_id=customer.pk)
            .prefetch_related(
                "items",
                "items__product__images",
            )
            .order_by("-created_at")
        )

        order_summary = orders.aggregate(
            total_orders=Count("id"),
            total_spent=Sum("total"),
        )

        latest_order = orders.first()

        serializer = OrderSerializer(
            orders,
            many=True,
            context={"request": request},
        )

        return Response(
            {
                "customer": {
                    "id": customer.pk,
                    "username": customer.get_username(),
                    "email": customer.email or "",
                    "date_joined": customer.date_joined,
                },
                "summary": {
                    "total_orders": order_summary["total_orders"] or 0,
                    "total_spent": str(
                        order_summary["total_spent"] or Decimal("0.00")
                    ),
                    "last_order_id": latest_order.id if latest_order else None,
                    "last_order_date": (
                        latest_order.created_at if latest_order else None
                    ),
                },
                "orders": serializer.data,
            },
            status=status.HTTP_200_OK,
        )
