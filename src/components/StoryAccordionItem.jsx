import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const StoryAccordionItem = ({ story, isOpen, onToggle }) => {
  const { theme } = useTheme();

  const getFirstSentence = (content) => {
    const cleanContent = content.trim();
    const match = cleanContent.match(/^[^.!?]*[.!?]/);
    if (match) return match[0].trim() + '...';
    return cleanContent.substring(0, 100) + '...';
  };

  return (
    <div className={`accordion-item ${isOpen ? 'open' : ''}`}>
      <div className="accordion-header" onClick={onToggle}>
        <h2>{story.title}</h2>
        <span className="accordion-icon">{isOpen ? '−' : '+'}</span>
      </div>
      {isOpen && (
        <div className="accordion-content">
          <p className="story-meta">By {story.author}</p>
          <p className="story-excerpt">{getFirstSentence(story.content)}</p>
          <Link to={`/story/${story.id}`} className="read-more-link">Read Full Story</Link>
        </div>
      )}
    </div>
  );
};

export default StoryAccordionItem;
