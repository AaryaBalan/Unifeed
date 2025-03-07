from django.shortcuts import render
from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse
import json
import instaloader
from keybert import KeyBERT
from django.views.decorators.csrf import csrf_exempt
from .models import UserKeywordClicks
import os
import requests
import ollama
from bs4 import BeautifulSoup


# import nltk

# nltk.download('punkt')
# nltk.download('stopwords')

# from nltk.corpus import stopwords
# from nltk.tokenize import word_tokenize

# from sentence_transformers import SentenceTransformer
# from sklearn.metrics.pairwise import cosine_similarity

# distilbert_model = 'distilbert-base-nli-mean-tokens'
# model = SentenceTransformer(distilbert_model)

# Create your views here.
def home(request):
    return HttpResponse("Hello")

@csrf_exempt
def extract_keywords(request):
    if request.method == 'OPTIONS':
        response = HttpResponse()
        response["Access-Control-Allow-Origin"] = "*"  # Adjust as needed
        response["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type"
        return response
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            description = data.get('description', '').strip()
            
            if not description:
                response = JsonResponse({'error': 'Description text is required.'}, status=400)
                response["Access-Control-Allow-Origin"] = "*"
                return response
            
            # Initialize the KeyBERT model
            kw_model = KeyBERT()
            keywords_with_scores = kw_model.extract_keywords(
                description,
                keyphrase_ngram_range=(1, 2),
                stop_words='english',
                top_n=3
            )
            keywords = [kw[0] for kw in keywords_with_scores]
            # Feed.objects.create(keywords = keywords)
            response = JsonResponse({'keywords': keywords})
            response["Access-Control-Allow-Origin"] = "*"
            return response
        
        except Exception as e:
            response = JsonResponse({'error': str(e)}, status=500)
            response["Access-Control-Allow-Origin"] = "*"
            return response
    else:
        response = JsonResponse({'error': 'Only POST requests are allowed.'}, status=405)
        response["Access-Control-Allow-Origin"] = "*"
        return response

# # Keywords for DistilBert // need to uncomment these 3 views.
# def extract_candidate_keywords(text):
#     tokens = word_tokenize(text)  # This uses the 'punkt' resource.
#     words = [word.lower() for word in tokens if word.isalpha()]
#     stop_words = set(stopwords.words('english'))
#     candidates = [word for word in words if word not in stop_words]
#     return list(set(candidates))

# def generate_keywords_distilbert(text, top_n=5):
#     text_embedding = model.encode([text])[0]
#     candidates = extract_candidate_keywords(text)
#     if not candidates:
#         return []
#     candidate_embeddings = model.encode(candidates)
#     similarities = cosine_similarity([text_embedding], candidate_embeddings)[0]
#     top_indices = similarities.argsort()[-top_n:][::-1]
#     keywords = [candidates[i] for i in top_indices]
#     return keywords

# @csrf_exempt
# def extract_keywords_db(request):
#     if request.method == 'POST':
#         try:
#             data = json.loads(request.body)
#             description = data.get('description', '').strip()
            
#             if not description:
#                 return JsonResponse({'error': 'Description text is required.'}, status=400)
            
#             keywords = generate_keywords_distilbert(description, top_n=5)
#             return JsonResponse({'keywords': keywords})
        
#         except Exception as e:
#             return JsonResponse({'error': str(e)}, status=500)
#     else:
#         return JsonResponse({'error': 'Only POST requests are allowed.'}, status=405)

@csrf_exempt 
def save_user_keywords(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            # Expecting JSON payload like: {"userid": 2, "keywords": ["Technology", "ijc"]}
            keywords = data.get('keywords', [])
            
            # Remove duplicates
            all_keywords = list(set(keywords))
            
            # Retrieve user id from the payload
            user_id = data.get('userid')
            if user_id is None:
                return JsonResponse({'error': 'User ID is required.'}, status=400)
            
            # Get or create the user's keyword clicks record
            record, created = UserKeywordClicks.objects.get_or_create(
                user_id=user_id,
                defaults={'keyword_clicks': {}}
            )
            
            # For each keyword, if it's not already present, initialize with a count of 0.
            for kw in all_keywords:
                if kw not in record.keyword_clicks:
                    record.keyword_clicks[kw] = 0
            
            # Save the updated record
            record.save()
            
            return JsonResponse({
                'message': 'Keywords saved successfully!',
                'keyword_clicks': record.keyword_clicks  # Returns the JSON dict with counts.
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Only POST and GET requests are allowed.'}, status=405)
    
@csrf_exempt 
def update_keyword_count(request):
    """
    Expects a JSON payload like: { "keyword": "hello" }
    Increments the count for the provided keyword for the logged-in user.
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            keyword = data.get('keyword', '').strip()
            id = data.get('userid')
            if not keyword:
                return JsonResponse({'error': 'Keyword is required.'}, status=400)
            
            # Get or create the user's keyword count record
            keyword_record, created = UserKeywordClicks.objects.get_or_create(user_id = id)
            
            # Update the click count for the given keyword
            current_count = keyword_record.keyword_clicks.get(keyword, 0)
            keyword_record.keyword_clicks[keyword] = current_count + 1
            keyword_record.save()
            
            return JsonResponse({
                'message': 'Keyword count updated successfully.',
                'keyword': keyword,
                'click_count': keyword_record.keyword_clicks[keyword]
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Only POST requests are allowed.'}, status=405)
    
@csrf_exempt 
def user_keyword_api(request, userid):
    print(userid)
    query_set = UserKeywordClicks.objects.filter(user_id = userid).values()
    # query_set = UserKeywordClicks.objects.all().values()
    print(query_set)
    data = list(query_set)
    return JsonResponse(data, safe=False)

@csrf_exempt 
def search_instagram_by_keyword(request):
    # if request.method == 'POST':
        try:
            # data = json.loads(request.body)
            # keyword = data.get('keyword', '').strip()
            keyword = 'nature'
            
            if not keyword:
                return JsonResponse({'error': 'No keyword provided.'}, status=400)
            
            hashtag_str = keyword.replace(" ", "").lower()
            
            # Initialize Instaloader
            loader = instaloader.Instaloader()
            
            insta_username = os.getenv('INSTAGRAM_USERNAME', 'adithya05.in')
            insta_password = os.getenv('INSTAGRAM_PASSWORD', 'adithya05in')
            
            loader.login(insta_username, insta_password)
            
            # Get the hashtag object for the given keyword
            hashtag = instaloader.Hashtag.from_name(loader.context, hashtag_str)
            
            posts_data = []
            # Iterate over posts (limit to the latest 5 for example)
            for index, post in enumerate(hashtag.get_posts()):
                if index >= 5:
                    break
                posts_data.append({
                    "caption": post.caption,
                    "image_url": post.url,
                    "likes": post.likes,
                    "date": post.date.strftime("%Y-%m-%d %H:%M:%S") if post.date else None,
                })
            
            return JsonResponse({"posts": posts_data})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    # else:
    #     return JsonResponse({"error": "Only POST requests are allowed."}, status=405)

@csrf_exempt 
def ask_model(request):
    q="what is your name?"
    response=ollama.chat(model='llama3', messages=[{'role':'user', 'content':q}])
    print(response['message']['content'])
    return HttpResponse(response['message']['content'])

# views.py
@csrf_exempt  
def ask_question(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            question = data.get('question')
            if not question:
                return HttpResponseBadRequest("No question provided.")

        
            response = ollama.chat(model='llama3', messages=[{'role': 'user', 'content': question}])
            answer = response['message']['content']

            return JsonResponse({'answer': answer})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return HttpResponseBadRequest("Only POST method is allowed.")
