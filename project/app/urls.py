
from django.urls import path
from  .views import chatbot, get_user_role, my_designs, delete_design
from .views import (
    generate_design,
    get_themes,
    get_items,
    get_materials,
    get_design,
    register,
    upload_room,
    RoomTypeListView,
    delete_design,
    regenerate_design,
    add_room,
    delete_room,
    add_theme,
    delete_theme
    
   
)

urlpatterns = [

    # Public APIs
    path("themes/", get_themes),
    path("items/", get_items),
    path("materials/", get_materials),
    path("room_types/", RoomTypeListView.as_view()),
    path("rooms/upload/", upload_room),

    path("generate-design/", generate_design),
    path("designs/<int:design_id>/", get_design),

    path("register/", register),
    path("my-designs/", my_designs),
    path("delete-design/<int:design_id>/",delete_design, name="delete_design"),
    path("regenerate-design/<int:design_id>/", regenerate_design, name="regenerate_design"),    
    path("add-room/", add_room),
path("delete-room/<int:id>/", delete_room),
path("user-role/", get_user_role),
path("add-theme/", add_theme),
path("delete-theme/<int:id>/", delete_theme),
path("chatbot/", chatbot),  # Include chatbot URLs
]
