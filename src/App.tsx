import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useParams } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import SeoManager from './components/seo/SeoManager';
import Home from './pages/Home';
import NotFoundPage from './pages/NotFoundPage';
import type { Language } from './types';

const AboutPage = lazy(() => import('./pages/AboutPage'));
const ShowcasePage = lazy(() => import('./pages/ShowcasePage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const Articles = lazy(() => import('./pages/Articles/Articles'));
const ArticleDetail = lazy(() => import('./pages/Articles/ArticleDetail'));
const QueueAppDemo = lazy(() => import('./pages/Showcase/QueueAppDemo'));
const HospitalAppDemo = lazy(() => import('./pages/Showcase/HospitalAppDemo'));

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
};

const LegacyArticleRedirect: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  if (!slug) {
    return <Navigate to="/my-notes" replace />;
  }

  return <Navigate to={`/my-notes/${slug}`} replace />;
};

const RouteFallback: React.FC = () => (
  <div className="min-h-[20vh] px-6 py-10">
    <div className="mx-auto max-w-[1120px]">
      <div className="h-16 rounded-2xl border border-slate-200/80 bg-white/70 dark:border-slate-700 dark:bg-dark-800/70" />
    </div>
  </div>
);

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
      <SeoManager />
      <div className="flex min-h-screen flex-col overflow-x-hidden text-slate-900 transition-colors duration-300 dark:text-white">
        <Header
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
        <main className="flex-grow">
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Home language={language} />} />
              <Route path="/about" element={<AboutPage language={language} />} />
              <Route path="/showcase" element={<ShowcasePage language={language} />} />
              <Route path="/showcase/queue-app" element={<Navigate to="/showcase/queue-display" replace />} />
              <Route path="/showcase/queue-display" element={<QueueAppDemo />} />
              <Route path="/showcase/hospital-app" element={<HospitalAppDemo />} />
              <Route path="/contact" element={<ContactPage language={language} />} />
              <Route path="/my-notes" element={<Articles />} />
              <Route path="/my-notes/:slug" element={<ArticleDetail />} />
              <Route path="/articles" element={<Navigate to="/my-notes" replace />} />
              <Route path="/articles/:slug" element={<LegacyArticleRedirect />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer language={language} />
      </div>
    </Router>
  );
}

export default App;
