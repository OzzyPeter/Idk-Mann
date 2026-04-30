from google import genai
import json

client = genai.Client(api_key="AIzaSyCvqQktKZ6oNH7BurgAZFdMXlwcLdFvTTE")


def summarize_text(transcript):
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
        model="gemini-2.5-flash-lite",
        contents=prompt
    )

    return response.text


def extract_concepts(summary):
    prompt = f"""
        You are a key concept extractor.

        Your task is to identify the 4 most important concepts from the given text.
                        
        Important!: Return ONLY a JSON array of 4 key concepts.

        Example format:
        ["concept 1", "concept 2", "concept 3", "concept 4"]

        Do not add any explanation or extra text.

        Transcript: {summary}

    """

    response = client.models.generate_content(
        model="gemini-2.5-flash-lite",
        contents=prompt
    )

    return json.loads(response.text)