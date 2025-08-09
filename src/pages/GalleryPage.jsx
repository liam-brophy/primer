import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { galleryArtworks } from '../data/galleryData';
import './GalleryPage.css';
import '../styles/global.css';

const GalleryPage = () => {
    const { theme } = useTheme();
    const [currentIndex, setCurrentIndex] = useState(0);
    
    const nextImage = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === galleryArtworks.length - 1 ? 0 : prevIndex + 1
        );
    };
    
    const prevImage = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? galleryArtworks.length - 1 : prevIndex - 1
        );
    };
    
    const goToImage = (index) => {
        setCurrentIndex(index);
    };
    
    // Auto-advance carousel (optional)
    useEffect(() => {
        const interval = setInterval(nextImage, 8000); // Change image every 8 seconds
        return () => clearInterval(interval);
    }, []);
    
    // Keyboard navigation
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'ArrowLeft') prevImage();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'Escape') {
                // Optional: could add escape functionality
            }
        };
        
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);
    
    const currentArtwork = galleryArtworks[currentIndex];
    
    return (
        <div className={`gallery-container ${theme}`}>
            <div className="carousel-container">
                {/* Main Image Display */}
                <div className="carousel-image-container">
                    <img 
                        src={currentArtwork.image} 
                        alt={`${currentArtwork.title} by ${currentArtwork.artist}`}
                        className="carousel-image"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                        }}
                    />
                    <div className="carousel-placeholder" style={{display: 'none'}}>
                        <span>Image Coming Soon</span>
                        <p>{currentArtwork.title}</p>
                    </div>
                </div>
                
                {/* Navigation Arrows */}
                <button 
                    className="carousel-nav carousel-prev" 
                    onClick={prevImage}
                    aria-label="Previous image"
                >
                    &#8249;
                </button>
                <button 
                    className="carousel-nav carousel-next" 
                    onClick={nextImage}
                    aria-label="Next image"
                >
                    &#8250;
                </button>
                
                {/* Caption */}
                <div className="carousel-caption">
                    <h2 className="caption-title">{currentArtwork.title}</h2>
                    <p className="caption-artist">{currentArtwork.artist}</p>
                    <p className="caption-details">
                        {currentArtwork.year} • {currentArtwork.medium} • {currentArtwork.dimensions}
                    </p>
                </div>
                
                {/* Dot Indicators */}
                <div className="carousel-indicators">
                    {galleryArtworks.map((_, index) => (
                        <button
                            key={index}
                            className={`indicator ${index === currentIndex ? 'active' : ''}`}
                            onClick={() => goToImage(index)}
                            aria-label={`Go to image ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GalleryPage;
