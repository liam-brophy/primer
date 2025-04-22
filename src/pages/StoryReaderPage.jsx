import React from 'react';
import { useParams } from 'react-router-dom';
import stories from '../data/stories';

const StoryReaderPage = () => {
    const { storyId } = useParams();
    const story = stories.find(story => story.id === storyId);

    if (!story) {
        return <div>Story not found</div>;
    }

    return (
        <div>
            <h1>{story.title}</h1>
            <p>{story.content}</p>
        </div>
    );
};

export default StoryReaderPage;