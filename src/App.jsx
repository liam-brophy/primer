import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LibraryPage from './pages/LibraryPage';
import StoryReaderPage from './pages/StoryReaderPage';
import AboutPage from './pages/AboutPage';
import ThemeToggleButton from './components/ThemeToggleButton';

const App = () => {
    return (
        <Router>
            <>
                <Header />
                <main className="main-content container">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/library" element={<LibraryPage />} />
                        <Route path="/story/:id" element={<StoryReaderPage />} />
                        <Route path="/about" element={<AboutPage />} />
                    </Routes>
                </main>
                <Footer />
                <ThemeToggleButton />
            </>
        </Router>
    );
};

export default App;