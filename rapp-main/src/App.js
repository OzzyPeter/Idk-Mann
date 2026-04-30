import { useTheme } from "./context/ThemeContext";
import TopBar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import OutputPanel from "./components/OutputPanel";
import './App.css';
import useRecorder from "./hooks/useRecorder";
import { useState } from "react";

const App = () => {
  const { theme } = useTheme();
  const { isRecording, audioBlob, startRecording, stopRecording, handleUpload, resetRecorder } = useRecorder();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!audioBlob) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");

      const response = await fetch("http://127.0.0.1:5000/analyze-lecture", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      
      console.log("Full response:", data); // Debug: See what backend returns

      // Simply use data.concepts directly - it's already an array!
      setResult({
        transcript: data.transcript,
        summary: data.summary,
        concepts: data.concepts,  // NO JSON.parse() needed!
        visualization: data.visualization,
      });

    } catch (err) {
      console.error("Error sending audio:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewSession = () => {
    setResult(null);
    setLoading(false);
    resetRecorder();
  };

  return (
    <div className="app" data-theme={theme}>
      <TopBar />
      <div className="app-body">
        <Sidebar
          isRecording={isRecording}
          audioBlob={audioBlob}
          onStart={startRecording}
          onStop={stopRecording}
          onUpload={handleUpload}
          onSubmit={handleSubmit}
          loading={loading}
          transcript={result?.transcript}
          result={result}
        />
        <OutputPanel result={result} loading={loading} onNewSession={handleNewSession} />
      </div>
    </div>
  );
}

export default App;