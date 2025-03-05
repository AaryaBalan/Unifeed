from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
import json
from keybert import KeyBERT
from django.views.decorators.csrf import csrf_exempt

import nltk

nltk.download('punkt')
nltk.download('stopwords')

from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize


from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

distilbert_model = 'distilbert-base-nli-mean-tokens'
model = SentenceTransformer(distilbert_model)

# Create your views here.
def home(request):
    return HttpResponse("Hello")

@csrf_exempt
def extract_keywords(request):
    # if request.method == 'POST':
        try:
            # data = json.loads(request.body)
            # description = data.get('description', '').strip()
            description = """
        React.js, Next.js, Tailwind, GSAP
      """
            if not description:
                return JsonResponse({'error': 'Description text is required.'}, status=400)
            # Initialize the KeyBERT model
            model = KeyBERT()
            keywords_with_scores = model.extract_keywords(
                description,
                keyphrase_ngram_range=(1, 2),
                stop_words='english',
                top_n=3
            )
            keywords = [kw[0] for kw in keywords_with_scores]
            return JsonResponse({'keywords': keywords})
        
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    # else:
    #     return JsonResponse({'error': 'Only POST requests are allowed.'}, status=405)

# keywords for distilBert
def extract_candidate_keywords(text):
    tokens = word_tokenize(text)  # This uses the 'punkt' resource.
    words = [word.lower() for word in tokens if word.isalpha()]
    stop_words = set(stopwords.words('english'))
    candidates = [word for word in words if word not in stop_words]
    return list(set(candidates))

def generate_keywords_distilbert(text, top_n=5):
    text_embedding = model.encode([text])[0]
    candidates = extract_candidate_keywords(text)
    if not candidates:
        return []
    candidate_embeddings = model.encode(candidates)
    similarities = cosine_similarity([text_embedding], candidate_embeddings)[0]
    top_indices = similarities.argsort()[-top_n:][::-1]
    keywords = [candidates[i] for i in top_indices]
    return keywords

@csrf_exempt
def extract_keywords_db(request):
    # if request.method == 'POST':
        try:
            # data = json.loads(request.body)
            # description = data.get('description', '').strip()
            description = 'React.js, Next.js, Tailwind, GSAP'
            if not description:
                return JsonResponse({'error': 'Description text is required.'}, status=400)
            keywords = generate_keywords_distilbert(description, top_n=5)
            return JsonResponse({'keywords': keywords})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    # else:
    #     return JsonResponse({'error': 'Onlgy POST requests are allowed.'}, status=405)
