import React from 'react';
import Contact from '../components/sections/Contact';
import type { Language } from '../types';

interface ContactPageProps {
  language: Language;
}

const ContactPage: React.FC<ContactPageProps> = ({ language }) => {
  return (
    <div className="pt-10 sm:pt-14">
      <Contact language={language} />
    </div>
  );
};

export default ContactPage;
