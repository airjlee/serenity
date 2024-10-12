import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get API key from environment variable
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')

# Configure Google Generative AI
genai.configure(api_key=GOOGLE_API_KEY)

# Create the model configuration
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

# Create the model
model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config
)

# Define the function that uses the model to generate prior authorization requests
def generate_content(patient_info, procedure):
    response = model.generate_content([
        "You are an assistant that creates prior authorization requests based on the given info. Create the best possible prior authorization requests with the highest chance of getting approved. The requests will come in the form 'request {name} {operation}'",
        "Patient Info: request Jordan Lee Right shoulder MRI imaging",
        """Request: Prior Authorization Request
        Patient Information: 
        Name: Jordan Lee
        Date of Birth: March 15, 1995
        Insurance ID: HF123456789
        Group Number: GF987654321
        Provider Information:
        Name: Dr. Emily Carter
        NPI Number: 1234567890
        Clinic Name: Sunrise Orthopedic Clinic
        Address: 123 Health Street, Seattle, WA 98101
        Phone Number: (555) 123-4567
        Email: emily.carter@sunriseclinic.com
        Request Details:
        Requested Procedure: MRI of the shoulder
        CPT Code: 73221 (MRI Shoulder, without contrast)
        Clinical Indication: 
        Jordan Lee presents with persistent shoulder pain and restricted range of motion for the past six months. Conservative treatments, including physical therapy, have failed to resolve symptoms. Initial X-rays and physical exams suggest a need for further imaging to accurately diagnose the underlying issue, potentially a rotator cuff tear or labral tear. An MRI is required to provide a detailed assessment of the shoulder structures to guide further treatment.
        Supporting Documentation: 
        Clinical notes and medical history, Previous test results, Physical therapy records.
        Justification for MRI: An MRI is critical to identify internal shoulder injuries that are not visible on X-rays. Accurate diagnosis is essential for planning effective treatment and determining if surgical intervention is needed.
        Contact for Further Information: Please contact Dr. Emily Carter at (555) 123-4567 or emily.carter@sunriseclinic.com for any additional information or documentation.
        Authorization Request Date: July 31, 2024""",
        "Patient Info: " + patient_info,
        "Request: " + procedure,
    ])
    return response.text
