import React from 'react';
import { createRoot } from 'react-dom/client'; 
import App from './App';
import './styles/global.css';
import { ThemeProvider } from './context/ThemeContext'; // Import ThemeProvider

// Get the root element
const container = document.getElementById('root');

// Create a root
const root = createRoot(container);

// Initial render using the root
root.render(
  <React.StrictMode>
    <ThemeProvider> {/* Wrap App with ThemeProvider */}
      <App />
    </ThemeProvider>
  </React.StrictMode>
);