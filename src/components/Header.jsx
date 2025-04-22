import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { theme } = useTheme(); // Keep theme for logo, remove toggleTheme

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // In Vite, assets in the public folder are served at the root path
    const logoPath = theme === 'dark' 
        ? '/images/Primer_Logo_White.png'
        : '/images/Primer_Logo_Black.png';

    return (
        <header className="app-header"> 
            {/* Use Link for the logo to navigate home */}
            <Link to="/" className="logo-link">
                <img src={logoPath} alt="Application Logo" className="app-logo" />
            </Link>
            
            <button className={`menu-toggle ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu} aria-label="Toggle menu">
                <span></span>
                <span></span>
                <span></span>
            </button>
            <nav className={`main-nav ${isMenuOpen ? 'open' : ''}`}>
                <ul>
                    <li><Link to="/library" onClick={() => setIsMenuOpen(false)}>Library</Link></li>
                    <li><Link to="/about" onClick={() => setIsMenuOpen(false)}>About</Link></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;