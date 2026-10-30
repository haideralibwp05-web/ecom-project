from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

from .models import SiteSetting


class DeliveryFeeViewTests(TestCase):
    def test_put_persists_delivery_fee(self):
        user = get_user_model().objects.create_user(
            username="admin",
            password="password",
            is_staff=True,
        )
        client = APIClient()
        client.force_authenticate(user=user)

        response = client.put(
            "/api/customize/delivery-fee/",
            {"delivery_fee": "125.50"},
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["delivery_fee"], "125.50")

        setting = SiteSetting.objects.get(pk=1)
        self.assertEqual(str(setting.delivery_fee), "125.50")
