# import google.generativeai as genai
# import os
# from dotenv import load_dotenv
import boto3
import json

# Initialize the Bedrock client
client = boto3.client('bedrock-runtime')
# def retrieve_and_generate_content(prompt):
#     response = client.retrieve_and_generate(
#         input={
#             'text': prompt,
#             'knowledgeBaseConfiguration': {
#                 'knowledgeBaseId': 'your-knowledge-base-id',  # Replace with your Knowledge Base ID
#                 'modelArn': 'your-model-arn',  # Replace with your Model ARN
#                 'generationConfiguration': {
#                     'promptTemplate': {
#                         'textPromptTemplate': '{input}'
#                     },
#                     'inferenceConfig': {
#                         'textInferenceConfig': {
#                             'maxTokens': 1000,
#                             'temperature': 0.5,
#                             'topP': 0.9,
#                             'stopSequences': []
#                         }
#                     }
#                 },
#                 'retrievalConfiguration': {
#                     'vectorSearchConfiguration': {
#                         'numberOfResults': 5,
#                         'overrideSearchType': 'HYBRID'
#                     }
#                 }
#             },
#             'type': 'KNOWLEDGE_BASE'
#         },
#         sessionConfiguration={
#             'kmsKeyArn': 'your-kms-key-arn'  # Optional: if you have a specific KMS key
#         },
#         sessionId=str(uuid.uuid4())
#     )
#
#     # Extract the result
#     result = json.loads(response['body'].read())
#
#     # Process the result to get the generated text
#     generated_text = result.get('results', [{}])[0].get('output', {}).get('text', '')
#
#     return generated_text



# Function to call the Sonnet 3.5 model through Bedrock
def generate_content(patient_name,
            patient_dob,
            patient_gender,
            patient_address,
            patient_email,
            patient_insurance_id,
            patient_insurance_name, procedure):
    prompt = f"""
    You are an AI assistant tasked with filling out a comprehensive prior authorization form for a medical procedure. You will be provided with basic patient information, insurance details, and the name of the procedure. Your task is to generate consistent and plausible information for each section of the form, and return the responses in parseable json.

    Given Information:
    - Patient Name: {patient_name}
    - Patient Date of Birth: {patient_dob}
    - Patient Gender: {patient_gender}
    - Patient Address: {patient_address}
    - Patient Email: {patient_email}
    - Health Insurance ID Number: {patient_insurance_id}
    - Health insurance name: {patient_insurance_name}
    - Name of Procedure: {procedure}
        referringProviderName": "Providence",
      "referringProviderNPI": "1316041056",
      "servicingProviderName": "Providence",
      "servicingProviderNPI": "1316041056",
    
    Please fill out the following form of the prior authorization form using the data you are provided, and only use that information. Pull the most relevant clinical justifications and reasoning that you can, to ensure that the authorization gets approved, and return it in JSON FORM!
    
    
      "patientName": "",
      "patientDOB" (yyyy-MM-dd format): "",
      "patientGender": "",
      "patientAddress": "",
      "patientCity": "",
      "patientState": "",
      "patientZip": "",
      "patientEmail": "",
      "patientInsuranceId": "",
      "patientInsuranceName": "",
    
      "referringProviderName": "",
      "referringProviderNPI": "",
      "referringProviderRelationship": "",
      "servicingProviderName": "",
      "servicingProviderNPI": "",
      
      "serviceType (format "procedure" to be in proper langauge): "",
      "serviceStartDate": "",
      "cptCodes": "",
      "icdCodes": "",
      summaryMedicalNeed: '',
      reasonsRequestedMedication: '',
    
    
    Don’t include any other information besides the json data.
    
    
    """


    native_request = {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 1000,
        "temperature": 0.5,
        "messages": [
            {
                "role": "user",
                "content": [{"type": "text", "text": prompt}],
            }
        ],
    }

    # Convert the native request to JSON.
    request = json.dumps(native_request)

    response = client.invoke_model(
        modelId='anthropic.claude-3-5-sonnet-20240620-v1:0',  # Identifier for Sonnet 3.5 model in Bedrock
        body=request
    )

    # Extract the result
    result = json.loads(response["body"].read())

    content_list = result.get('content', [])
    if not content_list:
        return {'error': 'No content found in response'}

    assistant_reply_text = content_list[0].get('text', '')

    try:
        assistant_reply_json = json.loads(assistant_reply_text)
    except json.JSONDecodeError:
        # Handle parsing error
        assistant_reply_json = {
            'error': 'Assistant reply is not valid JSON',
            'raw_reply': assistant_reply_text
        }

    return assistant_reply_json

    # result = json.loads(response['Body'].read().decode('utf-8'))
    # return jsonify(result)


# # Load environment variables from .env file
# load_dotenv()
#
# # Get API key from environment variable
# GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
#
# # Configure Google Generative AI
# genai.configure(api_key=GOOGLE_API_KEY)
#
# # Create the model configuration
# generation_config = {
#     "temperature": 1,
#     "top_p": 0.95,
#     "top_k": 64,
#     "max_output_tokens": 8192,
#     "response_mime_type": "text/plain",
# }
#
# # Create the model
# model = genai.GenerativeModel(
#     model_name="gemini-1.5-flash",
#     generation_config=generation_config
# )
#
# # Define the function that uses the model to generate prior authorization requests
# def generate_content(patient_info, procedure):
#     response = model.generate_content([
#        f"""You are an AI assistant tasked with filling out a comprehensive prior authorization form for a medical procedure. You will be provided with basic patient information, insurance details, and the name of the procedure. Your task is to generate consistent and plausible information for each section of the form, and return the responses in parseable json.
#
# Given Information:
# - Patient Name: [Jordan Lee]
# - Patient Date of Birth: [09/09/2004]
# - Patient Gender: [Male]
# - Patient Address: [5908 111th ST SW Mukilteo, WA]
# - Patient Email: [airjlee04@gmail.com]
# - Health Insurance ID Number: [12345]
# - Health insurance name: [Primera Blue Cross]
# - Name of Procedure: [{procedure}]
#
# Please fill out the following form of the prior authorization form using the data you are provided, and only use that information. Pull the most relevant clinical justifications and reasoning that you can, to ensure that the authorization gets approved, and return it AS JSON FORMAT:
#
#   "patientName": "",
#   "patientDOB": "",
#   "patientGender": "",
#   "patientAddress": "",
#   "patientCity": "",
#   "patientState": "",
#   "patientZip": "",
#   "patientPhone": "",
#   "patientEmail": "",
#   "patientInsuranceId": "",
#   "patientInsuranceName": "",
#
#   "referringProviderName": "",
#   "referringProviderNPI": "",
#   "referringProviderRelationship": "",
#   "servicingProviderName": "",
#   "servicingProviderNPI": "",
#
#   "serviceType": "",
#   "serviceStartDate": "",
#   "cptCodes": "",
#   "icdCodes": "",
#   "clinicalJustification": ""
#
# """
#     ])
#     return response


# if __name__ == "__main__":
#     prompt = "Say hello, but in Json"
#     response = generate_content("", "")
#     print(response)
#     # # Example patient information and procedure
#     # patient_info = ""
#     # procedure = "MRI Right shoulder"
#     #
#     # # Call the function and print the result
#     # response = generate_content(patient_info, procedure)
#     # print(response.text)