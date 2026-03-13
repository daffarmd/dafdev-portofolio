import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import ShowcasePage from './pages/ShowcasePage';
import ContactPage from './pages/ContactPage';
import Articles from './pages/Articles/Articles';
import ArticleDetail from './pages/Articles/ArticleDetail';
import QueueAppDemo from './pages/Showcase/QueueAppDemo';
import HospitalAppDemo from './pages/Showcase/HospitalAppDemo';
import type { Language } from './types';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
};

function App() {
  const [darkMode, setDarkMode] = useState<boolean>(
    localStorage.getItem('darkMode') === 'true' ||
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  const language: Language = 'en';
  
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Router>
      <ScrollToTop />
      <div className="flex min-h-screen flex-col overflow-x-hidden text-slate-900 transition-colors duration-300 dark:text-white">
        <Header
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home language={language} />} />
            <Route path="/about" element={<AboutPage language={language} />} />
            <Route path="/showcase" element={<ShowcasePage language={language} />} />
            <Route path="/showcase/queue-app" element={<QueueAppDemo />} />
            <Route path="/showcase/queue-display" element={<QueueAppDemo />} />
            <Route path="/showcase/hospital-app" element={<HospitalAppDemo />} />
            <Route path="/contact" element={<ContactPage language={language} />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/articles/:slug" element={<ArticleDetail />} />
          </Routes>
        </main>
        <Footer language={language} />
      </div>
    </Router>
  );
}

export default App;
