
from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=100)

    # Parent category ke liye image optional hai.
    # Subcategory ke liye image serializer mein required hogi.
    image = models.ImageField(
        upload_to="categories/",
        null=True,
        blank=True,
    )

    parent = models.ForeignKey(
        "self",
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="subcategories",
    )

    def __str__(self):
        if self.parent_id:
            return f"{self.parent.name} → {self.name}"
        return self.name
