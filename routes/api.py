"""
VoiceScheme - REST API Blueprint
Handles /api/voice-query, /api/schemes, /api/tts, and /api/health endpoints.
"""

from flask import Blueprint, request, jsonify, send_file, current_app
from core.language_detector import detect_language
from core.nlp_engine import extract_entities, detect_language_intent
from core.matching_engine import match_schemes, generate_speech_reply
from core.tts_service import synthesize_speech

api_bp = Blueprint("api", __name__, url_prefix="/api")

@api_bp.route("/health", methods=["GET"])
def health():
    """Healthcheck endpoint for Docker and monitoring."""
    schemes = current_app.config.get("SCHEMES", [])
    return jsonify({
        "status": "healthy",
        "service": "VoiceScheme",
        "architecture": "Modular Microservices Pattern",
        "schemes_loaded": len(schemes),
        "engine": "Offline Rule-Based Indic NLP Engine (Zero Secret Keys Required)"
    })

@api_bp.route("/schemes", methods=["GET"])
def get_schemes():
    """Returns the full welfare schemes catalogue or filters by category."""
    schemes = current_app.config.get("SCHEMES", [])
    category = request.args.get("category")
    if category:
        filtered = [s for s in schemes if s.get("category", "").lower() == category.lower()]
        return jsonify(filtered)
    return jsonify(schemes)

@api_bp.route("/voice-query", methods=["POST"])
def voice_query():
    """
    Main conversational pipeline:
    Receives voice query, detects language, extracts entities, matches schemes,
    and returns empathetic voice and card response.
    """
    data = request.get_json() or {}
    query_text = data.get("query", "").strip()
    forced_lang = data.get("language")

    if not query_text:
        return jsonify({
            "error": "No voice transcript or query text provided.",
            "speech_reply": "Please speak into the microphone to tell me about your work and family."
        }), 400

    schemes = current_app.config.get("SCHEMES", [])

    # 1. Language detection
    detected_lang = forced_lang if forced_lang and forced_lang != "auto" else detect_language(query_text)

    # 1b. Voice language-intent override — e.g. "telugulo cheppu" / "hindi mai batao"
    intent_lang = detect_language_intent(query_text)
    if intent_lang:
        detected_lang = intent_lang

    # 2. Entity extraction via deterministic Indic NLP
    entities = extract_entities(query_text)

    # 3. Matching and ranking
    matched = match_schemes(schemes, entities)

    # 4. Spoken voice response generation
    speech_reply = generate_speech_reply(matched, lang=detected_lang)

    return jsonify({
        "query": query_text,
        "language": detected_lang,
        "entities_extracted": {
            "categories": list(entities["categories"]),
            "age": entities["age"],
            "land_acres": entities["land_acres"],
            "is_bpl": entities["is_bpl"],
            "gender": entities["gender"]
        },
        "schemes_count": len(matched),
        "matched_schemes": matched,
        "speech_reply": speech_reply,
        "engine_mode": "Offline Local Rule-Based NLP (100% Zero-Key Verified)"
    })

@api_bp.route("/tts", methods=["GET", "POST"])
def tts_endpoint():
    """Generates MP3 audio stream for browser audio playback."""
    if request.method == "POST":
        data = request.get_json() or {}
        text = data.get("text", "")
        lang = data.get("lang", "en")
    else:
        text = request.args.get("text", "")
        lang = request.args.get("lang", "en")

    if not text:
        return jsonify({"error": "No text provided for TTS"}), 400

    audio_stream = synthesize_speech(text, lang)
    if not audio_stream:
        return jsonify({"error": "TTS audio synthesis failed"}), 500

    return send_file(audio_stream, mimetype="audio/mpeg")
