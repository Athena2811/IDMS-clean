from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.files import File
from django.conf import settings
import os
from django.contrib.auth.models import User
from rest_framework import status
from .models import Design
from .serializers import DesignSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.views import APIView
from rest_framework import generics
from .models import Theme, Item, ClientRoom, AIDesign, RoomType,RoomMaterial
from .serializers import (
    ThemeSerializer,
    ItemSerializer,
    ClientRoomSerializer,
    AIDesignSerializer,
    RoomTypeSerializer,
    RoomMaterialSerializer
)

from rest_framework.decorators import permission_classes,api_view
from .ai_service import generate_ai_image

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_design(request):
    user = request.user

    theme_id = request.data.get("theme")
    room_id = request.data.get("client_room")
    item_ids = request.data.get("items", [])
    prompt = request.data.get("prompt", "")

    if not theme_id or not room_id:
        return Response(
            {"error": "theme and client_room are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    theme = Theme.objects.get(id=theme_id)
    room = ClientRoom.objects.get(id=room_id)
    items = Item.objects.filter(id__in=item_ids)

    final_prompt = build_ai_prompt(room, theme, items, prompt)

    ai_design = AIDesign.objects.create(
        user=user,
        client_room=room,
        theme=theme,
        prompt_used=final_prompt
    )

    ai_design.selected_items.set(items)

    # 🔥 REAL AI IMAGE GENERATION
    image_url = generate_ai_image(ai_design)

    # Save to profile history
    design = Design.objects.create(
        user=user,
        theme=theme,
        client_room=room,
        prompt=prompt,
        generated_image=ai_design.generated_image
    )

    return Response({
        "message": "AI design generated",
        "design_id": design.id,
        "image": image_url
    }, status=status.HTTP_201_CREATED)

@api_view(["POST"])
def register(request):
    username = request.data.get("username")
    password = request.data.get("password")

    if not username or not password:
        return Response(
            {"error": "Username and password required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(username=username).exists():
        return Response(
            {"error": "Username already exists"},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = User.objects.create_user(
        username=username,
        password=password
    )

    return Response(
        {"message": "User registered successfully"},
        status=status.HTTP_201_CREATED
    )
@api_view(["GET"])
def get_themes(request):
    themes = Theme.objects.all()
    serializer = ThemeSerializer(themes, many=True)
    return Response(serializer.data)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_items(request):
    queryset = Item.objects.all()

    theme_id = request.GET.get("theme")
    room_type_id = request.GET.get("room_type")

    if theme_id:
        queryset = queryset.filter(themes__id=theme_id)

    if room_type_id:
        queryset = queryset.filter(room_types__id=room_type_id)

    serializer = ItemSerializer(queryset, many=True)
    return Response(serializer.data)


@api_view(["POST"])
def upload_room(request):
    serializer = ClientRoomSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def build_ai_prompt(room, theme, items, prompt="", palette=None):
    item_names = ", ".join([item.name for item in items])

    palette_text = ""
    if palette:
        palette_text = f"Color palette preference: {palette}. "

    return f"""
    Interior design of a {room.room_type.name}.
    Theme: {theme.name}.
    Reference furniture: {item_names}.
    {palette_text}
    User preference: {prompt}
    Ultra realistic, professional interior photography,
    soft natural lighting, high detail, 4k.
    """


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_materials(request):
    material_type = request.GET.get("type")
    qs = RoomMaterial.objects.all()

    if material_type:
        qs = qs.filter(material_type=material_type)

    serializer = RoomMaterialSerializer(qs, many=True)
    return Response(serializer.data)
class RoomTypeListView(generics.ListAPIView):
    queryset = RoomType.objects.all()
    serializer_class = RoomTypeSerializer
    permission_classes = [IsAuthenticated]


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_design(request, design_id):
    design = AIDesign.objects.get(id=design_id, user=request.user)
    serializer = AIDesignSerializer(design)
    return Response(serializer.data)

class MyDesignsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        designs = Design.objects.filter(user=request.user).order_by("-created_at")
        serializer = DesignSerializer(designs, many=True)
        return Response(serializer.data)

class DeleteDesignView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, design_id):
        try:
            design = Design.objects.get(id=design_id, user=request.user)
            design.delete()
            return Response({"message": "Design deleted"}, status=status.HTTP_204_NO_CONTENT)
        except Design.DoesNotExist:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)
