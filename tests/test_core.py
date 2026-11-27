"""
Unit Tests for VoiceScheme Core Services
(Language Detector, Indic NLP Engine, Scheme Matcher)
"""

import unittest
from core.language_detector import detect_language, get_language_name
from core.nlp_engine import extract_entities
from core.matching_engine import match_schemes, generate_speech_reply

class TestCoreServices(unittest.TestCase):

    def test_language_detection(self):
        """Tests script detection across Indic languages and English."""
        self.assertEqual(detect_language("Hello farmer"), "en")
        self.assertEqual(detect_language("नमस्ते, मुझे योजना चाहिए"), "hi")
        self.assertEqual(detect_language("నమస్కారం, నాకు పథకాలు కావాలి"), "te")
        self.assertEqual(detect_language("வணக்கம்"), "ta")
        self.assertEqual(get_language_name("hi"), "Hindi (हिंदी)")
        self.assertEqual(get_language_name("te"), "Telugu (తెలుగు)")

    def test_farmer_entity_extraction(self):
        """Tests entity parsing for agricultural queries."""
        query = "I am a small farmer with 2 acres land, rain damaged my paddy crops."
        entities = extract_entities(query)
        self.assertIn("farmer", entities["categories"])
        self.assertIn("disaster", entities["categories"])
        self.assertEqual(entities["land_acres"], 2.0)

    def test_widow_hindi_entity_extraction(self):
        """Tests Devanagari Hindi entity parsing for widow pension."""
        query = "मेरे पति का देहांत हो गया है, मेरे दो छोटे बच्चे हैं और घर कच्चा है।"
        entities = extract_entities(query)
        self.assertIn("widow", entities["categories"])
        self.assertIn("housing", entities["categories"])

    def test_artisan_telugu_entity_extraction(self):
        """Tests Telugu entity parsing for traditional artisans."""
        query = "నేను గ్రామీణ ప్రాంతంలో వడ్రంగి పని చేస్తాను. నాకు ఉపకరణాలు కావాలి."
        entities = extract_entities(query)
        self.assertIn("artisan", entities["categories"])

    def test_scheme_matching_and_speech_generation(self):
        """Tests multi-criteria scoring and empathetic voice formatting."""
        mock_schemes = [
            {
                "id": "pm_kisan",
                "name": "PM Kisan",
                "target_group": ["farmer"],
                "benefit": "₹6,000/yr",
                "required_documents": ["Aadhaar"]
            },
            {
                "id": "widow_pension",
                "name": "Widow Pension",
                "name_hi": "विधवा पेंशन",
                "target_group": ["widow"],
                "benefit": "₹2,000/month",
                "required_documents": ["Death Certificate"]
            }
        ]

        # Match farmer
        entities = {"categories": {"farmer"}}
        matched = match_schemes(mock_schemes, entities)
        self.assertEqual(matched[0]["id"], "pm_kisan")

        # Speech reply in Hindi
        speech_hi = generate_speech_reply([mock_schemes[1]], lang="hi")
        self.assertIn("विधवा पेंशन", speech_hi)

if __name__ == "__main__":
    unittest.main()
