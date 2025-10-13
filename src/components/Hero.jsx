import React from 'react';
import { useTheme } from '../context/ThemeContext';
import AnimatedText from './AnimatedText';
import './Hero.css';

const Hero = () => {
  const { theme } = useTheme();
  
  // The tagline text
  const taglineText = "A magazine that hands you a drink, introduces you to new people, and engages you in bold conversations and fascinating stories.";
  
  return (
    <section className={`hero-section ${theme}`}>
      <div className="hero-content">
        <div className="hero-image-container">
          <img 
            src="/images/Primer_Transparent.png" 
            alt="Primer Magazine" 
            className="hero-logo"
          />
        </div>
        <div className="hero-text-container">
          <AnimatedText 
            text={taglineText}
            element="h1" 
            className={`hero-tagline ${theme}`}
            speed="default"
            baseDelay={0.3}
            wordDelay={0.15}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;