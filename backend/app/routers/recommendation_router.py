# app/routers/recommendation_router.py
from fastapi import APIRouter, HTTPException, Query
from app.models.recommendation_request import RecommendationRequest
from app.firebase_utils.firebase_client import db
from app.utils.clip_utils import get_text_embedding, get_image_embedding
from app.utils.vector_search import get_top_k_items
from app.utils.gemini_utils import classify_prompt, get_recommendation
import base64
from PIL import Image
import io

router = APIRouter()

@router.post("/recommendation")
async def get_recommendation_route(
    request: RecommendationRequest,
    user_id: str = Query(..., alias="userId", description="User ID")
):
    try:
        # Classify the user prompt to decide whether it's outfit-related.
        intent = classify_prompt(request.history)
        print(intent)

        print('REQUEST -- >', request)

        if intent == "outfit_recommendation":
                
            # Retrieve the user's wardrobe items from Firestore.
            wardrobe_docs = db.collection("wardrobe").where("user_id", "==", user_id).stream()
            wardrobe_items = [doc.to_dict() for doc in wardrobe_docs]
            
            if wardrobe_items:
                image = None
                if request.uploaded_item:
                    image_data = base64.b64decode(request.uploaded_item)
                    image = Image.open(io.BytesIO(image_data)).convert("RGB")            
                    query_embedding = get_image_embedding(image)
                else:
                    query_embedding = get_text_embedding(request.details)

                top_items = get_top_k_items(query_embedding, wardrobe_items, k=5)
                # print("TOP K ITEMS = ", top_items)
        
                # Get the structured recommendation using the top items (which may be empty)
                recommendation_result = get_recommendation(
                    request.details,
                    request.history or "",
                    request.location or "",
                    image or None,
                    top_items
                    )
                print("Recommendation by GEMINI (recommendation_router.py): ", recommendation_result)
                
                return {
                    "intent": intent,
                    "raw_recommendation": recommendation_result.get("raw_text"),
                    "wardrobe_used": bool(wardrobe_items)
                }
            return {
                    "intent" : 'No item',
                    "message": "Hi there! Add items to your wardrobe to get recommendations",
                    "wardrobe_used": False
            }
        
        # Fallback case: prompt is not recognized as outfit-related.
        return {
            "intent": intent,
            "message": "Hi there! I can help you pick outfits. Try asking something like 'What should I wear today?' 😊",
            "wardrobe_used": False
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
