from django.urls import path
from . import views

urlpatterns = [
    path("", views.get_products, name="get-products"),
    path("add/", views.add_product, name="add-product"),
    path("<int:product_id>/delete/", views.delete_product, name="delete-product"),
    path("<int:product_id>/update/", views.update_product, name="update-product"),
]
