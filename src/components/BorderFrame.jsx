import React from 'react';
import { useTheme } from '../context/ThemeContext';

const BorderFrame = ({ children }) => {
    const { theme } = useTheme();
    
    return (
        <div className="border-frame">
            {children}
        </div>
    );
};

export default BorderFrame;