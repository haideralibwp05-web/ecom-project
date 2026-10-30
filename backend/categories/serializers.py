from rest_framework import serializers
from .models import Category


class CategorySerializer(serializers.ModelSerializer):
    parent_name = serializers.CharField(
        source="parent.name",
        read_only=True,
        allow_null=True,
    )

    class Meta:
        model = Category
        fields = [
            "id",
            "name",
            "image",
            "parent",
            "parent_name",
        ]

        extra_kwargs = {
            "image": {
                "required": False,
                "allow_null": True,
            },
            "parent": {
                "required": False,
                "allow_null": True,
            },
        }

    def validate_parent(self, parent):
        instance = self.instance

        # Category apni khud ki parent nahi ban sakti.
        if instance and parent and parent.pk == instance.pk:
            raise serializers.ValidationError("A category cannot be its own parent.")

        if parent is None:
            return parent

        # Subcategory ko parent ke taur par select nahi kar sakte.
        if parent.parent_id is not None:
            raise serializers.ValidationError(
                "A subcategory cannot be selected as a parent."
            )

        # Jis category ki apni subcategories hon,
        # use subcategory nahi banaya ja sakta.
        if instance and instance.subcategories.exists():
            raise serializers.ValidationError(
                "This category has subcategories and cannot become a subcategory."
            )

        return parent

    def validate(self, attrs):
        instance = self.instance

        if instance:
            parent = attrs.get("parent", instance.parent)
            image = attrs.get("image", instance.image)
        else:
            parent = attrs.get("parent")
            image = attrs.get("image")

        # Subcategory ke liye image required hai.
        if parent is not None and not image:
            raise serializers.ValidationError(
                {"image": "An image is required for a subcategory."}
            )

        return attrs
