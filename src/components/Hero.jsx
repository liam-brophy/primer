import React from 'react';
import { useTheme } from '../context/ThemeContext';
import AnimatedText from './AnimatedText';

const Hero = () => {
  const { theme } = useTheme();
  
  // The tagline text
  const taglineText = "A magazine that hands you a drink, introduces you to new people, and engages you in bold conversations and fascinating stories.";
  
  return (
    <section className={`hero-section ${theme}`}>
      <div className="hero-content">
        <AnimatedText 
          text={taglineText}
          element="h1" 
          className={`hero-tagline ${theme}`}
          speed="default"
          baseDelay={0.3}
          wordDelay={0.15}
        />
      </div>
    </section>
  );
};

export default Hero;