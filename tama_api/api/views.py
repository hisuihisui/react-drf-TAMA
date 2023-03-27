from django.contrib.auth.models import User
from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response

from . import custompermissions
from .models import Category, Profile, Task
from .serializers import (
    CategorySerializer,
    ProfileSerializer,
    TaskSerializer,
    UserSerializer,
)


# 新規ユーザ作成用エンドポイント
# generics.createAPIView : ある特定のメソッド（今回はCreate）に特化したview
class CreateUserView(generics.CreateAPIView):
    serializer_class = UserSerializer
    # ログインしていないユーザーでもアクセスできるようにする
    permission_classes = (permissions.AllowAny,)


# ユーザー一覧取得
class ListUserView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


# ログインユーザー情報取得
# RetrieveUpdateAPIView:特定の情報を検索して返す
class LoginUserView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer

    def get_object(self):
        # ログインしているユーザーオブジェクトを返す
        return self.request.user

    def update(self, request, *args, **kwargs):
        response = {"message": "PUT method is not allowed"}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)


# プロフィールの作成、更新
# CRUDを使用可能
class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

    # CRUDのCreateにあたる処理
    def perform_create(self, serializer):
        # ログインしているユーザーの情報を指定して登録する
        serializer.save(user_profile=self.request.user)

    # deleteメソッドを使用不可にする
    def destroy(self, *args, **kwargs):
        response = {"message": "DELETE method is not allowed"}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)

    # updateメソッドを使用不可にする
    def partial_update(self, request, *args, **kwargs):
        response = {"message": "PATCH method is not allowed"}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)


# カテゴリの新規作成
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    # deleteメソッドを使用不可にする
    def destroy(self, *args, **kwargs):
        response = {"message": "DELETE method is not allowed"}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)

    # updateメソッドを使用不可にする
    def update(self, request, *args, **kwargs):
        response = {"message": "PUT method is not allowed"}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)

    # updateメソッドを使用不可にする
    def partial_update(self, request, *args, **kwargs):
        response = {"message": "PATCH method is not allowed"}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)


# タスクのCRUD
class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = (
        permissions.IsAuthenticated,
        custompermissions.OwnerPermission,
    )

    # タスク作成時にオーナーをログインユーザーに割り当てる
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    # updateメソッドを使用不可にする
    def partial_update(self, request, *args, **kwargs):
        response = {"message": "PATCH method is not allowed"}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)
