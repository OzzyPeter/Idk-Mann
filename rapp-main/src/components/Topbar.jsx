import {useTheme} from '../context/ThemeContext';
import './Topbar.css';

const Topbar = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="topbar">
      <div className="logo">Audi<span>o</span></div>
      <div className="topbar-right">
        <div className="course-tag">MAT 224 — Mechanics I</div>
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