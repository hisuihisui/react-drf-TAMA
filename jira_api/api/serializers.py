from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Category, Profile, Task


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        # fieldsにオプションを付与する
        # パスワードに読み取り不可、必須
        extra_kwargs = {"password": {"write_only": True, "required": True}}

    # passwprdをハッシュ化してDBに保存
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["id", "user_profile", "img"]
        extra_kwargs = {"user_profile": {"read_only": True}}


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "item"]


class TaskSerializer(serializers.ModelSerializer):
    # 外部キーを参照しているものはIDを取得する
    # IDではなく、そのモデルの特定のカラムを取得したい
    # 例：カテゴリのitemを取得したい
    category_item = serializers.ReadOnlyField(
        source="category.item", read_only=True
    )
    # ownerの名前を取得したい
    owner_username = serializers.ReadOnlyField(
        source="owner.username", read_only=True
    )
    # responsibleの名前を取得
    responsible_username = serializers.ReadOnlyField(
        source="responsible.username", read_only=True
    )
    # Statusはデフォルトだと数字の文字列がとれる
    # Statusの値を取得したい
    # sourceに get_使用しているタプル名の小文字_display を指定
    status_name = serializers.CharField(
        source="get_status_display", read_only=True
    )

    # DateTimeFieldのフォーマットを整形
    created_at = serializers.DateTimeField(
        format="%Y-%m-%d %H:%M", read_only=True
    )
    updated_at = serializers.DateTimeField(
        format="%Y-%m-%d %H:%M", read_only=True
    )

    class Meta:
        model = Task
        fields = [
            "id",
            "task",
            "description",
            "criteria",
            "status",
            "status_name",
            "category",
            "category_item",
            "estimate",
            "owner",
            "owner_username",
            "responsible",
            "responsible_username",
            "created_at",
            "updated_at",
        ]
        # owner はTask作成時に自動で割り当てられるため、読み取りのみ
        extra_kwargs = {"owner": {"read_only": True}}
