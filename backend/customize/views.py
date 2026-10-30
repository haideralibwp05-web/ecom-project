
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import SiteSetting
from .serializers import SiteSettingSerializer


class DeliveryFeeView(APIView):
    authentication_classes = [JWTAuthentication]

    def get_permissions(self):
        if self.request.method == "GET":
            return [IsAuthenticated()]

        return [IsAdminUser()]

    def get(self, request):
        setting, _ = SiteSetting.objects.get_or_create(pk=1)
        serializer = SiteSettingSerializer(setting)
        return Response(serializer.data)

    def put(self, request):
        setting, _ = SiteSetting.objects.get_or_create(pk=1)

        serializer = SiteSettingSerializer(
            setting,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({
            "message": "Delivery fee updated successfully.",
            "delivery_fee": serializer.data["delivery_fee"],
        })
