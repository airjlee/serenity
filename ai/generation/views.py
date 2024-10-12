import json

from django.shortcuts import render

# Create your views here.
# myapp/views.py

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .main import generate_content

@csrf_exempt
@require_http_methods(["POST"])
def generate_content_view(request):
    try:
        # Assuming the prompt is sent in the request body as JSON
        data = json.loads(request.body)
        prompt = data.get('prompt', '')

        if not prompt:
            return JsonResponse({'error': 'Prompt is required'}, status=400)

        # Generate content using the AI model
        content = generate_content(prompt)
        return JsonResponse({'content': content}, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
