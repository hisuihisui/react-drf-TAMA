import uuid

from django.contrib.auth.models import User
from django.core.validators import MinValueValidator
from django.db import models


def upload_avatar_path(instance, filename):
    # 拡張子
    ext = filename.split(".")[-1]
    return "/".join(
        ["avatars", str(instance.user_profile.id) + str(".") + str(ext)]
    )


class Profile(models.Model):
    # プロフィールとUserを１対１でひもづける
    user_profile = models.OneToOneField(
        User,
        related_name="user_profile",
        # Userのデータが削除されたときに一緒に削除する
        on_delete=models.CASCADE,
    )
    # アバター画像
    img = models.ImageField(
        blank=True, null=True, upload_to=upload_avatar_path
    )

    def __str__(self):
        return self.user_profile.username


class Category(models.Model):
    item = models.CharField(max_length=100)

    def __str__(self):
        return self.item


class Task(models.Model):
    STATUS = (
        ("1", "Not Started"),
        ("2", "On going"),
        ("3", "Done"),
    )

    id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    task = models.CharField(max_length=100)
    description = models.CharField(max_length=300)
    criteria = models.CharField(max_length=100)
    status = models.CharField(max_length=40, choices=STATUS, default="1")
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    estimate = models.IntegerField(validators=[MinValueValidator(0)])
    owner = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="owner"
    )
    responsible = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="responsible"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.task
