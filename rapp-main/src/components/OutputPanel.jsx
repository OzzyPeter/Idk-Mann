import { useTheme } from "../context/ThemeContext";
import "./OutputPanel.css";

const OutputPanel = ({ result, loading, onNewSession }) => {
  const { courseCode, courseName } = useTheme();


  if (loading) {
    return (
      <div className="output-panel">
        <div className="loading-state">
          <div className="loading-dot"></div>
          <p>Analysing your lecture...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="output-panel">
        <div className="empty-state">
          <div className="empty-icon">◎</div>
          <p>Record or upload a lecture to get started</p>
        </div>
      </div>
    );
  }

  // Safety fallback
  const concepts = result.concepts || [];
  const summary = result.summary || "";
  const transcript = result.transcript || "";

  const handleDownload = () => {
    const content = `
  ${courseCode} — ${courseName}
Lecture Notes

Summary

${summary}

Key Concepts

${concepts.map((concept, i) => `${i + 1}. ${concept}`).join("\n")}
    `.trim();

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "lecture-notes.txt";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="output-panel">

      <div className="output-header">
        <div className="output-title">Lecture Notes</div>
        <div className="output-sub">Updated just now</div>
      </div>

      {/* SUMMARY (FORCED PLAIN TEXT) */}
      {summary && (
        <div className="summary-prose">
          <div style={{ whiteSpace: "pre-wrap" }}>
            {summary}
          </div>
        </div>
      )}

      {/* KEY CONCEPTS */}
      {concepts.length > 0 && (
        <>
          <div className="sec-label">Key Concepts</div>

          <div className="concepts-grid">
            {concepts.map((concept, i) => (
              <div key={i} className="concept-chip">
                <span className="concept-num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span style={{ whiteSpace: "pre-wrap" }}>
                  {concept}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* VISUALIZATION */}
      {result.visualization && (
        <>
          <div className="sec-label">Visualization</div>

          <div className="viz-area">
            <img
              src={`data:image/png;base64,${result.visualization}`}
              alt="Generated visualization"
              className="viz-img"
            />
          </div>
        </>
      )}

      {/* BUTTONS */}
      <div className="btns">
        <button className="btn-outline" onClick={handleDownload}>
          Download Notes
        </button>

        <button className="btn-fill" onClick={onNewSession}>
          New Session
        </button>
      </div>

    </div>
  );
};

export default OutputPanel;