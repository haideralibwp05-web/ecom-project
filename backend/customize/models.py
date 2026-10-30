from django.db import models

# Create your models here.

from django.db import models


class SiteSetting(models.Model):
    delivery_fee = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    def __str__(self):
        return f"Delivery Fee: {self.delivery_fee}"

    class Meta:
        verbose_name = "Site Setting"
        verbose_name_plural = "Site Settings"
