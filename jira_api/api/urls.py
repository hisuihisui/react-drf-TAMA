from django.urls import path, include
from rest_framework import routers

# modelviewsetを登録し、viewとpathを紐づける
router = routers.DefaultRouter()

urlpatterns = [
    # routerに誘導
    path("", include(router.urls))
]
