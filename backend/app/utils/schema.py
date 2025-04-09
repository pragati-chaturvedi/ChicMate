# Function declaration for classifying prompt intent
classify_prompt_schema = {
    "name": "classify_prompt",
    "description": (
        "Analyzes the user's prompt along with any provided conversation context to determine the intent. "
        "Return 'outfit_recommendation' if the prompt (and context) indicate a request for clothing, fashion, or styling advice; "
        "otherwise, return 'fallback'."
    ),
    "parameters": {
        "type": "object",
        "properties": {
            "intent": {
                "type": "string",
                "description": (
                    "The determined intent based on the prompt and conversation context. "
                    "It should be 'outfit_recommendation' when the user requests outfit advice, "
                    "and 'fallback' for any other kind of query."
                ),
                "enum": ["outfit_recommendation", "fallback"],
            },
            "conversation_context": {
                "type": "string",
                "description": (
                    "Optional conversation context that includes recent dialogue history. "
                    "This field helps disambiguate the user's intent by providing additional context from prior exchanges."
                ),
            },
        },
        "required": ["intent"],
    },
}
