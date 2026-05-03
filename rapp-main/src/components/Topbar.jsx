import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import './Topbar.css';

const Topbar = () => {
    const { theme, toggleTheme, courseCode, setCourseCode, courseName, setCourseName } = useTheme();
    const [editing, setEditing] = useState(false);
  const [tempCode, setTempCode] = useState(courseCode);
  const [tempName, setTempName] = useState(courseName);

  const handleConfirm = () => {
    setCourseCode(tempCode || "Course Code");
    setCourseName(tempName || "Course Name");
    setEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleConfirm();
    if (e.key === "Escape") setEditing(false);
  };


    return (
        <div className="topbar">
      <div className="logo">Audi<span>o</span></div>
      <div className="topbar-right">

        {editing ? (
          <div className="course-edit-wrap">
            <input
              className="course-input"
              value={tempCode}
              onChange={(e) => setTempCode(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Course code e.g. PHY 201"
              autoFocus
            />
            <span className="course-divider">—</span>
            <input
              className="course-input"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Course name"
            />
            <button className="course-confirm-btn" onClick={handleConfirm}>
              Save
            </button>
          </div>
        ) : (
          <div 
            className="course-tag" 
            onClick={() => setEditing(true)}
            title="Click to edit course"
          >
            {courseCode} — {courseName}
            <span className="course-edit-icon">✎</span>
          </div>
        )}



        <div className="toggle-wrap">
          <span className="toggle-label">{theme === "light" ? "Light" : "Dark"}</span>
          <div className="toggle" onClick={toggleTheme}>
            <div className="toggle-knob"></div>
          </div>
        </div>
      </div>
    </div>
    );
}

export default Topbar;