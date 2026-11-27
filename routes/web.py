"""
VoiceScheme - Web UI Blueprint
Serves the voice-first responsive frontend template.
"""

from flask import Blueprint, render_template

web_bp = Blueprint("web", __name__)

@web_bp.route("/", methods=["GET"])
def home():
    """Renders the main VoiceScheme voice-first application interface."""
    return render_template("index.html")
