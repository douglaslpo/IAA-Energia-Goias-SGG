from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="API de Análise Energética")

class PredictionRequest(BaseModel):
    region: str
    start_date: datetime
    end_date: datetime
    granularity: str = "daily"

@app.post("/predictions/consumption")
async def predict_consumption(request: PredictionRequest):
    try:
        predictions = energy_predictor.get_predictions(
            region=request.region,
            start_date=request.start_date,
            end_date=request.end_date,
            granularity=request.granularity
        )
        return predictions
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 