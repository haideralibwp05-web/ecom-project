from django.db import models
from categories.models import Category
import random
from decimal import Decimal


def generate_rating():
    return Decimal(random.randint(35, 50)) / Decimal("10")


class Product(models.Model):
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name="products"
    )
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_price = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    color_name = models.CharField(max_length=50, blank=True)
    color_hex = models.CharField(max_length=20, blank=True)
    sizes = models.JSONField(default=list, blank=True)
    stock = models.IntegerField(default=0)

    rating = models.DecimalField(
        max_digits=2, decimal_places=1, default=generate_rating
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


# seprate model for images


class ProductImage(models.Model):
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="images"
    )
    image = models.ImageField(upload_to="product_images/")

    def __str__(self):
        return f"{self.product.name} Image"
