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
from .analytics import DatasetAnalysisService

load_dotenv()

app = FastAPI(title="Crop Recommendation API", description="ML-based agricultural recommendation system")
analytics_service = DatasetAnalysisService()

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
        import os
        key_exists = bool(os.getenv("GEMINI_API_KEY"))
        raise HTTPException(status_code=500, detail=f"Gemini client not initialized. GEMINI_API_KEY exists: {key_exists}")
    
    try:
        # 1. Intent Classification
        intent_prompt = f"""
You are an intent classifier for an agricultural chatbot.
Classify the user's message into one of two categories:
1. "recommendation": The user is giving soil/weather parameters and wants a crop recommendation.
2. "analytics": The user is asking a question about the dataset itself (e.g., how many records, most frequent crop, average rainfall, trends, or filtering by a condition).

If it's analytics, also determine the 'query_type' from this list:
- "count": e.g., how many records, size of dataset
- "frequent_crop": e.g., most common crop, which crop appears most
- "average_rainfall": e.g., average rainfall
- "feature_impact": e.g., which feature impacts prediction the most, which feature varies most
- "filter_condition": e.g., show crops suitable for high humidity, crops for rainfall above 200 mm
- "trends": e.g., what trends exist

Return ONLY a valid JSON object. No markdown, no extra text.
Format:
{{
  "intent": "recommendation" | "analytics",
  "query_type": "...", // null if recommendation
  "feature": "...", // feature name (e.g., 'humidity', 'rainfall') if query_type is filter_condition
  "threshold": 0 // numeric threshold if query_type is filter_condition
}}

User message: "{req.message}"
"""
        intent_resp = client.models.generate_content(
            model="models/gemini-2.5-flash-lite",
            contents=intent_prompt
        )
        
        import re
        json_match = re.search(r'\{.*\}', intent_resp.text, re.DOTALL)
        if not json_match:
            intent_data = {"intent": "recommendation"}
        else:
            intent_data = json.loads(json_match.group(0))

        if intent_data.get("intent") == "analytics":
            # Analytics flow
            query_type = intent_data.get("query_type", "count")
            params = {}
            if query_type == "filter_condition":
                params = {
                    "feature": intent_data.get("feature", "rainfall"),
                    "threshold": intent_data.get("threshold", 0)
                }
            
            # Execute query
            analytics_result = analytics_service.execute_query(query_type, params)
            
            # Generate conversational response
            response_prompt = f"""
You are an intelligent data analyst for an Indian farming dataset.
The user asked a question about the dataset.

User question: "{req.message}"
Data Result: {json.dumps(analytics_result, indent=2)}

Answer the user's question directly and conversationally using ONLY the provided data.
Explain the insight simply. Do not mention JSON or code.
"""
            final_resp = client.models.generate_content(
                model="models/gemini-2.5-flash",
                contents=response_prompt
            )
            
            return {"response": final_resp.text, "parsed_data": intent_data, "crop_data": analytics_result}

        # 2. Recommendation Flow
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
        
        json_match = re.search(r'\{.*\}', parse_resp.text, re.DOTALL)
        if not json_match:
            raise ValueError("Failed to parse JSON from model response")
            
        parsed_data = json.loads(json_match.group(0))
        
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
- If water savings are calculated in the irrigation section, mention them and explain it's based on comparing our AI method against traditional flood irrigation.

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
        import traceback
        traceback.print_exc()
        error_msg = str(e)
        if "429" in error_msg or "RESOURCE_EXHAUSTED" in error_msg:
            raise HTTPException(status_code=429, detail="Gemini API rate limit exceeded. Please wait a minute and try again.")
        elif "503" in error_msg or "UNAVAILABLE" in error_msg:
            raise HTTPException(status_code=503, detail="The AI model is currently experiencing high demand. Please try again in a few moments.")
        raise HTTPException(status_code=500, detail=f"Chatbot error: {error_msg}")
