"""
VoiceScheme - Audio & TTS Synthesis Service
Handles text-to-speech audio rendering using gTTS with graceful fallbacks.
"""

from io import BytesIO
from typing import Optional
from gtts import gTTS

# Language mapping for Google TTS
TTS_LANG_MAP = {
    "hi": "hi",
    "hindi": "hi",
    "te": "te",
    "telugu": "te",
    "ta": "ta",
    "tamil": "ta",
    "bn": "bn",
    "bengali": "bn",
    "en": "en"
}

def synthesize_speech(text: str, lang: str = "en") -> Optional[BytesIO]:
    """
    Synthesizes speech into an MP3 in-memory buffer.
    
    Args:
        text (str): Spoken response text (max 300 chars for optimal latency).
        lang (str): Target language code.
        
    Returns:
        BytesIO: In-memory MP3 audio stream, or None if synthesis fails.
    """
    if not text:
        return None

    target_lang = TTS_LANG_MAP.get(lang.lower(), "en")
    truncated_text = text[:300]

    # Attempt regional synthesis
    try:
        fp = BytesIO()
        tts = gTTS(text=truncated_text, lang=target_lang, slow=False)
        tts.write_to_fp(fp)
        fp.seek(0)
        return fp
    except Exception as e:
        print(f"[TTS Service] Warning: Regional synthesis for '{target_lang}' failed: {e}. Trying fallback...")
        
    # Fallback to English
    try:
        fp = BytesIO()
        tts = gTTS(text=truncated_text, lang="en", slow=False)
        tts.write_to_fp(fp)
        fp.seek(0)
        return fp
    except Exception as e2:
        print(f"[TTS Service] Error: Fallback synthesis failed: {e2}")
        return None
