import React, { createContext, useState, useContext, useEffect } from 'react';
// Remove incorrect self-import and unused imports
// import { Link } from 'react-router-dom';
// import { useTheme } from '../context/ThemeContext.jsx'; 
// import logoLight from '../assets/images/Primer_Logo_Black.png'; 
// import logoDark from '../assets/images/Primer_Logo_White.png'; 

// Create the context
const ThemeContext = createContext();

// Create a provider component
export const ThemeProvider = ({ children }) => {
    // State to hold the current theme (e.g., 'light' or 'dark')
    // Initialize from localStorage or default to 'light'
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme ? savedTheme : 'light'; // Default to light theme
    });

    // Function to toggle the theme
    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    // Effect to update localStorage and body class when theme changes
    useEffect(() => {
        localStorage.setItem('theme', theme);
        document.body.className = theme; // Add theme class to body
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Custom hook to use the theme context
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

// Remove Header component definition from this file
/*
const Header = () => {
    ...
};

export default Header;
*/
