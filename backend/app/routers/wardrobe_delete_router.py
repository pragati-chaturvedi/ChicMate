# app/routers/wardrobe_delete_router.py

from fastapi import APIRouter, HTTPException, Query
from app.firebase_utils.firebase_client import db, bucket

router = APIRouter()

@router.delete("/delete")
async def delete_item(item_id: str = Query(..., description="ID of the wardrobe item to delete"), user_id: str = Query(..., alias="userId", description="User ID")):
    """
    Deletes a wardrobe item by its item_id from Firestore and its associated image from Firebase Storage.
    """
    try:
        # Retrieve the document reference from the 'wardrobe' collection.
        doc_ref = db.collection("wardrobe").document(item_id)
        doc = doc_ref.get()
        
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Item not found")

        # Get the document data
        item = doc.to_dict()
        # Ensure the item belongs to the requesting user
        if item.get("user_id") != user_id:
            raise HTTPException(status_code=403, detail="Not authorized to delete this item")
        
        filename = item.get("filename")
        
        # Delete the image from Firebase Storage if available.
        if filename:
            blob = bucket.blob(f"wardrobe/{filename}")
            blob.delete()
        
        # Delete the Firestore document.
        doc_ref.delete()
        return {"message": "Item deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
