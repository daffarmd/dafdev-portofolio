import React from 'react';
import About from '../components/sections/About';
import Experience from '../components/sections/Experience';
import Projects from '../components/sections/Projects';
import Products from '../components/sections/Products';
import type { Language } from '../types';

interface AboutPageProps {
  language: Language;
}

const AboutPage: React.FC<AboutPageProps> = ({ language }) => {
  return (
    <div className="pt-10 sm:pt-14">
      <About language={language} />
      <Experience language={language} />
      <Projects language={language} />
      <Products language={language} />
    </div>
  );
};

export default AboutPage;
