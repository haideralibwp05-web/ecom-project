
from django.urls import path

from .views import (
    CreateCODOrderView,
    AdminOrderListView,
    AdminOrderDetailView,
    MyOrdersView,
    AdminCustomerListView,
    AdminCustomerDetailView,
)

urlpatterns = [
    path(
        "",
        AdminOrderListView.as_view(),
        name="admin-order-list",
    ),

    path(
        "create/",
        CreateCODOrderView.as_view(),
        name="create-cod-order",
    ),

    path(
        "my-orders/",
        MyOrdersView.as_view(),
        name="my-orders",
    ),

    path(
        "customers/",
        AdminCustomerListView.as_view(),
        name="admin-customer-list",
    ),

    path(
        "customers/<int:customer_id>/",
        AdminCustomerDetailView.as_view(),
        name="admin-customer-detail",
    ),

    path(
        "<int:order_id>/",
        AdminOrderDetailView.as_view(),
        name="admin-order-detail",
    ),
]
