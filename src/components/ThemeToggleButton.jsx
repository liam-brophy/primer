import React from 'react';
import { useTheme } from '../context/ThemeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Dark mode icon
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Light mode icon
import IconButton from '@mui/material/IconButton';

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="theme-toggle-container">
      <IconButton 
        onClick={toggleTheme} 
        aria-label="toggle theme"
        title={theme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
        className="theme-toggle-button"
      >
        {theme === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </div>
  );
};

export default ThemeToggleButton;