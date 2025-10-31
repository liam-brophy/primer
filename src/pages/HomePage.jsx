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
            <div className="grid-container">
                <div className="col-12">
                    <div className="paragraph center calloutcenter red-callout-box">
                        We're opening the curtain. <br />
                        For our next volume, we invite you to step into the light.
                        <br /><br />
                        Our next Primer will explore "entrance". 
                        We're seeking fiction and nonfiction submissions that explore the experience of an entrance: grand and small, rehearsed and improvised, surprised or expected. 
                        <br />
                        An entrance can prelude an introduction, foreshadow a drama, and mark new chapters.
                        <br /><br />
                        Some questions we want this volume to address:
                        <br /><br />
                        <em>After an entrance in a new place, at a new experience, or on a new stage, how do we decide our roles? 
                        <br />
                        How do we anticipate the spectacle of arrival, our real and imagined audiences, the unexpected guest star?
                        <br />
                        Can we outlive the ignominy of a bad first impression? <br />
                        Can we keep up the momentum of a good one? 
                        <br />
                        Do we consider the consequences of entering real and digital spaces before we walk through the door? 
                        <br />
                        Is an entrance harder than an exit?</em>
                        
                        <div className="submission-info-section">
                            Written submissions should be no longer than 8,000 words and are due by Dec. 1.
                            <br />
                            Submissions can be emailed to <a href="mailto:info@primer.press" className="email-link-white">info@primer.press</a>
                            <br />
                            Primer appears in select independent bookstores, and <a href="/orders" className="preorder-link-white">available for print order</a>.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;