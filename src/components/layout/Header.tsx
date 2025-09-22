import React, { useState, useEffect } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { Link as RouterLink } from 'react-router-dom';
import { Menu, X, Moon, Sun, Code, BookOpen } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ darkMode, toggleDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', to: 'hero', type: 'scroll' },
    { name: 'About', to: 'about', type: 'scroll' },
    { name: 'Skills', to: 'skills', type: 'scroll' },
    { name: 'Experience', to: 'experience', type: 'scroll' },
    { name: 'Projects', to: 'projects', type: 'scroll' },
    { name: 'Articles', to: '/articles', type: 'route' },
    { name: 'Contact', to: 'contact', type: 'scroll' },
  ];

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white dark:bg-dark-800 shadow-md py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <RouterLink
            to="/"
            className="flex items-center"
          >
            <Code className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            <span className="ml-2 text-2xl font-bold text-dark-800 dark:text-white">
              Daf.<span className="text-primary-600 dark:text-primary-400">Dev</span>
            </span>
          </RouterLink>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            link.type === 'scroll' ? (
              <ScrollLink
                key={link.name}
                to={link.to}
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}
                className="text-dark-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium cursor-pointer transition-colors"
              >
                {link.name}
              </ScrollLink>
            ) : (
              <RouterLink
                key={link.name}
                to={link.to}
                className="text-dark-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium cursor-pointer transition-colors flex items-center"
              >
                {link.name === 'Articles' && <BookOpen className="h-4 w-4 mr-1" />}
                {link.name}
              </RouterLink>
            )
          ))}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="h-5 w-5 text-yellow-400" />
            ) : (
              <Moon className="h-5 w-5 text-dark-700" />
            )}
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center">
          <button
            onClick={toggleDarkMode}
            className="p-2 mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="h-5 w-5 text-yellow-400" />
            ) : (
              <Moon className="h-5 w-5 text-dark-700" />
            )}
          </button>
          <button
            onClick={toggleMenu}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-dark-800 dark:text-white" />
            ) : (
              <Menu className="h-6 w-6 text-dark-800 dark:text-white" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white dark:bg-dark-800 shadow-md py-4 md:hidden animate-fade-in">
            <div className="container mx-auto px-4 flex flex-col space-y-4">
              {navLinks.map((link) => (
                link.type === 'scroll' ? (
                  <ScrollLink
                    key={link.name}
                    to={link.to}
                    spy={true}
                    smooth={true}
                    offset={-70}
                    duration={500}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-dark-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium cursor-pointer transition-colors py-2"
                  >
                    {link.name}
                  </ScrollLink>
                ) : (
                  <RouterLink
                    key={link.name}
                    to={link.to}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-dark-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium cursor-pointer transition-colors py-2 flex items-center"
                  >
                    {link.name === 'Articles' && <BookOpen className="h-4 w-4 mr-1" />}
                    {link.name}
                  </RouterLink>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;