import React from 'react';

/**
 * AnimatedText component for creating animated text effects
 * @param {Object} props - Component props
 * @param {string} props.text - The text to animate
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.speed - Animation speed ('default', 'slow', or 'fast')
 * @param {string} props.element - HTML element to render ('h1', 'h2', etc)
 * @param {number} props.baseDelay - Initial delay before animation starts (in seconds)
 * @param {number} props.wordDelay - Delay between words (in seconds)
 */
const AnimatedText = ({ 
  text, 
  className = '', 
  speed = 'default',
  element = 'h1',
  baseDelay = 0.3,
  wordDelay = 0.15
}) => {
  const words = text.split(' ');
  
  // Determine speed class
  let speedClass = '';
  if (speed === 'slow') speedClass = 'animate-text-slow';
  if (speed === 'fast') speedClass = 'animate-text-fast';
  
  const containerClass = `animate-text-container ${className} ${speedClass}`.trim();
  
  // Create the content with animated words
  const content = (
    <span className={containerClass}>
      {words.map((word, index) => (
        <span 
          key={index} 
          className="animate-text-word"
          style={{ 
            animationDelay: `${baseDelay + (index * wordDelay)}s`
          }}
        >
          {word}<span>&nbsp;</span>
        </span>
      ))}
    </span>
  );
  
  // Render with the appropriate HTML element
  switch(element) {
    case 'h1':
      return <h1>{content}</h1>;
    case 'h2':
      return <h2>{content}</h2>;
    case 'h3':
      return <h3>{content}</h3>;
    case 'h4':
      return <h4>{content}</h4>;
    case 'h5':
      return <h5>{content}</h5>;
    case 'h6':
      return <h6>{content}</h6>;
    case 'p':
      return <p>{content}</p>;
    case 'span':
      return <span>{content}</span>;
    default:
      return <div>{content}</div>;
  }
};

export default AnimatedText;