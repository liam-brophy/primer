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
                    <div className="grid-container">
                        <div className="col-6 col-sm-12">
                            <div className="paragraph">
                                A Primer will never try to intimidate you or do small talk. It's opinionated without being pushy, principled without being self-righteous, intellectual without being academic, artful without being snobby. After encountering a Primer, you leave with new perspectives to weigh, new names to remember, new ideas to latch onto, new questions.
                            </div>
                        </div>
                        <div className="col-6 col-sm-12">
                            <div className="paragraph">
                                Just like the Primers of the past, which introduced students to the discoveries of reading and learning, our Primer aims to reshape perspectives with the same easy, playful embrace.
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="col-12">
                    <div className="paragraph center calloutcenter">
                        In this volume, we're offering a primer exploring our understandings of space:
                        the areas we traverse, the rooms we occupy, the sites where we live, and love, and define ourselves.
                        ‍<br /><br />
                        <em>What are the spaces that transform us?<br />
                        How do we define them?<br />
                        Do we adapt to spaces or do they adapt to us?</em>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;