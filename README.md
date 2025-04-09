# ChicMate
ChicMate is a multi-modal mobile application that provides personalized fashion outfit recommendations using state-of-the-art deep learning models. The app integrates image and text inputs—as well as location data—to offer context-aware style suggestions. It features a conversational chatbot interface, digital wardrobe management, and real-time recommendations.

## Features
1. Conversational Interface: Chat with the app to request outfit ideas.
2. Image & Text Input: Upload images (e.g., a clothing item) or type queries.
3. Digital Wardrobe: View, add, and delete wardrobe items.
4. Context Awareness: Leverages past conversation history and geolocation to refine recommendations.
5. Personalized Recommendations: Uses CLIP for visual/text embedding and Google Gemini for natural language understanding.

## Technologies
- Frontend: React Native with Expo
- Backend: FastAPI
- Machine Learning: CLIP (via Hugging Face) for embeddings; Google Gemini for natural language generation
- Database & Authentication: Firebase Firestore and Firebase Authentication
- Location: Expo Location API

## Usage
- ### Wardrobe Management:
Navigate to the wardrobe screen to upload, view, and delete wardrobe items.

- ### Getting Recommendations:
Use the recommendation chat interface to type queries or upload an image (e.g., a picture of pants) to get outfit suggestions.




