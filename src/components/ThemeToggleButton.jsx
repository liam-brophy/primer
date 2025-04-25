import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="theme-toggle-container">
      <button
        onClick={toggleTheme}
        aria-label="toggle theme"
        title={theme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
        className="theme-toggle-button"
      >
        {theme === 'dark' ? '💡' : '🌙'}
      </button>
    </div>
  );
};

export default ThemeToggleButton;