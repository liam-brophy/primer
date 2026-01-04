import React, { useState, useRef, useEffect } from 'react';
import AnimatedText from './AnimatedText';
import StoryAccordionItem from './StoryAccordionItem';

/**
 * VolumeSelector
 * - volumes: [{id, label, stories: []}]
 * Renders a list of volumes; each volume header can be expanded to reveal its stories.
 */
const VolumeSelector = ({ volumes = [], className = '' }) => {
  const [openVolumeId, setOpenVolumeId] = useState(null);
  const [openItemKey, setOpenItemKey] = useState(null); // format `${volumeId}-${storyId}`
  const ref = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpenVolumeId(null);
        setOpenItemKey(null);
      }
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  const toggleVolume = (id) => {
    setOpenItemKey(null);
    setOpenVolumeId(openVolumeId === id ? null : id);
  };

  const toggleStory = (volumeId, storyId) => {
    const key = `${volumeId}-${storyId}`;
    setOpenItemKey(openItemKey === key ? null : key);
  };

  return (
    <div className={`volume-selector volume-list ${className}`} ref={ref}>
      {volumes.map((v) => (
        <div key={v.id} className={`volume-block volume-${v.id} ${openVolumeId === v.id ? 'open' : ''}`}>
          <div className="volume-header">
            <button
              className="volume-toggle"
              onClick={() => toggleVolume(v.id)}
              aria-expanded={openVolumeId === v.id}
            >
              <AnimatedText
                text={v.label}
                element="span"
                className="library-title"
                speed="default"
                baseDelay={0.08}
                wordDelay={0.06}
              />
              <span className="volume-caret" aria-hidden>{openVolumeId === v.id ? '▴' : '▾'}</span>
            </button>
          </div>

          {openVolumeId === v.id && (
            <div className="volume-stories">
              {v.stories && v.stories.length > 0 ? (
                v.stories.map((story) => (
                  <StoryAccordionItem
                    key={`${v.id}-${story.id}`}
                    story={story}
                    isOpen={openItemKey === `${v.id}-${story.id}`}
                    onToggle={() => toggleStory(v.id, story.id)}
                  />
                ))
              ) : (
                <div className="volume-empty-note">Volume {v.id} arriving February 2026</div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default VolumeSelector;
