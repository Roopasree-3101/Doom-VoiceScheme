"""
VoiceScheme - Indic Language & Script Detection Engine
Identifies Unicode script blocks for Indic languages (Devanagari, Telugu, Tamil, Kannada, Bengali).
"""

INDIC_SCRIPT_MAP = {
    (0x0900, 0x097F): ("hi", "Hindi / Devanagari"),
    (0x0C00, 0x0C7F): ("te", "Telugu"),
    (0x0B80, 0x0BFF): ("ta", "Tamil"),
    (0x0C80, 0x0CFF): ("kn", "Kannada"),
    (0x0980, 0x09FF): ("bn", "Bengali")
}

def detect_language(text: str) -> str:
    """
    Detects the dominant Indic language script or defaults to English.
    
    Args:
        text (str): Input voice transcript or typed text.
        
    Returns:
        str: ISO language code ('hi', 'te', 'ta', 'kn', 'bn', or 'en').
    """
    if not text or not isinstance(text, str):
        return "en"

    # Analyze characters against known Indic Unicode blocks
    for ch in text:
        code = ord(ch)
        for (start, end), (lang_code, _) in INDIC_SCRIPT_MAP.items():
            if start <= code <= end:
                return lang_code

    # Default to Indian English / Romanized script
    return "en"


def get_language_name(lang_code: str) -> str:
    """Returns human-readable language name."""
    names = {
        "en": "English",
        "hi": "Hindi (हिंदी)",
        "te": "Telugu (తెలుగు)",
        "ta": "Tamil (தமிழ்)",
        "kn": "Kannada (ಕನ್ನಡ)",
        "bn": "Bengali (বাংলা)"
    }
    return names.get(lang_code, "English")
