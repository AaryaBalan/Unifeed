from django.urls import path
from . import views

urlpatterns = [
    path("home", views.home, name="home"),
    path("extract-keyword", views.extract_keywords, name="extract_keywords"),
    path("extract-keyword-db", views.extract_keywords_db, name="extract_candidate_keywords"),
]
