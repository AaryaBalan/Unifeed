from django.urls import path
from . import views

urlpatterns = [
    path("home", views.home, name="home"),
    path("extract-keyword", views.extract_keywords, name="extract_keywords"),
    # path("extract-keyword-db", views.extract_keywords_db, name="extract_candidate_keywords"),
    
    path("save-keyword/", views.save_user_keywords, name="save_user_keywords"),
    path('update-keyword/', views.update_keyword_count, name='update_keyword_count'),
    path('user-keyword-api/<str:userid>' ,views.user_keyword_api, name = "user_keyword_api"),
    
    path('search-instagram/', views.search_instagram_by_keyword, name='search_instagram_by_keyword'),
    
    path('ask/', views.ask_model, name='ask_model'),
    path("ask-question/", views.ask_question, name="ask_question")
]
