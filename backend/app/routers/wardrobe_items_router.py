# app/routers/wardrobe_items_router.py
from fastapi import APIRouter, HTTPException
from app.firebase_utils.firebase_client import db
from fastapi import Query

router = APIRouter()

@router.get("/items")
async def get_items(user_id: str = Query(..., alias="userId", description="User ID")):
    """
    Fetch all wardrobe items from Firestore.
    """
    try:
        # Query Firestore for wardrobe items matching the user_id
        docs = db.collection("wardrobe").where("user_id", "==", user_id).stream()
        items = [doc.to_dict() for doc in docs]
        # print("indide wardrobe-items - ", user_id)
        return {"items": items}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
