import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Footer = () => {
    const { theme } = useTheme();
    
    return (
        <footer className={`footer-container ${theme}`}>
            <p>&copy; {new Date().getFullYear()} Primer. All rights reserved.</p>
        </footer>
    );
};

export default Footer;