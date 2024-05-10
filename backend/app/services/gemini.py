import vertexai
from vertexai.generative_models import GenerativeModel, Part
import os


class Gemini:
    def __init__(self):
        project_id = os.getenv("APP_ENGINE_PROJECT_ID")
        vertexai.init(project=project_id, location="asia-east1")
        self.model = GenerativeModel(model_name="gemini-1.0-pro-002")

    def generate_content(self, text):
        response = self.model.generate_content(
            [
                Part.from_text(text)
            ]
        )
        return response.text


if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv()
    gemini = Gemini()
    print(gemini.generate_content("""
                                  你是台北當地人，
                                  我打算春節去台北旅遊兩天一夜，
                                  希望住在台北101附近，
                                  請你幫我擬定一份兩天一夜的旅遊計畫，
                                  同行有老人和小孩，
                                  行程不能太緊湊勞累，
                                  包含推薦住宿地點、推薦小吃及餐廳、推薦景點，
                                  用條列式方式呈現，飯店、餐廳、景點請說出明確名稱，
                                  並包含明確時間、標籤(餐廳、飯店、景點其中一個)、google地圖連結，
                                  以下面形式呈現：
                                  8:30 xxxx (餐廳) https://.....
                                  9:00 yyyy (飯店) https://.....
                                  """))