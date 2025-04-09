# app/utils/gemini_client.py

import os
from dotenv import load_dotenv
from google import genai

load_dotenv()  # Load variables from .env file

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
MODEL = "gemini-2.0-flash"

# def get_gemini_recommendation(prompt: str) -> str:
#     """
#     Calls the Gemini 1.5 Flash model via google.generativeai.generate_text()
#     and returns the generated text.
#     """
    
#     # Call generate_text with your parameters
#     response = client.models.generate_content(
#         model="gemini-2.0-flash",
#         contents=[prompt],
#     )

#     return response.candidates[0].content.parts[0].text
