from flask import Flask, request, jsonify
from flask_cors import CORS
from faster_whisper import WhisperModel
from google import genai
import os
import json



app = Flask(__name__)
CORS(app)

client = genai.Client(api_key="AIzaSyCvqQktKZ6oNH7BurgAZFdMXlwcLdFvTTE")

Wh_model = WhisperModel("base")

@app.route("/analyze-lecture", methods=["POST"])
def analyze_lecture():

    audio_file = request.files.get("audio")

    if not audio_file:
        return jsonify({"error": "No audio received"}), 400
    
    audio_path = "temp_audio.webm"
    audio_file.save(audio_path)


    try:
        segments, info = Wh_model.transcribe(
            audio_path,
            beam_size=10,
            language = "en"
        )

        transcript = " ".join([segment.text for segment in segments])

        prompt = f""" 
                    You are a professional note writer and editor.

                    Your task is to convert the transcript into clean, structured study notes.

                    CORE OBJECTIVE:
                    Only keep information relevant to the main topic. Remove filler speech, repetition, and irrelevant comments.

                    FORMAT RULES:
                    - Do NOT use Markdown (no #, **, *, or similar symbols)
                    - Do NOT use special formatting characters
                    - Write in plain text only (like a Microsoft Word document)
                    - Headings must be written in ALL CAPS (no symbols)
                    - Each section must follow this structure:
                    1. A short paragraph (essay-style explanation of the topic)
                    2. Followed by bullet points that break down the same idea

                    BULLET POINT RULES:
                    - Use the dot symbol "•" for bullets
                    - Keep bullets short and clear
                    - Do not repeat the paragraph word-for-word in bullets

                    CONTENT RULES:
                    - Remove anything not related to the main topic
                    - Do not add new knowledge or external explanations
                    - Do not exaggerate or rewrite meaning
                    - Only clean and organize what is spoken

                    OUTPUT STYLE:
                    - Clean, academic, Word-document style notes
                    - Structured by topics
                    - Easy to read and revise

                    Transcript:{transcript}
                """
        
        response = client.models.generate_content(
            model = "gemini-2.5-flash-lite",
            contents = prompt
        )

        summary = response.text

        prompt1 = f"""
                        You are a key concept extractor.

                        Your task is to identify the 4 most important concepts from the given text.

                        RULES:
                        - Extract ONLY 4 key concepts
                        - Each concept must be a single short line
                        - Do NOT explain anything
                        - Do NOT add extra information
                        - Do NOT summarize the whole text
                        - Focus only on the most important ideas in the input

                        FORMAT:
                        - Return exactly 4 lines
                        - Each line should contain one concept only
                        - No numbering, no bullets, no symbols

                        Prioritize scientific or core academic concepts only. Ignore filler or descriptive sentences.
                        
                        Finally: Return ONLY a JSON array of 4 key concepts.

                        Example format:
                        ["concept 1", "concept 2", "concept 3", "concept 4"]

                        Do not add any explanation or extra text.

                        Transcript: {summary}
                   """

        response1 = client.models.generate_content(
            model = "gemini-2.5-flash-lite",
            contents = prompt1
        )

        
        concepts = json.loads(response1.text)


        result = {
            "transcript": transcript,
            "summary": summary,        
            "concepts": concepts,       
        }
        print(summary, concepts)

        return jsonify(result)


    finally:
        if os.path.exists(audio_path):
            os.remove(audio_path)


if __name__ == "__main__":
    app.run(debug=True)
