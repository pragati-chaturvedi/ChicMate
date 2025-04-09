# app/routers/image_router.py
from fastapi import APIRouter, File, UploadFile, HTTPException, Query
from PIL import Image
import io
import uuid
from app.utils.clip_utils import get_image_embedding
from app.firebase_utils.firebase_client import db, upload_image_to_storage
from app.utils.gemini_utils import generate_caption

router = APIRouter()

@router.post("/upload-image")
async def upload_image(file: UploadFile = File(...),
    user_id: str = Query(..., alias="userId", description="User ID")):
    # Validate that the uploaded file is a JPEG or PNG image.
    if file.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(status_code=400, detail="Invalid image format. Use JPEG or PNG.")
    
    # Read file content into memory.
    contents = await file.read()
    try:
        image = Image.open(io.BytesIO(contents)).convert("RGB")
    except Exception as e:
        raise HTTPException(status_code=400, detail="Error processing image: " + str(e))
    
    # Generate a CLIP embedding for the image (for later vector search).
    embedding = get_image_embedding(image)

    #Generate caption for the image using GEMINI
    caption = generate_caption(image)
    
    # Generate a unique ID for the wardrobe item.
    item_id = str(uuid.uuid4())
    
    # Upload the image to Firebase Storage.
    public_url = upload_image_to_storage(contents, file.filename, file.content_type)
    
    # Save metadata in Firestore, including the automatically generated caption.
    wardrobe_item = {
        "id": item_id,
        "user_id": user_id,
        "filename": file.filename,
        "image_url": public_url,
        "embedding": embedding,
        "description": caption
    }
    db.collection("wardrobe").document(item_id).set(wardrobe_item)
    
    return {
        "message": "Image uploaded successfully",
        "item_id": item_id,
        "description": caption,
        "image_url": public_url
    }
