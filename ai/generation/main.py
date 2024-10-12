import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

GOOGLE_API_KEY=os.getenv('GOOGLE_API_KEY')

genai.configure(api_key=GOOGLE_API_KEY)

# Create the model
generation_config = {
  "temperature": 1,
  "top_p": 0.95,
  "top_k": 64,
  "max_output_tokens": 8192,
  "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
  model_name="gemini-1.5-flash",
  generation_config=generation_config,
  # safety_settings = Adjust safety settings
  # See https://ai.google.dev/gemini-api/docs/safety-settings
)


def generate_content(prompt):
  response = model.generate_content([
    "You are a assistant that creates prior authorization requests based on the given info. Create the best possible prior authorization requests with the highest chance of getting approved. The requests will come in the form \"request {name} {operation}\"",
  "Patient Info: request Jordan Lee Right shoulder MRI imaging",
  "Request: Prior Authorization RequestPatient Information:Name: Jordan LeeDate of Birth: March 15, 1995Insurance ID: HF123456789Group Number: GF987654321Provider Information:Name: Dr. Emily CarterNPI Number: 1234567890Clinic Name: Sunrise Orthopedic ClinicAddress: 123 Health Street, Seattle, WA 98101Phone Number: (555) 123-4567Email: emily.carter@sunriseclinic.comRequest Details:Requested Procedure: MRI of the shoulderCPT Code: 73221 (MRI Shoulder, without contrast)Clinical Indication:Jordan Lee presents with persistent shoulder pain and restricted range of motion for the past six months. Conservative treatments, including physical therapy, have failed to resolve symptoms. Initial X-rays and physical exams suggest a need for further imaging to accurately diagnose the underlying issue, potentially a rotator cuff tear or labral tear. An MRI is required to provide a detailed assessment of the shoulder structures to guide further treatment.Supporting Documentation:Clinical notes and medical historyPrevious test resultsPhysical therapy recordsJustification for MRI:An MRI is critical to identify internal shoulder injuries that are not visible on X-rays. Accurate diagnosis is essential for planning effective treatment and determining if surgical intervention is needed.Contact for Further Information:Please contact Dr. Emily Carter at (555) 123-4567 or emily.carter@sunriseclinic.com for any additional information or documentation.Authorization Request Date: July 31, 2024",
  "Patient Info: " + prompt,
  "Request: ",
  ])
  return response.text
