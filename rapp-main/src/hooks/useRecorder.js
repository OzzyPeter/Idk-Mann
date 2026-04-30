import { useState, useRef } from "react";

const useRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      // ask browser for microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      // every time a chunk of audio is ready, save it
      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      // when recording stops, combine all chunks into one audio file
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access denied:", err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const handleUpload = (file) => {
    setAudioBlob(file);
  };

  const resetRecorder = () => {
  setAudioBlob(null);
  setIsRecording(false);
};

  return { isRecording, audioBlob, startRecording, stopRecording, handleUpload, resetRecorder };
};

export default useRecorder;