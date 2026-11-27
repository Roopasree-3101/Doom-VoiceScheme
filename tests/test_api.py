"""
Integration Tests for VoiceScheme Flask API Routes
"""

import unittest
from app import create_app

class TestApiRoutes(unittest.TestCase):

    def setUp(self):
        self.app = create_app({"TESTING": True})
        self.client = self.app.test_client()

    def test_healthcheck(self):
        """Tests that /api/health returns healthy status and scheme counts."""
        res = self.client.get("/api/health")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data["status"], "healthy")
        self.assertGreaterEqual(data["schemes_loaded"], 1)

    def test_schemes_list(self):
        """Tests that /api/schemes returns database records."""
        res = self.client.get("/api/schemes")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIsInstance(data, list)
        self.assertGreaterEqual(len(data), 1)

    def test_voice_query_farmer(self):
        """Tests /api/voice-query endpoint with a farmer voice query."""
        res = self.client.post("/api/voice-query", json={
            "query": "I am a small farmer with 2 acres land. What schemes are there for me?",
            "language": "en"
        })
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data["language"], "en")
        self.assertGreater(data["schemes_count"], 0)
        self.assertIn("speech_reply", data)

    def test_voice_query_empty(self):
        """Tests that empty query returns a 400 Bad Request with guidance."""
        res = self.client.post("/api/voice-query", json={"query": ""})
        self.assertEqual(res.status_code, 400)

    def test_web_home(self):
        """Tests that the frontend HTML template is served at /."""
        res = self.client.get("/")
        self.assertEqual(res.status_code, 200)
        self.assertIn(b"VoiceScheme", res.data)

if __name__ == "__main__":
    unittest.main()
