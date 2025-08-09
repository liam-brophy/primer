import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { theme } = useTheme(); // Keep theme for logo, remove toggleTheme
    const location = useLocation(); // Hook to get current route

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Helper function to determine if a link is active
    const isActiveLink = (path) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
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
                    <li>
                        <Link 
                            to="/library" 
                            className={isActiveLink('/library') ? 'active' : ''}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Library
                        </Link>
                    </li>
                    <li>
                        <Link 
                            to="/gallery" 
                            className={isActiveLink('/gallery') ? 'active' : ''}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Gallery
                        </Link>
                    </li>
                    <li>
                        <Link 
                            to="/orders" 
                            className={isActiveLink('/orders') ? 'active' : ''}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Volume I
                        </Link>
                    </li>
                    <li>
                        <Link 
                            to="/about" 
                            className={isActiveLink('/about') ? 'active' : ''}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            About
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;