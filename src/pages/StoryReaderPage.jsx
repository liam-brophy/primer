import React from 'react';
import { useParams } from 'react-router-dom';
import stories from '../data/stories';
import './StoryReader.css';

const StoryReaderPage = () => {
    const { storyId } = useParams();
    const story = stories.find(story => story.id === storyId);

    if (!story) {
        return <div>Story not found</div>;
    }

    return (
        <div className="story-reader-container">
            <div className="story-header">
                <h1>{story.title}</h1>
                <p className="story-meta">By {story.author}</p>
            </div>
            <div className="story-content">
                <p className="coming-soon-message">Full story available on August 8th</p>
            </div>
        </div>
    );
};

export default StoryReaderPage;