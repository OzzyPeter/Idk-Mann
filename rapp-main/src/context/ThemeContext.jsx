import { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");
  const [courseCode, setCourseCode] = useState("PHY 201");
  const [courseName, setCourseName] = useState("Classical Mechanics");

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };

    return (
    <ThemeContext.Provider value={{ 
      theme, 
      toggleTheme,
      courseCode,
      setCourseCode,
      courseName,
      setCourseName
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);