import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import type { Language } from '../../types';

interface ContactProps {
  language: Language;
}

const Contact: React.FC<ContactProps> = ({ language }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const t = language === 'id'
    ? {
        kicker: 'Kontak',
        title: 'Mari Terhubung',
        subtitle: 'Punya ide proyek atau ingin diskusi peluang kerja sama? Silakan hubungi saya.',
        infoTitle: 'Informasi Kontak',
        phone: 'Telepon',
        location: 'Lokasi',
        connect: 'Terhubung dengan saya',
        connectDesc: 'Saya terbuka untuk diskusi proyek baru, peluang kerja, atau kolaborasi.',
        connectDesc2: 'Tersedia untuk freelance maupun posisi full-time.',
        name: 'Nama',
        email: 'Email',
        subject: 'Subjek',
        message: 'Pesan',
        namePlaceholder: 'Nama kamu',
        emailPlaceholder: 'Email kamu',
        subjectPlaceholder: 'Subjek pesan',
        messagePlaceholder: 'Tulis pesan kamu',
        sending: 'Mengirim...',
        sent: 'Pesan berhasil dikirim!',
        send: 'Kirim Pesan',
      }
    : {
        kicker: 'Contact',
        title: 'Get In Touch',
        subtitle: 'Have a project idea or want to discuss opportunities? Feel free to reach out.',
        infoTitle: 'Contact Information',
        phone: 'Phone',
        location: 'Location',
        connect: 'Connect with me',
        connectDesc: 'I\'m open to discussing new projects, opportunities, or partnerships.',
        connectDesc2: 'Available for freelance and full-time positions.',
        name: 'Name',
        email: 'Email',
        subject: 'Subject',
        message: 'Message',
        namePlaceholder: 'Your name',
        emailPlaceholder: 'Your email',
        subjectPlaceholder: 'Subject of your message',
        messagePlaceholder: 'Your message',
        sending: 'Sending...',
        sent: 'Message sent successfully!',
        send: 'Send Message',
      };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    }, 1500);
  };

  return (
    <section id="contact" className="section-shell pb-24">
      <div className="section-container">
        <div className="mb-12 max-w-3xl sm:mb-16">
          <motion.span
            className="section-kicker"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            {t.kicker}
          </motion.span>
          <motion.h2
            className="section-title mt-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            {t.title}
          </motion.h2>
          <motion.p
            className="section-subtitle"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            {t.subtitle}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="glass-card p-5 sm:p-8"
          >
            <h3 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">
              {t.infoTitle}
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 rounded-xl border border-slate-200 bg-slate-100 p-3 dark:border-slate-700 dark:bg-dark-700">
                  <Mail className="h-6 w-6 text-slate-700 dark:text-slate-300" />
                </div>
                <div className="ml-4 min-w-0">
                  <h4 className="mb-1 text-lg font-semibold text-slate-900 dark:text-white">Email</h4>
                  <a href="mailto:muhammaddaffarmd@gmail.com" className="break-all text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                    muhammaddaffarmd@gmail.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 rounded-xl border border-slate-200 bg-slate-100 p-3 dark:border-slate-700 dark:bg-dark-700">
                  <Phone className="h-6 w-6 text-slate-700 dark:text-slate-300" />
                </div>
                <div className="ml-4">
                  <h4 className="mb-1 text-lg font-semibold text-slate-900 dark:text-white">{t.phone}</h4>
                  <a href="tel:+6281234567890" className="text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                    -
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 rounded-xl border border-slate-200 bg-slate-100 p-3 dark:border-slate-700 dark:bg-dark-700">
                  <MapPin className="h-6 w-6 text-slate-700 dark:text-slate-300" />
                </div>
                <div className="ml-4">
                  <h4 className="mb-1 text-lg font-semibold text-slate-900 dark:text-white">{t.location}</h4>
                  <p className="text-slate-600 dark:text-slate-300">
                    Indonesia, Malang
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-10 rounded-2xl border border-slate-200/80 bg-white/90 p-5 dark:border-slate-700 dark:bg-dark-700/70">
              <h4 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">{t.connect}</h4>
              <p className="mb-3 text-sm text-slate-600 dark:text-slate-300">
                {t.connectDesc}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {t.connectDesc2}
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="glass-card space-y-5 p-5 sm:p-7 md:p-8">
              <div>
                <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">
                  {t.name}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 transition-colors focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400/20 dark:border-slate-600 dark:bg-dark-700 dark:text-white dark:focus:border-slate-300 dark:focus:ring-slate-200/20"
                  placeholder={t.namePlaceholder}
                />
              </div>
              
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">
                  {t.email}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 transition-colors focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400/20 dark:border-slate-600 dark:bg-dark-700 dark:text-white dark:focus:border-slate-300 dark:focus:ring-slate-200/20"
                  placeholder={t.emailPlaceholder}
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">
                  {t.subject}
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 transition-colors focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400/20 dark:border-slate-600 dark:bg-dark-700 dark:text-white dark:focus:border-slate-300 dark:focus:ring-slate-200/20"
                  placeholder={t.subjectPlaceholder}
                />
              </div>
              
              <div>
                <label htmlFor="message" className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">
                  {t.message}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 transition-colors focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400/20 dark:border-slate-600 dark:bg-dark-700 dark:text-white dark:focus:border-slate-300 dark:focus:ring-slate-200/20"
                  placeholder={t.messagePlaceholder}
                ></textarea>
              </div>
              
              <motion.button
                type="submit"
                className={`flex w-full items-center justify-center rounded-xl px-6 py-3 font-medium text-white transition-colors ${
                  isSubmitting || submitSuccess ? 'cursor-not-allowed bg-slate-600' : 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white'
                }`}
                disabled={isSubmitting || submitSuccess}
                whileHover={{ scale: isSubmitting || submitSuccess ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting || submitSuccess ? 1 : 0.98 }}
              >
                {isSubmitting ? (
                  <>{t.sending}</>
                ) : submitSuccess ? (
                  <>{t.sent}</>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    {t.send}
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
