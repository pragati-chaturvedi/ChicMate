# app/utils/clip_utils.py
from transformers import CLIPProcessor, CLIPModel
import torch


# Load the CLIP model and processor once at startup.
clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

def get_image_embedding(image):
    """
    Processes an image using CLIP and returns its embedding as a list of floats.
    :param image: PIL.Image object (must be in RGB mode)
    :return: embedding as a list of floats.
    """
    inputs = clip_processor(images=image, return_tensors="pt")
    with torch.no_grad():
        image_features = clip_model.get_image_features(**inputs)
    embedding = image_features.squeeze().tolist()
    return embedding


def get_text_embedding(text):
    """
    Processes a text string using CLIP’s text encoder and returns its embedding as a list of floats.
    :param text: Input text
    :return: embedding as list of floats
    """
    inputs = clip_processor(text=[text], return_tensors="pt", padding=True)
    with torch.no_grad():
        text_features = clip_model.get_text_features(**inputs)
    return text_features.squeeze(0).tolist()