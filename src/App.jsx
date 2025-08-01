import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LibraryPage from './pages/LibraryPage';
import StoryReaderPage from './pages/StoryReaderPage';
import AboutPage from './pages/AboutPage';
import PreordersPage from './pages/PreordersPage';
import OrderConfirmation from './pages/OrderConfirmation';
import AdminDashboard from './pages/AdminDashboard';
import ThemeToggleButton from './components/ThemeToggleButton';
import { useTheme } from './context/ThemeContext';

const AppContent = () => {
    const location = useLocation();
    const { theme } = useTheme();
    const isPreordersPage = location.pathname === '/preorders';
    const isOrderConfirmationPage = location.pathname === '/order-confirmation';
    const isAdminPage = location.pathname === '/admin';
    const isSpecialPage = isPreordersPage || isOrderConfirmationPage || isAdminPage;

    return (
        <div className={`app-wrapper ${theme}`}>
            <Header />
            {isSpecialPage ? (
                <Routes>
                    <Route path="/preorders" element={<PreordersPage />} />
                    <Route path="/order-confirmation" element={<OrderConfirmation />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                </Routes>
            ) : (
                <main className="main-content container">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/library" element={<LibraryPage />} />
                        <Route path="/story/:id" element={<StoryReaderPage />} />
                        <Route path="/about" element={<AboutPage />} />
                    </Routes>
                </main>
            )}
            <Footer />
            <ThemeToggleButton />
        </div>
    );
};

const App = () => {
    return (
        <Router>
            <AppContent />
        </Router>
    );
};

export default App;
