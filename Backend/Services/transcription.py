from faster_whisper import WhisperModel

Wh_model = WhisperModel("base")

def transcribe_audio(audio_path):
    segments, info = Wh_model.transcribe(
        audio_path,
        beam_size=10,
        language="en"
    )

    transcript = " ".join([segment.text for segment in segments])
    return transcript