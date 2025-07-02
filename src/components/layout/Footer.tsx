import React from 'react';
import { Github, Linkedin, Twitter, Mail, Code } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-dark-900 py-8 border-t border-gray-200 dark:border-dark-700">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-6 md:mb-0">
            <Code className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            <span className="ml-2 text-xl font-bold text-dark-800 dark:text-white">
              Daf.<span className="text-primary-600 dark:text-primary-400">Dev</span>
            </span>
          </div>
          
          <div className="flex space-x-6 mb-6 md:mb-0">
            <a
              href="#"
              className="text-dark-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/muhammaddaffaramadhan/"
              className="text-dark-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-dark-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="mailto:john.doe@example.com"
              className="text-dark-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-dark-700">
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
            © {currentYear} Daf Dev. All rights reserved.
          </p>
          <p className="text-center text-gray-500 dark:text-gray-500 text-xs mt-2">
            Built with Love, Time, and Effort
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;