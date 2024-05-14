import vertexai
from vertexai.generative_models import GenerativeModel, Part
import vertexai.generative_models as generative_models
import os
from datetime import date


class Gemini:
    def __init__(self, system_instruction=""):
        project_id = os.getenv("APP_ENGINE_PROJECT_ID")
        vertexai.init(project=project_id, location="asia-east1")
        self.model = GenerativeModel(
            model_name="gemini-1.0-pro-002",
            system_instruction="""
Your answer must strictly follow the rules:
1. Answer by line, one line represents a day's itinerary sorted by time
2. Each destination has only a name, and the names should be as clear as possible, separated by commas.
3. Other descriptions, notes, punctuation marks, etc. are NOT allowed, only place names.
4. At least three attractions per day, including hotels, restaurants, etc.
5. Don’t use bold fonts and wrap lines at will.
6. A creative trip name at first line
Answers must be in the following format:
trip_name: Your trip name
Day 1: Attraction 1, Attraction 2, Attraction 3, ...
Day 2: Attraction 4, Attraction 5, Attraction 6, ..."""
        )

    def generate_content(self, text):
        response = self.model.generate_content(text)
        return response.text
