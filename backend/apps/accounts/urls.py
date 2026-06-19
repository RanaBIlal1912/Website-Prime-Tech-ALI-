from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    LoginView,
    LogoutView,
    MeViewSet,
    PermissionViewSet,
    RefreshView,
    RoleViewSet,
    UserViewSet,
)

router = DefaultRouter()
router.register("users", UserViewSet, basename="user")
router.register("roles", RoleViewSet, basename="role")
router.register("permissions", PermissionViewSet, basename="permission")

urlpatterns = [
    path("login/", LoginView.as_view(), name="login"),
    path("refresh/", RefreshView.as_view(), name="token-refresh"),
    path("logout/", LogoutView.as_view({"post": "create"}), name="logout"),
    path("me/", MeViewSet.as_view({"get": "list"}), name="me"),
    path(
        "me/change-password/",
        MeViewSet.as_view({"post": "change_password"}),
        name="change-password",
    ),
]

urlpatterns += router.urls
