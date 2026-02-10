from django.urls import path
from .views import (
    get_themes,
    get_items,
    upload_room,
    generate_design,
    RoomTypeListView,
    get_materials,
    get_design,
    register,
    MyDesignsView,
    DeleteDesignView
)

urlpatterns = [
    path("themes/", get_themes),
    path("items/", get_items),
    path("rooms/upload/", upload_room),
    path("room_types/", RoomTypeListView.as_view()),
    path("generate-design/", generate_design),
    path("materials/", get_materials),
    path('designs/<int:design_id>/', get_design),
    path('register/', register),
    path('my-designs/', MyDesignsView.as_view()),
    path('delete-design/<int:design_id>/', DeleteDesignView.as_view()),

]
