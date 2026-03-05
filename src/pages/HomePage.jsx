import React from 'react';
import '../styles/global.css'; // Make sure styles are imported
import './HomePage.css'; // Import HomePage specific styles
import Hero from '../components/Hero';
import { useTheme } from '../context/ThemeContext';

const HomePage = () => {
    const { theme } = useTheme();
    
    return (
        <div className={`home-container ${theme}`}>
            <Hero />
            
            {/* Moving Banner */}
            {/* <div className="moving-banner">
                <div className="banner-content">
                    <span>Volume II - February 2026</span>
                    <span>Volume II - February 2026</span>
                    <span>Volume II - February 2026</span>
                    <span>Volume II - February 2026</span>
                    <span>Volume II - February 2026</span>
                    <span>Volume II - February 2026</span>
                </div>
            </div> */}
        </div>
    );
};

export default HomePage;