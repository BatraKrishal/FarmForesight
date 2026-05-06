from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from .predictor import full_recommendation

app = FastAPI(title="Crop Recommendation API", description="ML-based agricultural recommendation system")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictionRequest(BaseModel):
    n: float
    p: float
    k: float
    ph: float
    city: str

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
            city=req.city
        )
        return result
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
