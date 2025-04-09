# app/models/recommendation_request.py

from typing import Optional
from pydantic import BaseModel

class RecommendationRequest(BaseModel):
    details: str
    history: Optional[str] = None
    location: Optional[str] = None
    uploaded_item: Optional[str] = None 
