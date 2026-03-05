import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import stories from '../data/stories';
import '../styles/global.css';
import { useTheme } from '../context/ThemeContext';
import AnimatedText from '../components/AnimatedText';
import VolumeSelector from '../components/VolumeSelector';
import StoryAccordionItem from '../components/StoryAccordionItem';

// Helper function to extract the first sentence from story content
const getFirstSentence = (content) => {
    // Remove any leading/trailing whitespace and line breaks
    const cleanContent = content.trim();
    // Find the first sentence by looking for the first period, exclamation mark, or question mark
    const match = cleanContent.match(/^[^.!?]*[.!?]/);
    if (match) {
        return match[0].trim() + '...';
    }
    // If no sentence ending is found, take the first 100 characters
    return cleanContent.substring(0, 100) + '...';
};

/* Story accordion rendering is provided by the reusable component `StoryAccordionItem` in `src/components/StoryAccordionItem.jsx` */

const LibraryPage = () => {
    // Separate stories by volume (1-8 are Volume I, 9+ are Volume II)
    const volumeIStories = stories.filter(story => story.id <= 8);
    const volumeIIStories = stories.filter(story => story.id > 8);
    
    return (
        <div className="library-container">
            <div className="library-title-container">
                <VolumeSelector
                    volumes={[
                        { id: 'I', label: 'Volume I', stories: volumeIStories },
                        { id: 'II', label: 'Volume II', stories: volumeIIStories }
                    ]}
                />
            </div>
        </div>
    );
};

export default LibraryPage;