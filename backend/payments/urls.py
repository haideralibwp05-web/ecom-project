
from django.urls import path
from .views import CreatePaymentIntentView, ConfirmStripeOrderView

urlpatterns = [
    path(
        "create-intent/",
        CreatePaymentIntentView.as_view(),
        name="create-payment-intent",
    ),
    path(
        "confirm-order/",
        ConfirmStripeOrderView.as_view(),
        name="confirm-stripe-order",
    ),
]
