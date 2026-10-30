
from django.db.models import ProtectedError

from rest_framework import generics, status
from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes,
)
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import Category
from .serializers import CategorySerializer


class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.select_related("parent").order_by("id")
    serializer_class = CategorySerializer
    authentication_classes = [JWTAuthentication]

    def get_permissions(self):
        if self.request.method == "GET":
            return [IsAuthenticated()]

        return [IsAdminUser()]


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.select_related("parent").order_by("id")
    serializer_class = CategorySerializer
    authentication_classes = [JWTAuthentication]

    def get_permissions(self):
        if self.request.method == "GET":
            return [IsAuthenticated()]

        return [IsAdminUser()]

    def destroy(self, request, *args, **kwargs):
        category = self.get_object()

        error_response = get_category_delete_error(category)
        if error_response:
            return error_response

        try:
            category.delete()
        except ProtectedError:
            return Response(
                {
                    "message": (
                        "This category cannot be deleted because "
                        "it is being used by other records."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {"message": "Category deleted successfully"},
            status=status.HTTP_200_OK,
        )


def get_category_delete_error(category):
    if category.products.exists():
        return Response(
            {
                "message": (
                    "This category contains products "
                    "and cannot be deleted."
                )
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    if category.subcategories.exists():
        return Response(
            {
                "message": (
                    "This category contains subcategories. "
                    "Delete its subcategories first."
                )
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    return None


@api_view(["DELETE"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAdminUser])
def delete_category(request, category_id):
    try:
        category = Category.objects.get(id=category_id)
    except Category.DoesNotExist:
        return Response(
            {"message": "Category not found"},
            status=status.HTTP_404_NOT_FOUND,
        )

    error_response = get_category_delete_error(category)
    if error_response:
        return error_response

    try:
        category.delete()
    except ProtectedError:
        return Response(
            {
                "message": (
                    "This category cannot be deleted because "
                    "it is being used by other records."
                )
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    return Response(
        {"message": "Category deleted successfully"},
        status=status.HTTP_200_OK,
    )
