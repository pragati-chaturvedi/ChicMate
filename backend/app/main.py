# app/main.py

from fastapi import FastAPI
from app.routers import ( wardrobe_items_router,
                         wardrobe_upload_router, 
                         wardrobe_delete_router, 
                         recommendation_router)
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="ChicMate's Backend")

@app.get("/")
async def read_root():
    return {"message" : "Welcome to ChicMate's Backend!"}

app.include_router(wardrobe_items_router.router, prefix="/api/v1/wardrobe")
app.include_router(wardrobe_upload_router.router, prefix="/api/v1/wardrobe")
app.include_router(wardrobe_delete_router.router, prefix="/api/v1/wardrobe")
app.include_router(recommendation_router.router, prefix="/api/v1")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
