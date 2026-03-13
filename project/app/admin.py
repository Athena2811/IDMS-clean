from django.contrib import admin
from .models import (
    UserProfile,
    RoomType,
    Theme,
    Item,
    ClientRoom,
    AIDesign,
    SavedDesign,
    RoomMaterial,
    ColorPalette
)

admin.site.register(UserProfile)
admin.site.register(RoomType)
admin.site.register(Theme)
class ItemAdmin(admin.ModelAdmin):
    filter_horizontal = ("room_types",)

admin.site.register(Item, ItemAdmin)
admin.site.register(ClientRoom)
admin.site.register(AIDesign)
admin.site.register(SavedDesign)
admin.site.register(RoomMaterial)
admin.site.register(ColorPalette)
