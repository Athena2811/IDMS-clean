from django.contrib.auth.models import User
from django.db import models
from django.conf import settings
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone = models.CharField(max_length=15, blank=True)
    is_premium = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username
class RoomType(models.Model):
    name = models.CharField(max_length=100)
    icon = models.ImageField(upload_to="room_icons/", blank=True)

    def __str__(self):
        return self.name
class Theme(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    preview_image = models.ImageField(upload_to="themes/")

    def __str__(self):
        return self.name
class Item(models.Model):
    name = models.CharField(max_length=150)
    image = models.ImageField(upload_to="items/")
    price = models.DecimalField(max_digits=10, decimal_places=2)

    themes = models.ManyToManyField(Theme)
    room_types = models.ManyToManyField(RoomType)

    def __str__(self):
        return self.name

class ClientRoom(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    room_type = models.ForeignKey(RoomType, on_delete=models.CASCADE)

    original_image = models.ImageField(upload_to="client_rooms/")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.room_type.name}"
class AIDesign(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    client_room = models.ForeignKey(ClientRoom, on_delete=models.CASCADE)

    theme = models.ForeignKey(Theme, on_delete=models.CASCADE)
    selected_items = models.ManyToManyField(Item)

    generated_image = models.ImageField(upload_to="ai_results/", blank=True)
    prompt_used = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"AI Design - {self.user.username}"
class SavedDesign(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    ai_design = models.ForeignKey(AIDesign, on_delete=models.CASCADE)
    saved_at = models.DateTimeField(auto_now_add=True)
class RoomMaterial(models.Model):
    MATERIAL_TYPE = [
        ('floor', 'Floor'),
        ('wall', 'Wall'),
        ('ceiling', 'Ceiling'),
    ]

    name = models.CharField(max_length=100)
    material_type = models.CharField(max_length=20, choices=MATERIAL_TYPE)
    preview_image = models.ImageField(upload_to='materials/')
    ai_prompt_hint = models.TextField()

    def __str__(self):
        return f"{self.material_type} - {self.name}"

class Design(models.Model):
    user = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    on_delete=models.CASCADE,
    null=True,
    blank=True
)
    theme = models.ForeignKey(Theme, on_delete=models.CASCADE)
    client_room = models.ForeignKey(ClientRoom, on_delete=models.CASCADE)
    prompt = models.TextField()
    generated_image = models.ImageField(upload_to="ai_results/")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Design {self.id} by {self.user}"
class ColorPalette(models.Model):
    name = models.CharField(max_length=100)
    colors = models.JSONField()  
    # Example: ["#F5F5F5", "#C2B8AE", "#8A817C"]

    theme = models.ForeignKey(
        Theme,
        on_delete=models.CASCADE,
        related_name="palettes"
    )

    preview_image = models.ImageField(
        upload_to="color_palettes/",
        blank=True
    )

    ai_prompt_hint = models.TextField()

    def __str__(self):
        return f"{self.name} ({self.theme.name})"
