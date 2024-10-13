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
        patient_info = data.get('patient_info', {})
        procedure = data.get('procedure', '')

        # Ensure both 'patient_info' and 'procedure' are provided
        if not patient_info or not procedure:
            return JsonResponse({'error': 'Both patient_info and procedure are required'}, status=400)

        # Extract individual fields from patient_info
        patient_name = patient_info.get('patientName', '')
        patient_dob = patient_info.get('patientDOB', '')
        patient_gender = patient_info.get('patientGender', '')
        patient_address = patient_info.get('patientAddress', '')
        patient_email = patient_info.get('patientEmail', '')
        patient_insurance_id = patient_info.get('patientInsuranceId', '')
        patient_insurance_name = patient_info.get('patientInsuranceName', '')

        # Generate content using the AI model with individual patient info fields and procedure
        content = generate_content(
            patient_name,
            patient_dob,
            patient_gender,
            patient_address,
            patient_email,
            patient_insurance_id,
            patient_insurance_name,
            procedure
        )

        # Return the generated content as a JSON response
        return JsonResponse({'content': content}, status=200)

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON format'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
