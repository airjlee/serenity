import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .main import generate_content  # Import your AI content generation function

@csrf_exempt
@require_http_methods(["POST"])
def generate_content_view(request):
    try:
        # Load JSON data from the request body
        data = json.loads(request.body)

        # Extract 'patient_info' and 'procedure' from the JSON data
        patient_info = data.get('patient_info', '')
        procedure = data.get('procedure', '')

        # Ensure both 'patient_info' and 'procedure' are provided
        if not patient_info or not procedure:
            return JsonResponse({'error': 'Both patient_info and procedure are required'}, status=400)

        # Generate content using the AI model with the patient_info and procedure
        content = generate_content(patient_info, procedure)

        # Return the generated content as a JSON response
        return JsonResponse({'content': content}, status=200)

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON format'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
