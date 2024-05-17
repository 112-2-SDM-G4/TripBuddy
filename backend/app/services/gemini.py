import google.generativeai as genai
from google.generativeai import GenerativeModel, GenerationConfig
import os
from datetime import date


class Gemini:
    def __init__(self, configs={'candidate_count':1}):
        project_id = os.getenv("APP_ENGINE_PROJECT_ID")
        genai.configure(api_key=os.environ['GEMINI_API_KEY'])
        model_config = GenerationConfig(
            candidate_count=configs['candidate_count'],
            response_mime_type=configs['response_mime_type'] if 'response_mime_type' in configs else None,
        )
        self.model = GenerativeModel(
            model_name='gemini-1.5-pro-latest',
            generation_config=model_config,
        )

    def generate_content(self, text):
        response = self.model.generate_content(text)
        return response
    

