import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { Mail, MapPin, Send } from 'lucide-react';
import type { Language } from '../../types';

interface ContactProps {
  language: Language;
}

const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY?.trim();
const WEB3FORMS_HCAPTCHA_SITE_KEY = '50b2fe65-b00b-4b9e-ad62-3ba471098be2';
const CONTACT_SUBMISSION_LIMIT = 2;
const CONTACT_SUBMISSION_STORAGE_KEY = 'contactSubmissionCount';

const Contact: React.FC<ContactProps> = ({ language }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submissionCount, setSubmissionCount] = useState(0);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaKey, setCaptchaKey] = useState(0);

  const t = language === 'id'
      ? {
        kicker: 'Kontak',
        title: 'Mari Terhubung',
        subtitle: 'Punya ide proyek atau ingin diskusi peluang kerja sama? Silakan hubungi saya.',
        infoTitle: 'Informasi Kontak',
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
        sent: 'Pesan berhasil dikirim.',
        sendFailed: 'Pesan belum berhasil dikirim. Coba lagi sebentar lagi atau hubungi saya lewat email.',
        missingConfig: 'Form sedang tidak tersedia. Silakan hubungi saya langsung lewat email.',
        submissionLimitReached: 'Batas kirim pesan untuk browser ini sudah tercapai. Silakan coba lagi nanti atau hubungi saya lewat email.',
        submissionLimitShort: 'Batas tercapai',
        captchaRequired: 'Silakan selesaikan captcha terlebih dahulu.',
        send: 'Kirim Pesan',
      }
      : {
        kicker: 'Contact',
        title: 'Get In Touch',
        subtitle: 'Have a project idea or want to discuss opportunities? Feel free to reach out.',
        infoTitle: 'Contact Information',
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
        sent: 'Message sent successfully.',
        sendFailed: 'Your message could not be sent yet. Please try again shortly or contact me by email.',
        missingConfig: 'The form is temporarily unavailable. Please contact me directly by email.',
        submissionLimitReached: 'The message limit for this browser has been reached. Please try again later or contact me by email.',
        submissionLimitShort: 'Limit reached',
        captchaRequired: 'Please complete the captcha first.',
        send: 'Send Message',
      };

  useEffect(() => {
    const savedCount = window.localStorage.getItem(CONTACT_SUBMISSION_STORAGE_KEY);
    const parsedCount = Number.parseInt(savedCount ?? '0', 10);

    if (Number.isNaN(parsedCount) || parsedCount < 0) {
      return;
    }

    setSubmissionCount(parsedCount);
  }, []);

  const hasReachedSubmissionLimit = submissionCount >= CONTACT_SUBMISSION_LIMIT;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetCaptcha = () => {
    setCaptchaToken(null);
    setCaptchaKey((currentKey) => currentKey + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (hasReachedSubmissionLimit) {
      setSubmitError(t.submissionLimitReached);
      return;
    }

    if (!WEB3FORMS_ACCESS_KEY) {
      setSubmitError(t.missingConfig);
      return;
    }

    if (!captchaToken) {
      setSubmitError(t.captchaRequired);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          from_name: formData.name,
          subject: formData.subject,
          replyto: formData.email,
          name: formData.name,
          email: formData.email,
          message: formData.message,
          botcheck: false,
          'h-captcha-response': captchaToken,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to submit contact form');
      }

      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      resetCaptcha();
      setSubmissionCount((currentCount) => {
        const nextCount = currentCount + 1;
        window.localStorage.setItem(CONTACT_SUBMISSION_STORAGE_KEY, String(nextCount));
        return nextCount;
      });

      window.setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to send contact form', error);
      setIsSubmitting(false);
      setSubmitError(t.sendFailed);
      resetCaptcha();
    }
  };

  return (
    <section id="contact" className="section-shell pb-20 sm:pb-24">
      <div className="section-container">
        <div className="mb-10 max-w-3xl sm:mb-16">
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

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)] lg:items-stretch">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="glass-card flex h-full flex-col rounded-[1.8rem] p-5 dark:bg-[#121212] sm:p-8"
          >
            <h3 className="text-[1.75rem] font-bold tracking-tight text-slate-900 dark:text-white sm:text-[1.9rem]">
              {t.infoTitle}
            </h3>

            <div className="mt-8 space-y-5">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 rounded-2xl border border-slate-200 bg-slate-100 p-3.5 dark:border-slate-700 dark:bg-[#171717]">
                  <Mail className="h-6 w-6 text-slate-700 dark:text-slate-300" />
                </div>
                <div className="min-w-0">
                  <h4 className="mb-1 text-[1.05rem] font-semibold text-slate-900 dark:text-white">Email</h4>
                  <a href="mailto:muhammaddaffarmd@gmail.com" className="break-all text-[0.95rem] leading-7 text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                    muhammaddaffarmd@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 rounded-2xl border border-slate-200 bg-slate-100 p-3.5 dark:border-slate-700 dark:bg-[#171717]">
                  <MapPin className="h-6 w-6 text-slate-700 dark:text-slate-300" />
                </div>
                <div>
                  <h4 className="mb-1 text-[1.05rem] font-semibold text-slate-900 dark:text-white">{t.location}</h4>
                  <p className="text-[0.95rem] leading-7 text-slate-600 dark:text-slate-300">
                    Indonesia, Malang
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-[1.6rem] border border-slate-200/80 bg-white/90 p-5 dark:border-slate-700 dark:bg-[#171717] sm:p-6">
              <h4 className="mb-3 text-[1.2rem] font-semibold text-slate-900 dark:text-white">{t.connect}</h4>
              <p className="mb-3 max-w-[34ch] text-[0.95rem] leading-7 text-slate-600 dark:text-slate-300">
                {t.connectDesc}
              </p>
              <p className="max-w-[30ch] text-[0.95rem] leading-7 text-slate-600 dark:text-slate-300">
                {t.connectDesc2}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="h-full"
          >
            <form onSubmit={handleSubmit} className="glass-card flex h-full flex-col space-y-5 rounded-[1.8rem] p-5 dark:bg-[#121212] sm:p-7 md:p-8">
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
                  className="min-h-[150px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 transition-colors focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400/20 dark:border-slate-600 dark:bg-dark-700 dark:text-white dark:focus:border-slate-300 dark:focus:ring-slate-200/20 sm:min-h-[180px]"
                  placeholder={t.messagePlaceholder}
                ></textarea>
              </div>

              <input
                type="checkbox"
                name="botcheck"
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              <div className="flex justify-center overflow-x-auto py-1">
                <HCaptcha
                  key={captchaKey}
                  sitekey={WEB3FORMS_HCAPTCHA_SITE_KEY}
                  reCaptchaCompat={false}
                  onVerify={(token) => {
                    setCaptchaToken(token);
                    setSubmitError(null);
                  }}
                  onExpire={() => setCaptchaToken(null)}
                />
              </div>

              <motion.button
                type="submit"
                className={`flex w-full items-center justify-center rounded-xl px-6 py-3 font-medium text-white transition-colors ${
                  isSubmitting || submitSuccess || hasReachedSubmissionLimit
                    ? 'cursor-not-allowed bg-slate-600'
                    : 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white'
                }`}
                disabled={isSubmitting || submitSuccess || hasReachedSubmissionLimit}
                whileHover={{ scale: isSubmitting || submitSuccess || hasReachedSubmissionLimit ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting || submitSuccess || hasReachedSubmissionLimit ? 1 : 0.98 }}
              >
                {isSubmitting ? (
                  <>{t.sending}</>
                ) : submitSuccess ? (
                  <>{t.sent}</>
                ) : hasReachedSubmissionLimit ? (
                  <>{t.submissionLimitShort}</>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" />
                    {t.send}
                  </>
                )}
              </motion.button>

              {submitError ? (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
                  {submitError}
                </p>
              ) : null}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
