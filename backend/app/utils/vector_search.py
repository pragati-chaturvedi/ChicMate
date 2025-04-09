import numpy as np
import json

def cosine_similarity(a, b):
    a = np.array(a)
    b = np.array(b)
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

def get_top_k_items(query_embedding, items, k=5):
    """
    Given a query embedding and a list of items (each with an 'embedding' key),
    group the items by their type and return the top k items from each group
    based on cosine similarity. If an item doesn't have an 'item_type' field, we try to 
    parse it from its description; if that fails, we use "Uncategorized".
    """
    groups = {}
    # Group items by type.
    for item in items:
        # First, try to use the 'item_type' property directly.
        item_type = item.get("item_type")
        if not item_type:
            # Try to parse the item type from the description (assume it's JSON formatted)
            try:
                description_str = item.get("description", "")
                description_str = description_str.replace("```json", "").replace("```", "").strip()
                desc = json.loads(description_str) if description_str else {}
                item_type = desc.get("item_type") or desc.get("type") or "Uncategorized"
            except Exception as e:
                item_type = "Uncategorized"
        if item_type not in groups:
            groups[item_type] = []
        # Compute cosine similarity for the item and add to its group.
        sim = cosine_similarity(query_embedding, item["embedding"])
        groups[item_type].append((sim, item))
    
    # For each group, sort the items by similarity (highest first) and take the top k.
    result = []
    for group, sim_items in groups.items():
        sim_items.sort(key=lambda x: x[0], reverse=True)
        for sim, item in sim_items[:k]:
            filtered_item = {
                "id": item.get("id"),
                "image_url": item.get("image_url"),
                "description": item.get("description"),
                "item_type": group
            }
            result.append(filtered_item)
    return result