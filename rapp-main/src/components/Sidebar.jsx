import "./Sidebar.css";

const Sidebar = ({ isRecording, audioBlob, onStart, onStop, onUpload, onSubmit, loading, transcript, result }) => {

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <div className="sidebar">
      <div className="sec-label">Record</div>

      {/* live recording button */}
      <div className="rec-card" onClick={isRecording ? onStop : onStart}>
        <div className="rec-dot-wrap">
          <div className={`rec-dot ${isRecording ? "recording" : ""}`}>
            <div className="rec-dot-inner"></div>
          </div>
          <span className="rec-live">{isRecording ? "RECORDING..." : "LIVE"}</span>
        </div>
        <div className="rec-title">{isRecording ? "Click to stop" : "Start live recording"}</div>
        <div className="rec-sub">Capture your lecturer in real time</div>
      </div>

      {/* upload option */}
      <label className="upload-card">
        <div className="up-icon">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2v8M5 5l3-3 3 3M2 13h12" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <div>
          <div className="up-main">{audioBlob ? "File ready ✓" : "Upload audio file"}</div>
          <div className="up-sub">.mp3 · .m4a · .wav · up to 200MB</div>
        </div>
        <input type="file" accept="audio/*" onChange={handleFileChange} style={{ display: "none" }} />
      </label>

      {/* submit button — only shows when there's audio ready */}
      {audioBlob && !result && (
        <button className="submit-btn" onClick={onSubmit} disabled={loading}>
          {loading ? "Processing..." : "Analyse lecture →"}
        </button>
      )}

      {/* waveform animation */}
      {isRecording && (
        <>
          <div className="sec-label">Processing</div>
          <div className="waveform">
            <span className="wave-label">Recording</span>
            <div className="wave-bars">
              {[10,16,8,18,12,14,9].map((h, i) => (
                <div key={i} className="wb" style={{ height: `${h}px`, animationDelay: `${i * 0.1}s` }}></div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* transcript shows up after API response */}
      {transcript && (
        <>
          <div className="sec-label">Live transcript</div>
          <div className="tr-box">
            <div className="tr-text">{transcript}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;