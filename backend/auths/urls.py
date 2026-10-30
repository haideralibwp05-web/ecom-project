from django.urls import path
from .views import SignupView
from .views import LoginView
from .views import ForgotPasswordAPIView, ResetPasswordAPIView
from rest_framework_simplejwt.views import TokenRefreshView
from .views import ProfileAPIView, ChangePasswordAPIView

urlpatterns = [
    path("signup/", SignupView.as_view(), name="signup"),
    path("login/", LoginView.as_view(), name="login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("forgot-password/", ForgotPasswordAPIView.as_view(), name="forgot-password"),
    path("reset-password/", ResetPasswordAPIView.as_view(), name="reset-password"),
    path("profile/", ProfileAPIView.as_view(), name="profile"),
    path("change-password/",ChangePasswordAPIView.as_view(),name="change-password",)
]

