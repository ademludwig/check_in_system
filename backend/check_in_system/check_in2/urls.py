from django.urls import path
from .views import upload_teachers,TeacherListView

urlpatterns = [
    path("upload-teachers/", upload_teachers, name="upload_teachers"),
    path("teachers/", TeacherListView.as_view(), name="teacher-list"),
]
