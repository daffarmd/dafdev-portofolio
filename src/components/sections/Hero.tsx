import React from 'react';
import { Link } from 'react-scroll';
import { ChevronDown, Terminal, Database, Github, Linkedin } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  return (
    <section id="hero" className="relative h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-900">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 to-secondary-500/10 dark:from-primary-800/20 dark:to-secondary-900/20"></div>
        {/* Code pattern background */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-xs font-mono"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            >
              {Math.random() > 0.5 ? 'func()' : 'type{}'}
            </div>
          ))}
        </div>
      </div>
      
      <div className="container mx-auto px-4 z-10">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary-600 rounded-full blur-xl opacity-20 animate-pulse"></div>
              <div className="relative bg-white dark:bg-dark-800 p-4 rounded-full shadow-lg">
                <Terminal className="h-10 w-10 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-dark-900 dark:text-white">
            Muhammad Daffa Ramadhan
          </h1>
          
          <h2 className="text-2xl md:text-3xl text-primary-600 dark:text-primary-400 font-semibold mb-6">
            Backend Developer
          </h2>
          
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            Crafting robust <span className="text-primary-600 dark:text-primary-400 font-semibold">Golang</span> applications and <span className="text-secondary-500 dark:text-secondary-400 font-semibold">PostgreSQL</span> databases with 2 years of professional experience.
          </p>

          <div className="flex justify-center space-x-6 mb-12">
            <motion.a 
              href="#"
              className="flex items-center bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-full font-medium transition-colors shadow-md hover:shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Github className="h-5 w-5 mr-2" />
              GitHub
            </motion.a>
            <motion.a 
              href="https://www.linkedin.com/in/muhammaddaffaramadhan/"
              className="flex items-center bg-white dark:bg-dark-700 text-primary-600 dark:text-primary-400 border border-primary-600 dark:border-primary-400 hover:bg-gray-50 dark:hover:bg-dark-600 px-6 py-3 rounded-full font-medium transition-colors shadow-md hover:shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Linkedin className="h-5 w-5 mr-2" />
              LinkedIn
            </motion.a>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center bg-white dark:bg-dark-700 px-4 py-2 rounded-full shadow">
              <Terminal className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2" />
              <span className="text-dark-800 dark:text-white">Golang</span>
            </div>
            <div className="flex items-center bg-white dark:bg-dark-700 px-4 py-2 rounded-full shadow">
              <Database className="h-5 w-5 text-secondary-500 dark:text-secondary-400 mr-2" />
              <span className="text-dark-800 dark:text-white">PostgreSQL</span>
            </div>
          </div>
        </motion.div>
      </div>
      
      <div className="absolute bottom-10 w-full flex justify-center animate-bounce">
        <Link
          to="about"
          spy={true}
          smooth={true}
          offset={-70}
          duration={500}
          className="cursor-pointer text-gray-600 dark:text-gray-400"
        >
          <ChevronDown className="h-8 w-8" />
        </Link>
      </div>
    </section>
  );
};

export default Hero;