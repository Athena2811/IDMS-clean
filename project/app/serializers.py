from rest_framework import serializers
from .models import Theme, Item, ClientRoom, AIDesign, RoomType,RoomMaterial,Design

class ThemeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Theme
        fields = "__all__"
class RoomTypeSerializer(serializers.ModelSerializer):
    icon = serializers.SerializerMethodField()

    class Meta:
        model = RoomType
        fields = ["id", "name", "icon"]

    def get_icon(self, obj):
        request = self.context.get("request")

        if obj.icon:
            return request.build_absolute_uri(obj.icon.url)

        return None

class ItemSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Item
        fields = ["id", "name", "price", "image"]

    def get_image(self, obj):
        request = self.context.get("request")
        if obj.image:
            return request.build_absolute_uri(obj.image.url)
        return None


class ClientRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientRoom
        fields = "__all__"


class AIDesignSerializer(serializers.ModelSerializer):
    generated_image = serializers.ImageField(read_only=True)

    class Meta:
        model = AIDesign
        fields = [
            "id",
            "generated_image",
            "prompt_used",
            "created_at",
            "user",
            "client_room",
            "theme",
            "selected_items",
        ]

# class RoomTypeSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = RoomType
#         fields = '__all__'

class RoomMaterialSerializer(serializers.ModelSerializer):
    preview_image = serializers.SerializerMethodField()

    class Meta:
        model = RoomMaterial
        fields = ["id", "name", "material_type", "preview_image", "ai_prompt_hint"]

    def get_preview_image(self, obj):
        request = self.context.get("request")
        if obj.preview_image:
            return request.build_absolute_uri(obj.preview_image.url)
        return None

class DesignSerializer(serializers.ModelSerializer):
    class Meta:
        model = Design
        fields = [
            "id",
            "theme",
            "client_room",
            "prompt",
            "generated_image",
            "created_at"
        ]