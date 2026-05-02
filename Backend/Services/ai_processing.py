from google import genai
import json

client = genai.Client(api_key="AIzaSyDvUvGF72xsEGuQCIkVtttHtw6p5FD3sMU")


def summarize_text_extract_concepts(transcript):
    prompt = f"""
        You are a professional note editor.

        Task:
        Convert the transcript into clean, structured study notes and extract 4 key concepts.

        Rules:
        - Keep only relevant information
        - Remove filler, repetition, and irrelevant speech
        - Do not add new information
        - Use plain text only (no markdown or special symbols)

        FORMAT RULES(Very Important!):
        - Do NOT use Markdown (no #, **, *, or similar symbols)
        - Do NOT use special formatting characters
        - Write in plain text only (like a Microsoft Word document)
        - Headings must be written in ALL CAPS (no symbols)
        - Bullet points using "•"
        - Each section must follow this structure:
        1. A short paragraph (essay-style explanation of the topic)
        2. Followed by bullet points that break down the same idea

        Key concepts:
        - Extract exactly 4 short concepts

        Output format (STRICT):

        RETURN:
        {{
        "summary": "...long summary here...",
        "concepts": [
            "concept 1",
            "concept 2",
            "concept 3",
            "concept 4"
        ]
        }}

        Transcript: {transcript}

    """

    response = client.models.generate_content(
        model="gemini-2.5-flash-lite",
        contents=prompt
    )
    
    data = json.loads(response.text)
    
    summary = data["summary"]
    concepts = data["concepts"]

    return {
        "summary": summary,
        "concepts": concepts
    }






