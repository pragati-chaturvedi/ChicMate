# app/utils/captioning.py

from transformers import BlipProcessor, BlipForConditionalGeneration
from PIL import Image

# Initialize the captioning model and processor once at startup.
processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

def generate_caption(image: Image.Image) -> str:
    """
    Generates a caption for the given image using the BLIP model.
    
    :param image: A PIL Image object.
    :return: A generated caption as a string.
    """
    # Prepare the image for the model
    inputs = processor(images=image, return_tensors="pt")
    
    # Generate caption
    output = model.generate(**inputs)
    caption = processor.decode(output[0], skip_special_tokens=True)
    
    return caption
