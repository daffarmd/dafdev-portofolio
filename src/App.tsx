import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useNavigate, useParams } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import SeoManager from './components/seo/SeoManager';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import NotFoundPage from './pages/NotFoundPage';
import type { Language } from './types';

const AboutPage = lazy(() => import('./pages/AboutPage'));
const ShowcasePage = lazy(() => import('./pages/ShowcasePage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const Articles = lazy(() => import('./pages/Articles/Articles'));
const ArticleDetail = lazy(() => import('./pages/Articles/ArticleDetail'));
const ArticleStudio = lazy(() => import('./pages/Admin/ArticleStudio'));
const LoginPage = lazy(() => import('./pages/Auth/LoginPage'));
const ResetPasswordPage = lazy(() => import('./pages/Auth/ResetPasswordPage'));
const QueueAppDemo = lazy(() => import('./pages/Showcase/QueueAppDemo'));
const HospitalAppDemo = lazy(() => import('./pages/Showcase/HospitalAppDemo'));

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
};

const AuthHashRedirect: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash.startsWith('#')
      ? window.location.hash.slice(1)
      : window.location.hash;

    if (!hash) {
      return;
    }

    const params = new URLSearchParams(hash);
    if (params.get('type') !== 'recovery' || location.pathname === '/reset-password') {
      return;
    }

    navigate({
      pathname: '/reset-password',
      hash: window.location.hash,
    }, { replace: true });
  }, [location.pathname, navigate]);

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

type AppChromeProps = {
  darkMode: boolean;
  toggleDarkMode: () => void;
  language: Language;
};

const AppChrome: React.FC<AppChromeProps> = ({ darkMode, toggleDarkMode, language }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden text-slate-900 transition-colors duration-300 dark:text-white">
      {!isAdminRoute ? (
        <Header
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
      ) : null}
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
            <Route path="/login" element={<LoginPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/my-notes" element={<Articles />} />
            <Route path="/my-notes/:slug" element={<ArticleDetail />} />
            <Route
              path="/admin/articles"
              element={(
                <ProtectedRoute>
                  <ArticleStudio />
                </ProtectedRoute>
              )}
            />
            <Route path="/articles" element={<Navigate to="/my-notes" replace />} />
            <Route path="/articles/:slug" element={<LegacyArticleRedirect />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      {!isAdminRoute ? <Footer language={language} /> : null}
    </div>
  );
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
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <AuthHashRedirect />
        <SeoManager />
        <AppChrome
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          language={language}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
