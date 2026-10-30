from django.shortcuts import render
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives

# Create your views here.
from rest_framework.permissions import IsAuthenticated
from .serializers import (
    ProfileUpdateSerializer,
    ChangePasswordSerializer,
)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken


# signup
from .serializers import SignupSerializer

# login
from .serializers import LoginSerializer

# forget password
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator

# from django.core.mail import send_mail
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
# from .serializers import ForgotPasswordSerializer

# reset password
from .serializers import ForgotPasswordSerializer, ResetPasswordSerializer


# Signup view
class SignupView(APIView):
    def post(self, request):

        serializer = SignupSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response(
                {"message": "User created successfully"}, status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Login view


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data["user"]
            refresh = RefreshToken.for_user(user)

            return Response(
                {
                    "message": "Login successful",
                    "username": user.username,
                    "email": user.email,
                    "is_staff": user.is_staff,
                    "is_superuser": user.is_superuser,
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                },
                status=status.HTTP_200_OK,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )


# foget password view


class ForgotPasswordAPIView(APIView):
    def post(self, request):

        serializer = ForgotPasswordSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data["email"]

        user = User.objects.get(email=email)

        # Generate UID
        uid = urlsafe_base64_encode(force_bytes(user.pk))

        # Generate reset token
        token = default_token_generator.make_token(user)

        # Reset link
        reset_link = f"http://localhost:5173/reset-password/{uid}/{token}/"

        # Load HTML email template
        html_content = render_to_string(
            "emails/forget_password.html",
            {
                "reset_link": reset_link,
            },
        )

        # Create email
        email_message = EmailMultiAlternatives(
            subject="Reset Your Password - FalconsEdTech",
            body=f"""
Hello {user.username},

You requested to reset your password.

Please use the link below to reset your password:

{reset_link}
If you did not request this, please ignore this email.

Thanks,
FalconsEdTech Team
""",
            from_email=None,
            to=[user.email],
        )

        # Attach HTML version
        email_message.attach_alternative(html_content, "text/html")

        # Send email
        email_message.send()

        return Response(
            {"message": "Password reset link has been sent to your email."},
            status=status.HTTP_200_OK,
        )


# reset password view


class ResetPasswordAPIView(APIView):
    def post(self, request):

        serializer = ResetPasswordSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.validated_data["user"]

        user.set_password(serializer.validated_data["new_password"])

        user.save()

        return Response(
            {"message": "Password has been reset successfully."},
            status=status.HTTP_200_OK,
        )


# Get and update logged-in user's profile
class ProfileAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(
            {
                "username": request.user.username,
                "email": request.user.email,
            }
        )

    def patch(self, request):
        serializer = ProfileUpdateSerializer(
            request.user,
            data=request.data,
            partial=True,
            context={"request": request},
        )

        if serializer.is_valid():
            serializer.save()

            return Response(
                {
                    "message": "Profile updated successfully.",
                    "username": request.user.username,
                    "email": request.user.email,
                }
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )


# Change logged-in user's password
class ChangePasswordAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data,
            context={"request": request},
        )

        if serializer.is_valid():
            request.user.set_password(serializer.validated_data["new_password"])
            request.user.save()

            return Response({"message": "Password updated successfully."})

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )
