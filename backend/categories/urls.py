from django.urls import path
from .views import (
    CategoryListCreateView,
    CategoryDetailView,
    delete_category,
)

urlpatterns = [
    path("", CategoryListCreateView.as_view(), name="category-list-create"),
    path("<int:pk>/", CategoryDetailView.as_view(), name="category-detail"),
    path(
        "<int:category_id>/delete/",
        delete_category,
        name="delete-category",
    ),
]
