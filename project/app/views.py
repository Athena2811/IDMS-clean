import json
import random
import requests
import os
import shutil
from django.conf import settings
import time
from rest_framework.response import Response
import rest_framework
from rest_framework.authtoken.models import Token
from urllib import request
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.views import APIView
from rest_framework import generics

from rest_framework.permissions import AllowAny, IsAdminUser
from django.contrib.auth.models import User

from .models import (
    ColorPalette,
    Design,
    SavedDesign,
    Theme,
    Item,
    ClientRoom,
    AIDesign,
    RoomType,
    RoomMaterial
)

from .serializers import (
    DesignSerializer,
    ThemeSerializer,
    ItemSerializer,
    ClientRoomSerializer,
    AIDesignSerializer,
    RoomTypeSerializer, 
    RoomMaterialSerializer
)


from rest_framework.decorators import api_view
from rest_framework.response import Response
from .ai_service import generate_ai_images, build_prompt
from .models import Design
from django.contrib.auth.models import User

import os
import time
import shutil
import uuid

from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response

from django.contrib.auth.models import User
from .models import Design, Theme, ClientRoom
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings
from django.contrib.auth.models import User
from .models import Design, Theme, ClientRoom

import os
import shutil
import time
import uuid

from .ai_service import generate_ai_images

import os
import time
import uuid
import shutil

from django.conf import settings
from django.contrib.auth.models import User

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status

from .models import Design, Theme, ClientRoom
from .ai_service import generate_ai_images


# -----------------------------------
# GENERATE DESIGN
# ----
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def generate_design(request):

    try:

        room = request.data.get("room")
        theme = request.data.get("theme")
        suggestion = request.data.get("suggestion", "")

        # Base room prompts
        ROOM_PROMPTS = {
            "Kitchen": "modern kitchen interior, cabinets, stove, sink, kitchen island, countertops",
            "Bedroom": "bedroom interior, bed, bedside tables, wardrobe, lamps",
            "Living Room": "living room interior, sofa, coffee table, tv unit, lounge area",
            "Dining Room": "dining room interior, dining table, chairs, chandelier",
            "Bathroom": "bathroom interior, sink, shower, mirror, bathtub"
        }

        room_details = ROOM_PROMPTS.get(room, room)

        # ---- Random variations to prevent identical images ----

        camera_angle = random.choice([
            "wide interior photography",
            "corner room perspective",
            "architectural photography angle",
            "cinematic interior shot",
            "top interior design view"
        ])

        lighting_style = random.choice([
            "soft ambient lighting",
            "warm natural lighting",
            "sunlight entering through windows",
            "golden hour interior lighting",
            "studio lighting"
        ])

        layout_style = random.choice([
            "minimal furniture layout",
            "luxury interior arrangement",
            "cozy balanced layout",
            "modern spacious layout",
            "designer interior composition"
        ])

        variation_seed = random.randint(1, 999999)

        # ---- Prompt ----

        prompt = f"""
Ultra realistic {theme} style {room} interior.

Scene description:
{room_details}

User customization request:
{suggestion}

Interior layout:
{layout_style}

Lighting:
{lighting_style}

Camera view:
{camera_angle}

Professional architectural interior photography.
Correct furniture for a {room}.
Highly detailed textures.
8k realistic render.

variation seed {variation_seed}
"""

        comfy_output = r"C:\Users\ATHENA\AI\ComfyUI\output"

        before_files = set(os.listdir(comfy_output))

        generate_ai_images(prompt)

        latest_file = None

        # wait until new image appears
        for _ in range(30):
            time.sleep(1)

            after_files = set(os.listdir(comfy_output))
            new_files = list(after_files - before_files)

            if new_files:
                latest_file = new_files[0]
                break

        if not latest_file:
            return Response({"error": "AI generation failed"}, status=500)

        source = os.path.join(comfy_output, latest_file)

        django_media = os.path.join(settings.MEDIA_ROOT, "generated")
        os.makedirs(django_media, exist_ok=True)

        new_filename = f"interior_{uuid.uuid4().hex}.png"
        destination = os.path.join(django_media, new_filename)

        shutil.copy(source, destination)

        image_url = f"http://127.0.0.1:8000/media/generated/{new_filename}"

        theme_obj = Theme.objects.filter(name__iexact=theme).first()
        if not theme_obj:
            theme_obj = Theme.objects.first()

        client_room = ClientRoom.objects.first()

        user = request.user

        # Save generated design
        Design.objects.create(
            user=user,
            theme=theme_obj,
            client_room=client_room,
            prompt=prompt,
            generated_image=f"generated/{new_filename}"
        )

        return Response({
            "image": image_url
        })

    except Exception as e:

        print("GENERATE ERROR:", e)

        return Response(
            {"error": str(e)},
            status=500
        )

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_designs(request):

    designs = Design.objects.filter(user=request.user).order_by("-created_at")

    data = []

    for d in designs:
        data.append({
            "id": d.id,
            "image": request.build_absolute_uri(d.generated_image.url),
            "created_at": d.created_at
        })

    return Response(data)


# -----------------------------------
# DELETE DESIGN
# -----------------------------------

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_design(request, design_id):

    try:

        design = Design.objects.get(id=design_id, user=request.user)

        if design.generated_image:
            image_path = design.generated_image.path

            if os.path.exists(image_path):
                os.remove(image_path)

        design.delete()

        return Response({"message": "Deleted successfully"})

    except Design.DoesNotExist:
        return Response({"error": "Design not found"}, status=404)


# -----------------------------------
# REGENERATE DESIGN
# -----------------------------------

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def regenerate_design(request, design_id):

    try:
        design = Design.objects.get(id=design_id, user=request.user)
    except Design.DoesNotExist:
        return Response({"error": "Design not found"}, status=404)

    prompt = design.prompt

    comfy_output = r"C:\Users\ATHENA\AI\ComfyUI\output"

    before_files = set(os.listdir(comfy_output))

    generate_ai_images(prompt)

    latest_file = None

    for _ in range(20):
        time.sleep(1)

        after_files = set(os.listdir(comfy_output))
        new_files = list(after_files - before_files)

        if new_files:
            latest_file = new_files[0]
            break

    if not latest_file:
        return Response({"error": "AI regeneration failed"}, status=500)

    source = os.path.join(comfy_output, latest_file)

    django_media = os.path.join(settings.MEDIA_ROOT, "generated")
    os.makedirs(django_media, exist_ok=True)

    new_filename = f"interior_{uuid.uuid4().hex}.png"
    destination = os.path.join(django_media, new_filename)

    shutil.copy(source, destination)

    design.generated_image = f"generated/{new_filename}"
    design.save()

    return Response({
        "image": f"http://127.0.0.1:8000/media/generated/{new_filename}"
    })


# -----------------------------------
# REGISTER USER
# -----------------------------------

@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):

    username = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")

    if not username or not password or not email:
        return Response(
            {"error": "All fields required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(username=username).exists():
        return Response(
            {"error": "Username already exists"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(email=email).exists():
        return Response(
            {"error": "Email already exists"},
            status=status.HTTP_400_BAD_REQUEST
        )

    User.objects.create_user(
        username=username,
        email=email,
        password=password
    )

    return Response(
        {"message": "User registered successfully"},
        status=status.HTTP_201_CREATED
    )
# =========================
# GET THEMES
# =========================

@api_view(["GET"])
def get_themes(request):
    themes = Theme.objects.all()
    serializer = ThemeSerializer(themes, many=True)
    return Response(serializer.data)


# =========================
# GET ITEMS
# =========================
@api_view(["GET"])
def get_items(request):
    room_type_id = request.GET.get("room_type")

    if room_type_id:
        items = Item.objects.filter(room_types__id=room_type_id)
    else:
        items = Item.objects.all()

    serializer = ItemSerializer(items, many=True, context={"request": request})
    return Response(serializer.data)

# =========================
# MATERIALS
# =========================

@api_view(["GET"])
def get_materials(request):
    material_type = request.GET.get("type")
    qs = RoomMaterial.objects.all()

    if material_type:
        qs = qs.filter(material_type=material_type)

    serializer = RoomMaterialSerializer(
        qs,
        many=True,
        context={"request": request}   # ✅ IMPORTANT
    )

    return Response(serializer.data)

# =========================
# ROOM TYPES
# =========================





class RoomTypeListView(generics.ListAPIView):
    queryset = RoomType.objects.all()
    serializer_class = RoomTypeSerializer
    permission_classes = [AllowAny]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

# =========================
# MY DESIGNS
# =========================


@api_view(["POST"])

def upload_room(request):
    serializer = ClientRoomSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
@api_view(['GET'])

def get_design(request, design_id):
    try:    
        design = AIDesign.objects.get(id=design_id, user=request.user)
        serializer = AIDesignSerializer(design)
        return Response(serializer.data)
    except AIDesign.DoesNotExist:
        return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)



# @api_view(["GET"])
# def my_designs(request):

#     designs = Design.objects.all().order_by("-created_at")

#     data = [
#         {
#             "id": d.id,
#             "image": request.build_absolute_uri(d.generated_image.url),
#             "created_at": d.created_at
#         }
#         for d in designs
#     ]

#     return Response(data)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_role(request):
    return Response({
        "username": request.user.username,
        "is_admin": request.user.is_staff
    })
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from .models import RoomType, Theme
from .serializers import RoomTypeSerializer, ThemeSerializer


# -------- GET ROOMS --------
@api_view(["GET"])
def get_rooms(request):
    rooms = RoomType.objects.all()
    serializer = RoomTypeSerializer(rooms, many=True, context={"request": request})
    return Response(serializer.data)


# -------- GET THEMES --------
@api_view(["GET"])
def get_themes(request):
    themes = Theme.objects.all()
    serializer = ThemeSerializer(themes, many=True, context={"request": request})
    return Response(serializer.data)


# -------- ADD ROOM --------
@api_view(["POST"])
@permission_classes([IsAdminUser])
def add_room(request):
    name = request.data.get("name")
    icon = request.FILES.get("icon")

    room = RoomType.objects.create(
        name=name,
        icon=icon
    )

    return Response({"message": "Room added"})


# -------- DELETE ROOM --------
@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def delete_room(request, id):
    room = RoomType.objects.get(id=id)
    room.delete()
    return Response({"message": "Room deleted"})


# -------- ADD THEME --------
@api_view(["POST"])
@permission_classes([IsAdminUser])
def add_theme(request):
    name = request.data.get("name")
    description = request.data.get("description")
    preview_image = request.FILES.get("preview_image")

    theme = Theme.objects.create(
        name=name,
        description=description,
        preview_image=preview_image
    )

    return Response({"message": "Theme added"})


# -------- DELETE THEME --------
@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def delete_theme(request, id):
    theme = Theme.objects.get(id=id)
    theme.delete()
    return Response({"message": "Theme deleted"})

from rest_framework.decorators import api_view
from rest_framework.response import Response


from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(["POST"])
def chatbot(request):

    message = request.data.get("message", "").lower()
    room = request.data.get("room", "")
    theme = request.data.get("theme", "")

    reply = ""

    # ---------------- GREETING ----------------

    if any(word in message for word in ["hi", "hello", "hey"]):

        reply = f"""
Hi! 👋 I'm your InteriorAI assistant.

I can help you design your {theme} {room}.

You can ask me about:
• furniture ideas
• color palettes
• lighting tips
• decor suggestions
• layout ideas
"""

    # ---------------- CASUAL REPLIES ----------------

    elif message.strip() in ["ok", "okay", "yes", "yeah"]:

        reply = f"What would you like help with for your {theme} {room}? Furniture, colors, lighting or layout?"

    elif "thanks" in message or "thank you" in message:

        reply = "You're welcome! 😊 Let me know if you want more interior design ideas."

    # ---------------- FURNITURE ----------------

    elif any(word in message for word in ["furniture", "sofa", "table", "chair", "bed", "suggest"]):

        if "kitchen" in room.lower():

            reply = f"""
For a {theme} Kitchen you could use:

• kitchen island
• bar stools
• modern cabinets
• open shelves
• pendant lights
"""

        elif "bedroom" in room.lower():

            reply = f"""
For a {theme} Bedroom you can include:

• comfortable bed
• bedside tables
• wardrobe
• table lamps
• decorative rug
"""

        elif "living" in room.lower():

            reply = f"""
For a {theme} Living Room you could use:

• sectional sofa
• wooden coffee table
• TV console
• floor lamp
• indoor plants
"""

        elif "dining" in room.lower():

            reply = f"""
For a {theme} Dining Room you could use:

• dining table
• dining chairs
• pendant light or chandelier
• sideboard cabinet
• decorative wall art
"""

        else:

            reply = "Tell me the room type and I can suggest furniture."

    # ---------------- COLORS ----------------

    elif any(word in message for word in ["color", "colour", "palette"]):

        if "scandinavian" in theme.lower():

            reply = """
A Scandinavian color palette usually includes:

• white
• light grey
• soft beige
• natural wood tones
• pastel accents

This keeps the space bright and cozy.
"""

        elif "bohemian" in theme.lower():

            reply = """
Bohemian interiors use warm earthy colors:

• terracotta
• mustard yellow
• olive green
• cream
• warm brown
"""

        elif "modern" in theme.lower():

            reply = """
Modern Minimal color palettes include:

• white
• charcoal grey
• black
• neutral beige
• wood accents
"""

        else:

            reply = "Neutral colors like white, beige and grey work well for most interiors."

    # ---------------- LIGHTING ----------------

    elif any(word in message for word in ["light", "lighting"]):

        if "kitchen" in room.lower():

            reply = "Pendant lights above the island and under-cabinet LED lighting work well in kitchens."

        elif "bedroom" in room.lower():

            reply = "Use bedside lamps and warm ambient lighting to create a relaxing bedroom."

        elif "living" in room.lower():

            reply = "Combine ceiling lighting, floor lamps and accent lights for a cozy living room."

        elif "dining" in room.lower():

            reply = "A chandelier or pendant light above the dining table creates a beautiful focal point."

        else:

            reply = "Warm ambient lighting usually works best for interiors."

    # ---------------- DECOR ----------------

    elif any(word in message for word in ["decor", "decorate", "decoration"]):

        reply = f"""
To decorate a {theme} {room} you can use:

• wall art
• indoor plants
• textured rugs
• wooden furniture
• decorative cushions
"""

    # ---------------- LAYOUT ----------------

    elif "layout" in message or "arrangement" in message:

        reply = f"""
A good {room} layout should include:

• balanced furniture placement
• enough walking space
• lighting near seating areas
• a clear focal point
"""

    # ---------------- DEFAULT ----------------

    else:

        reply = "I can help with furniture ideas, color palettes, lighting tips, decor suggestions and room layouts. What would you like to design?"

    return Response({
        "reply": reply
    })