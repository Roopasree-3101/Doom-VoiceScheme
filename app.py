"""
VoiceScheme - Multilingual Voice-First Platform for Government Welfare Schemes
Build for Bharat | Scaler x Wispr Flow Hackathon Round 2 Prototype
Theme: Public Infrastructure and Civic Services
Author: Roopa Sree (Doom-VoiceScheme)
Architecture: Modular Clean Architecture with Flask Blueprints
"""

import os
import json
from flask import Flask
from routes import api_bp, web_bp

def load_schemes_database(data_path: str):
    """Loads the welfare schemes database from disk."""
    try:
        with open(data_path, "r", encoding="utf-8") as f:
            schemes = json.load(f)
        print(f"[VoiceScheme] Successfully loaded {len(schemes)} welfare schemes from database.")
        return schemes
    except Exception as e:
        print(f"[VoiceScheme] Warning: Could not load schemes database: {e}")
        return []

def create_app(config=None):
    """
    Application Factory Pattern:
    Instantiates and configures the Flask application, registers service blueprints,
    and mounts global database dependencies.
    """
    app = Flask(__name__)

    base_dir = os.path.dirname(os.path.abspath(__file__))
    data_file = os.path.join(base_dir, "data", "schemes.json")

    # Load schemes into application config
    app.config["SCHEMES"] = load_schemes_database(data_file)
    if config:
        app.config.update(config)

    # Register Blueprints
    app.register_blueprint(web_bp)
    app.register_blueprint(api_bp)

    return app

# Main WSGI application instance
app = create_app()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"\n=======================================================")
    print(f"🚀 VoiceScheme Server Starting on port {port}")
    print(f"🌟 Architecture: Modular Factory Pattern & Indic NLP Services")
    print(f"🌟 Hackathon Mode: Zero Secret Keys Needed (100% Offline)")
    print(f"🌐 Access URL: http://localhost:{port}")
    print(f"=======================================================\n")
    app.run(host="0.0.0.0", port=port, debug=False)
