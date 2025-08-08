import React from 'react';
import { useParams } from 'react-router-dom';
import stories from '../data/stories';
import './StoryReader.css';
import { useTheme } from '../context/ThemeContext';

const StoryReaderPage = () => {
    const { theme } = useTheme();
    const { storyId } = useParams();
    // Convert storyId to number for comparison
    const story = stories.find(story => story.id === parseInt(storyId));

    if (!story) {
        return <div>Story not found</div>;
    }

    return (
        <div className={`story-reader-container ${theme}`}>
            <div className="story-header">
                <h1>{story.title}</h1>
                <p className="story-meta">By {story.author}</p>
            </div>
            <div className="story-content">
                <div className="story-text">
                    {story.content.split('\n').map((paragraph, index) => (
                        paragraph.trim() ? <p key={index}>{paragraph.trim()}</p> : <br key={index} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StoryReaderPage;