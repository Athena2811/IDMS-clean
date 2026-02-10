from rest_framework import serializers
from .models import Theme, Item, ClientRoom, AIDesign, RoomType,RoomMaterial,Design

class ThemeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Theme
        fields = "__all__"

class RoomTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomType
        fields = "__all__"


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = "__all__"


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

class RoomTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomType
        fields = '__all__'

class RoomMaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomMaterial
        fields = "__all__"


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