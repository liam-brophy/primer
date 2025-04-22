import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import stories from '../data/stories';
import '../styles/global.css';
import { useTheme } from '../context/ThemeContext';
import AnimatedText from '../components/AnimatedText';

// Accordion Item Component
const AccordionItem = ({ story, isOpen, toggleAccordion }) => {
    const { theme } = useTheme();
    
    return (
        <div className={`accordion-item ${isOpen ? 'open' : ''}`}>
            <div 
                className="accordion-header" 
                onClick={toggleAccordion}
            >
                <h2>{story.title}</h2>
                <span className="accordion-icon">{isOpen ? '−' : '+'}</span>
            </div>
            {isOpen && (
                <div className="accordion-content">
                    <p className="story-meta">By {story.author} • {story.date}</p>
                    <p className="story-excerpt">{story.content.substring(0, 150)}...</p>
                    <Link to={`/story/${story.id}`} className="read-more-link">
                        Read Full Story
                    </Link>
                </div>
            )}
        </div>
    );
};

const LibraryPage = () => {
    // State to track which accordion item is open
    const [openItemId, setOpenItemId] = useState(null);

    // Function to toggle accordion items
    const toggleAccordion = (id) => {
        setOpenItemId(openItemId === id ? null : id);
    };

    return (
        <div className="library-container">
            <div className="library-title-container">
                <AnimatedText 
                    text="Volume 1" 
                    element="h1" 
                    className="library-title"
                    speed="default"
                    baseDelay={0.3}
                    wordDelay={0.15}
                />
            </div>
            
            <div className="accordion-container">
                {stories.map((story) => (
                    <AccordionItem 
                        key={story.id} 
                        story={story}
                        isOpen={openItemId === story.id}
                        toggleAccordion={() => toggleAccordion(story.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default LibraryPage;