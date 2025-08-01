import React from 'react';
import { useTheme } from '../context/ThemeContext';
import './AboutPage.css';
import '../styles/global.css';

const AboutPage = () => {
    const { theme } = useTheme();
    
    return (
        <div className={`about-container ${theme}`}>
            <div className="about-content">
                <h2 className="about-header">Who We Are</h2>
                
                <div className="about-summary">
                    <p>
                        Primer is an independent literary journal showcasing emerging voices in fiction, poetry, and creative non-fiction.
                        Our inaugural volume brings together a diverse collection of works that explore the human experience through fresh perspectives and innovative storytelling.
                    </p>
                </div>
                
                <div className="about-credits">
                    <div className="credit-section">
                        <h3>Edited by</h3><p>Daniel Maloney</p>
                    </div>
                    
                    <div className="credit-section">
                        <h3>Edited by</h3><p>Maggie Lane</p>
                    </div>
                    
                    <div className="credit-section">
                        <h3>Curation by</h3><p>Chase Dougherty</p>
                    </div>
                    
                    <div className="credit-section">
                        <h3>Design by</h3><p>Liam Brophy</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;