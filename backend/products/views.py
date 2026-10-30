
from django.db.models import Sum

from rest_framework import status
from rest_framework.decorators import (
    api_view,
    parser_classes,
    permission_classes,
    authentication_classes,
)
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import Product, ProductImage
from .serializers import ProductSerializer
from categories.models import Category
from orders.models import OrderItem


# AUTHENTICATED USERS: Products, category products and top-selling products
@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_products(request):
    category_id = request.GET.get("category")
    section = request.GET.get("section")

    products = Product.objects.all().order_by("-created_at", "-id")

    if section == "top-selling":
        top_selling = (
            OrderItem.objects.filter(
                product__isnull=False,
                order__order_status__in=["pending", "confirmed"],
            )
            .values("product_id")
            .annotate(total_sold=Sum("quantity"))
            .order_by("-total_sold", "product_id")
        )

        product_ids = [item["product_id"] for item in top_selling]

        product_map = {
            product.id: product
            for product in Product.objects.filter(
                id__in=product_ids
            ).prefetch_related("images")
        }

        products = [
            product_map[product_id]
            for product_id in product_ids
            if product_id in product_map
        ]

        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if category_id:
        products = products.filter(category_id=category_id)

    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


# ADMIN ONLY: Create product
@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def add_product(request):
    data = request.data

    try:
        category_id = data.get("category")
        category = Category.objects.get(id=category_id)

        discount_price = data.get("discount_price") or 0
        sizes = data.getlist("sizes")

        product = Product.objects.create(
            category=category,
            name=data.get("name"),
            description=data.get("description"),
            price=data.get("price"),
            discount_price=discount_price,
            color_name=data.get("color_name", ""),
            color_hex=data.get("color_hex", ""),
            sizes=sizes,
            stock=data.get("stock", 0),
        )

        for image in request.FILES.getlist("images"):
            ProductImage.objects.create(
                product=product,
                image=image,
            )

        serializer = ProductSerializer(product)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
        )

    except Category.DoesNotExist:
        return Response(
            {"error": "Category not found"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    except Exception:
        return Response(
            {"error": "Unable to create product. Check the submitted data."},
            status=status.HTTP_400_BAD_REQUEST,
        )


# ADMIN ONLY: Delete product
@api_view(["DELETE"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAdminUser])
def delete_product(request, product_id):
    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response(
            {"message": "Product not found"},
            status=status.HTTP_404_NOT_FOUND,
        )

    product.delete()

    return Response(
        {"message": "Product deleted successfully"},
        status=status.HTTP_200_OK,
    )


# ADMIN ONLY: Update product
@api_view(["PATCH"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def update_product(request, product_id):
    try:
        product = Product.objects.get(id=product_id)
        data = request.data

        if "name" in data:
            product.name = data.get("name")

        if "description" in data:
            product.description = data.get("description")

        if "price" in data:
            product.price = data.get("price")

        if "discount_price" in data:
            product.discount_price = data.get("discount_price") or 0

        if "category" in data:
            product.category = Category.objects.get(
                id=data.get("category")
            )

        if "color_name" in data:
            product.color_name = data.get("color_name", "")

        if "color_hex" in data:
            product.color_hex = data.get("color_hex", "")

        if "sizes" in data:
            product.sizes = data.getlist("sizes")

        if "stock" in data:
            product.stock = data.get("stock") or 0

        product.save()

        # Remove selected existing images
        for image_id in data.getlist("removed_images"):
            try:
                image = ProductImage.objects.get(
                    id=image_id,
                    product=product,
                )
                image.delete()
            except ProductImage.DoesNotExist:
                pass

        # Add newly uploaded images
        for image in request.FILES.getlist("images"):
            ProductImage.objects.create(
                product=product,
                image=image,
            )

        serializer = ProductSerializer(product)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Product.DoesNotExist:
        return Response(
            {"error": "Product not found"},
            status=status.HTTP_404_NOT_FOUND,
        )

    except Category.DoesNotExist:
        return Response(
            {"error": "Category not found"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    except Exception:
        return Response(
            {"error": "Unable to update product. Check the submitted data."},
            status=status.HTTP_400_BAD_REQUEST,
        )
