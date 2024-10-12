
from django.urls import path
from . import views

urlpatterns = [
    path('api/generate/', views.generate_content_view, name='generate'),
]
