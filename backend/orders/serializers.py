
from rest_framework import serializers
from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    product_image = serializers.SerializerMethodField()

    def get_product_image(self, obj):
        if not obj.product_id:
            return None

        image = obj.product.images.first()

        if not image or not image.image:
            return None

        request = self.context.get("request")
        image_url = image.image.url

        if request:
            return request.build_absolute_uri(image_url)

        return image_url

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "product",
            "product_name",
            "product_image",
            "quantity",
            "price",
            "size",
            "color",
        ]
        read_only_fields = fields


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "full_name",
            "phone",
            "email",
            "city",
            "postal_code",
            "address",
            "notes",
            "payment_method",
            "payment_status",
            "order_status",
            "subtotal",
            "delivery_fee",
            "total",
            "stripe_payment_intent_id",
            "items",
            "created_at",
        ]
