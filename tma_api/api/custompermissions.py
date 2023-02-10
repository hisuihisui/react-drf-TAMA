from rest_framework import permissions


class OwnerPermission(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        # GETメソッドならTrueを返す（制限なし）
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.owner.id == request.user.id
