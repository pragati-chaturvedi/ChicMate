# backend/app/utils/gemini_utils.py
import json
from app.utils.gemini_client import MODEL, client
from google.genai import types
from app.utils.schema import classify_prompt_schema

# Function for captioning images uploaded to wardrobe
def generate_caption(image) -> str:
    """
    Uses Gemini to generate a caption for the given PIL Image.
    """
    try:
        prompt = "Please describe this clothing item focusing on type (use only these categories - top, bottom, dress, jumpsuit, sweater, jacket, footwear and accessory ), style, color, and any notable features for storing it in a database used for recommending outfits based on item descriptions . Store the description in JSON format"
        config = types.GenerateContentConfig(
            # max_output_tokens=100,
            temperature=0.5
        )
        response = client.models.generate_content(
            model=MODEL,
            contents=[image, prompt],
            config=config,
        )
        return response.text.strip()
    except Exception as e:
        print(f"[ERROR] Gemini image captioning failed: {e}")
        return "Unable to generate a caption at this time."

def classify_prompt(prompt: str) -> str:
    """
    Uses Gemini function-calling to classify the user's intent.
    Returns either 'outfit_recommendation' or 'fallback'.
    """
    try:
        # Setting up tool declaration for function calling
        tool = types.Tool(function_declarations=[classify_prompt_schema])
        config = types.GenerateContentConfig(tools=[tool])

        # Send the prompt as a single content item
        response = client.models.generate_content(
            model=MODEL,
            contents=[prompt],
            config=config,
        )

        # print("Gemini response: ", response, "/n")

        candidate = response.candidates[0]
        # function_call is nested under candidate.content.parts[0]
        fc = candidate.content.parts[0].function_call

        if fc is not None:
            intent = fc.args.get("intent")
            return intent if intent is not None else "fallback"
        else:
            return "fallback"
   
    except Exception as e:
        print(f"[ERROR] classify_prompt failed: {e}")
        return "fallback"

#Function to get structured recommendation
def get_recommendation(prompt: str, history:str, location:str, uploaded_item, top_wardrobe_images: list, ) -> dict:
    """
    Uses Gemini to generate a structured outfit recommendation, considering the user's prompt,
    conversation context, location, an uploaded image, and top matching wardrobe items n a structured json object.

    Returns:
      A dictionary representing the JSON output from Gemini.
    """

    try:
        # Convert the list of item JSON objects into a JSON string
        items_json_str = json.dumps(top_wardrobe_images, indent=2)
        image_instruction = ""
        if uploaded_item:
            image_instruction = "The user has uploaded an image."
        
        # Construct the combined prompt with all necessary context.
        combined_prompt = (
            f"User Query: {prompt}\n\n"
            f"Conversation Context: {history}\n\n"
            f"Location: {location}\n\n"
            f"{image_instruction}"
            f"Analyze the uploaded image (if provided) and, considering the user's query, provide outfit recommendations.\n"
            f"If relevant, incorporate items from the following wardrobe data:\n{items_json_str}\n\n"
            "Focus on creating a cohesive and stylish outfit that includes or complements the uploaded item.\n"
            "Consider the current weather conditions in the provided location and general fashion trends.\n"
            "If location detail is provided in the user prompt, recommendation should then be based on that."
            "Structure your response as a JSON object with the following format:\n"
            "{\n"
            "  'intent': 'outfit_recommendation',\n"
            "  'recommendation': {\n"
            "    'recommended_outfit': '<raw text explanation of the outfit>',\n"
            "    'recommended_items': [\n"
            "      { 'item_id': '<item id>', 'item_url': '<image url>' },\n"
            "      ... (relevant wardrobe items if any)\n"
            "    ]\n"
            "  }\n"
            "}\n"
            "If no suitable wardrobe items are found, provide general pairing suggestions based on the uploaded item."
            "Note - Do not include item details like item id or url in <raw text explanation>"
        )
        # Set up a configuration for text generation (without tool declarations)
        config = types.GenerateContentConfig(
            temperature=0.7
        )
        
        contents = [combined_prompt]
        if uploaded_item:
            contents = [uploaded_item, combined_prompt]
        
        # Call the Gemini model to generate content using our combined prompt
        response = client.models.generate_content(
            model=MODEL,
            contents=contents,
            config=config,
        )
        print("Response (gemini_utils.py) - ",response)
        generated_text = response.candidates[0].content.parts[0].text
        print("Generated recommendation text:", generated_text)

        # Attempt to parse the generated text as JSON.
        try:
            recommendation_json = json.loads(generated_text)
            return recommendation_json
        except json.JSONDecodeError:
            # If JSON parsing fails, return the raw text.
            return {"raw_text": generated_text}
    
    except Exception as e:
        print(f"[ERROR] get_structured_recommendation failed: {e}")
        return {"raw_text": "Sorry, I couldn't generate a recommendation.", "recommended_item": {}}