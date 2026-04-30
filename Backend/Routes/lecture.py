from flask import Blueprint, request, jsonify
import uuid
import os
from Services.transcription import transcribe_audio
from Services.ai_processing import summarize_text, extract_concepts

lecture_bp = Blueprint("lecture", __name__)

@lecture_bp.route("/analyze-lecture", methods=["POST"])
def analyze_lecture():
    audio_file = request.files.get("audio")

    if not audio_file:
        return jsonify({"error": "No audio received"}), 400

    audio_path = f"temp_audio_{uuid.uuid4()}.webm"
    audio_file.save(audio_path)

    try:
        transcript = transcribe_audio(audio_path)
        summary = summarize_text(transcript)
        concepts = extract_concepts(summary)

        return jsonify({
            "transcript": transcript,
            "summary": summary,
            "concepts": concepts
        })

    finally:
        if os.path.exists(audio_path):
            os.remove(audio_path)