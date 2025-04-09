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

### Screenshots

1. Sign In Screen - ![Sign In ](https://github.com/user-attachments/assets/0573cbd8-8829-4ee4-9a1d-490863e2cb1b)
2. Sign Up Screen - ![Sign_up](https://github.com/user-attachments/assets/8278ae7f-b3a3-47b6-a43a-ab2d40fc88f9)
3. Wardrobe Screen - ![Wardrobe Screen](https://github.com/user-attachments/assets/87c49c9c-e760-4975-9199-bf20ffa72185)
4. Empty Wardrobe Screen - ![Empty wardrobe screen](https://github.com/user-attachments/assets/63803264-afb8-423e-8618-02775a415f48)
5. Example - Wardrobe Items - ![Wardrobe item view](https://github.com/user-attachments/assets/a7b3c79c-36e3-49b5-8b12-fae7f2bef515)
                            - ![Wardrobe item view 2](https://github.com/user-attachments/assets/24710761-8ecc-496e-943b-cdf04e636792)
6. Recommendation Screen - ![Chatbot interface](https://github.com/user-attachments/assets/47f7cc5e-dd2f-41e8-843c-ff5314482023)
7. Model Feedback -
     - Textual query - ![textual query feedback](https://github.com/user-attachments/assets/da7e52d9-20c3-4368-9f0e-d3a2ffd909ae)
                     - ![textual-query-feedback 2](https://github.com/user-attachments/assets/6345f80d-e15c-4729-8308-9b3344a6c564)
     - Image-upoad feedback - ![Image-upload-feedback](https://github.com/user-attachments/assets/39257ec7-30d4-419b-90e1-14df03817a91)
                            - ![image-feedback 2](https://github.com/user-attachments/assets/6ac0aa54-9848-459a-9418-d4c398f3aec7)















