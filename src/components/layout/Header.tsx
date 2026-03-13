import React, { useEffect, useState } from 'react';
import { Link as RouterLink, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun, BookOpen, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import meImage from '../../assets/me.png';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ darkMode, toggleDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', to: '/' },
    { name: 'About', to: '/about' },
    { name: 'Showcase', to: '/showcase' },
    { name: 'My Notes', to: '/my-notes' },
    { name: 'Contact', to: '/contact' },
  ];

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center text-sm font-semibold tracking-wide transition-colors ${
      isActive
        ? 'text-slate-900 dark:text-white'
        : 'text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
    }`;

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${isScrolled ? 'py-2 sm:py-3' : 'py-3 sm:py-5'}`}>
      <div
        className={`mx-auto flex w-full max-w-[1080px] items-center justify-between px-4 sm:px-6 md:px-8 ${
          isScrolled ? 'glass-card rounded-[1.4rem] py-2.5 sm:rounded-2xl sm:py-3' : 'py-1.5 sm:py-2'
        }`}
      >
        <RouterLink to="/" className="flex items-center">
          <motion.div
            className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-dark-800 sm:rounded-2xl"
            animate={{ y: [0, -2, 0], rotate: [-1, 1, -1] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ scale: 1.04, rotate: 0 }}
          >
            <motion.img
              src={meImage}
              alt="Daf Dev logo"
              className="h-10 w-10 object-cover sm:h-11 sm:w-11"
              whileHover={{ scale: 1.06 }}
            />
          </motion.div>
          <span className="ml-2.5 text-base font-bold tracking-tight text-slate-900 sm:ml-3 sm:text-xl dark:text-white">
            Daf.Dev
          </span>
        </RouterLink>

        <nav className="hidden items-center gap-5 xl:gap-7 lg:flex">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={navClass}>
              {link.to === '/my-notes' && <BookOpen className="mr-1 h-4 w-4" />}
              {link.name}
              {link.soon && (
                <span className="ml-2 rounded-full border border-slate-300 bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600 dark:border-slate-600 dark:bg-dark-700 dark:text-slate-300">
                  Soon
                </span>
              )}
            </NavLink>
          ))}
          <button
            onClick={toggleDarkMode}
            className="rounded-full border border-slate-200 bg-white p-2.5 text-slate-700 transition-colors hover:border-slate-400 hover:text-slate-900 dark:border-slate-600 dark:bg-dark-700 dark:text-slate-100 dark:hover:border-slate-400 dark:hover:text-white"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <RouterLink to="/contact" className="btn-primary text-xs">
            Let's Talk
            <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
          </RouterLink>
        </nav>

        <div className="flex items-center lg:hidden">
          <button
            onClick={toggleDarkMode}
            className="mr-2 rounded-full border border-slate-200 bg-white p-2.5 text-slate-700 transition-colors hover:border-slate-400 hover:text-slate-900 dark:border-slate-600 dark:bg-dark-700 dark:text-slate-100 dark:hover:border-slate-400"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="rounded-full border border-slate-200 bg-white p-2.5 text-slate-700 transition-colors hover:border-slate-400 hover:text-slate-900 dark:border-slate-600 dark:bg-dark-700 dark:text-slate-100 dark:hover:border-slate-400"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="absolute left-4 right-4 top-[calc(100%+0.5rem)] animate-fade-in rounded-[1.4rem] border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-dark-800 lg:hidden sm:left-6 sm:right-6 sm:rounded-2xl sm:p-4 md:left-8 md:right-8">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex min-h-[44px] items-center rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-slate-100 text-slate-900 dark:bg-dark-700 dark:text-white'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-dark-700 dark:hover:text-white'
                    }`
                  }
                >
                  {link.to === '/my-notes' && <BookOpen className="mr-1 h-4 w-4" />}
                  {link.name}
                  {link.soon && (
                    <span className="ml-2 rounded-full border border-slate-300 bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600 dark:border-slate-600 dark:bg-dark-700 dark:text-slate-300">
                      Soon
                    </span>
                  )}
                </NavLink>
              ))}
              <RouterLink to="/contact" className="btn-primary mt-2 w-full justify-center text-center text-xs">
                Let's Talk
                <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
              </RouterLink>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
