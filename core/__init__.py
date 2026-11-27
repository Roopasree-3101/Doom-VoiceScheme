"""
VoiceScheme Core Service Modules
"""
from core.language_detector import detect_language, get_language_name
from core.nlp_engine import extract_entities, INDIC_VOCABULARY, detect_language_intent
from core.matching_engine import match_schemes, generate_speech_reply
from core.tts_service import synthesize_speech

__all__ = [
    "detect_language",
    "get_language_name",
    "extract_entities",
    "INDIC_VOCABULARY",
    "detect_language_intent",
    "match_schemes",
    "generate_speech_reply",
    "synthesize_speech"
]
