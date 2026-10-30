
from django.urls import path
from .views import DeliveryFeeView

urlpatterns = [
    path(
        "delivery-fee/",
        DeliveryFeeView.as_view(),
        name="delivery-fee"
    ),
]
