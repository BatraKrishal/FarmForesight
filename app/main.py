import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv
from google import genai
from fastapi.staticfiles import StaticFiles

from .predictor import full_recommendation

load_dotenv()

app = FastAPI(title="Crop Recommendation API", description="ML-based agricultural recommendation system")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/crops", StaticFiles(directory=os.path.join(os.path.dirname(__file__), "../frontend/public/crops")), name="crops")

try:
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
except Exception as e:
    client = None
    print(f"Failed to initialize Gemini Client: {e}")

class PredictionRequest(BaseModel):
    n: float
    p: float
    k: float
    ph: float
    city: str
    use_custom_weather: Optional[bool] = False
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    rainfall: Optional[float] = None

class ChatbotRequest(BaseModel):
    message: str

@app.get("/")
def health_check():
    return {"status": "ok", "message": "Agricultural Recommendation System is running."}

@app.post("/predict")
def predict(req: PredictionRequest):
    try:
        result = full_recommendation(
            n=req.n, 
            p=req.p, 
            k=req.k, 
            ph=req.ph, 
            city=req.city,
            use_custom_weather=req.use_custom_weather,
            temperature=req.temperature,
            humidity=req.humidity,
            rainfall=req.rainfall
        )
        return result
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

@app.post("/chatbot")
def chatbot(req: ChatbotRequest):
    if not client:
        raise HTTPException(status_code=500, detail="Gemini client not initialized.")
    
    try:
        # 1. Parse user input into structured JSON
        parsing_prompt = f"""
You are an agricultural assistant. Extract the following soil and weather parameters from the user's message.
Return ONLY a valid JSON object. No markdown, no extra text.
Required keys: 'n', 'p', 'k', 'ph', 'city'
Optional keys: 'use_custom_weather' (bool), 'temperature', 'humidity', 'rainfall'

If temperature, humidity, or rainfall are provided in the text, set 'use_custom_weather' to true and include them. Otherwise omit them or set 'use_custom_weather' to false.
Default to realistic values for n, p, k (e.g., 50) and ph (e.g., 6.5) if not provided, and default city to 'Delhi' if not mentioned.

User message: "{req.message}"
        """
        
        parse_resp = client.models.generate_content(
            model="models/gemini-2.5-flash",
            contents=parsing_prompt
        )
        
        import re
        json_match = re.search(r'\{.*\}', parse_resp.text, re.DOTALL)
        if not json_match:
            raise ValueError("Failed to parse JSON from model response")
            
        parsed_data = json.loads(json_match.group(0))
        
        # 2. Get recommendation
        pred_req = PredictionRequest(**parsed_data)
        crop_data = full_recommendation(
            n=pred_req.n, 
            p=pred_req.p, 
            k=pred_req.k, 
            ph=pred_req.ph, 
            city=pred_req.city,
            use_custom_weather=pred_req.use_custom_weather,
            temperature=pred_req.temperature,
            humidity=pred_req.humidity,
            rainfall=pred_req.rainfall
        )
        
        # 3. Generate conversational response
        response_prompt = f"""
You are a practical and intelligent agriculture assistant helping Indian farmers.

Your task is to convert structured farm analysis JSON into a natural conversational response.

RULES:
- Use simple and friendly language
- Keep response concise but useful
- Avoid robotic wording
- Avoid repeating information
- Give practical farming advice
- ONLY use information present in the JSON
- Do not invent data
- Sound like a real farming advisor

RESPONSE FORMAT:
- Greeting
- Recommended crop
- Why it suits the conditions
- Irrigation advice
- Risks/warnings
- Sustainability suggestions
- Positive ending

Farm Data:
{json.dumps(crop_data, indent=2)}

Keep the response conversational and easy to understand. Answer the user's question directly if they asked something specific.
"""

        final_resp = client.models.generate_content(
            model="models/gemini-2.5-flash",
            contents=response_prompt
        )
        
        return {"response": final_resp.text, "parsed_data": parsed_data, "crop_data": crop_data}
        
    except Exception as e:
        error_msg = str(e)
        if "429" in error_msg or "RESOURCE_EXHAUSTED" in error_msg:
            raise HTTPException(status_code=429, detail="Gemini API rate limit exceeded. Please wait a minute and try again.")
        raise HTTPException(status_code=500, detail=f"Chatbot error: {error_msg}")
