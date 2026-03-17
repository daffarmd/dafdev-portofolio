import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { Mail, MapPin, Send, FileText, Download } from 'lucide-react';
import type { Language } from '../../types';

interface ContactProps {
  language: Language;
}

const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY?.trim();
const RESUME_URL_ID = import.meta.env.VITE_RESUME_URL_ID?.trim() || '/CV_MuhammadDaffaRamadhan_ID.pdf';
const RESUME_URL_EN = import.meta.env.VITE_RESUME_URL_EN?.trim() || '/CV_MuhammadDaffaRamadhan_ENG.pdf';
const WEB3FORMS_HCAPTCHA_SITE_KEY = '50b2fe65-b00b-4b9e-ad62-3ba471098be2';
const CONTACT_SUBMISSION_LIMIT = 2;
const CONTACT_SUBMISSION_STORAGE_KEY = 'contactSubmissionCount';

type ResumeLanguage = 'id' | 'en';

const Contact: React.FC<ContactProps> = ({ language }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [selectedResume, setSelectedResume] = useState<ResumeLanguage>(language === 'id' ? 'id' : 'en');
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
        resume: 'CV / Resume',
        resumeId: 'ID',
        resumeEn: 'English',
        viewResume: 'Lihat',
        downloadResume: 'Download CV',
        resumeFallback: 'CV tersedia jika diminta lewat email.',
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
        sendFailed: 'Pesan gagal dikirim. Coba lagi beberapa saat lagi.',
        missingConfig: 'Form belum dikonfigurasi. Tambahkan access key Web3Forms di environment Vite.',
        submissionLimitReached: 'Batas kirim pesan untuk browser ini sudah tercapai.',
        captchaRequired: 'Selesaikan captcha terlebih dahulu sebelum mengirim pesan.',
        send: 'Kirim Pesan',
      }
      : {
        kicker: 'Contact',
        title: 'Get In Touch',
        subtitle: 'Have a project idea or want to discuss opportunities? Feel free to reach out.',
        infoTitle: 'Contact Information',
        location: 'Location',
        resume: 'CV / Resume',
        resumeId: 'ID',
        resumeEn: 'English',
        viewResume: 'View',
        downloadResume: 'Download CV',
        resumeFallback: 'Resume is available on request via email.',
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
        sendFailed: 'Message failed to send. Please try again in a moment.',
        missingConfig: 'Form is not configured yet. Add the Web3Forms access key to the Vite environment.',
        submissionLimitReached: 'The message limit for this browser has been reached.',
        captchaRequired: 'Complete the captcha before sending the message.',
        send: 'Send Message',
      };

  const resumeItems = [
    { id: 'id' as const, label: t.resumeId, url: RESUME_URL_ID },
    { id: 'en' as const, label: t.resumeEn, url: RESUME_URL_EN },
  ].filter((item) => Boolean(item.url));
  const activeResume = resumeItems.find((item) => item.id === selectedResume) ?? resumeItems[0];

  useEffect(() => {
    const savedCount = window.localStorage.getItem(CONTACT_SUBMISSION_STORAGE_KEY);
    const parsedCount = Number.parseInt(savedCount ?? '0', 10);

    if (Number.isNaN(parsedCount) || parsedCount < 0) {
      return;
    }

    setSubmissionCount(parsedCount);
  }, []);

  const remainingAttempts = Math.max(CONTACT_SUBMISSION_LIMIT - submissionCount, 0);
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

        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="glass-card h-full p-4 sm:p-8"
          >
            <h3 className="mb-5 text-[1.45rem] font-bold text-slate-900 dark:text-white sm:mb-6 sm:text-2xl">
              {t.infoTitle}
            </h3>

            <div className="space-y-5 sm:space-y-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 rounded-xl border border-slate-200 bg-slate-100 p-3 dark:border-slate-700 dark:bg-dark-700">
                  <Mail className="h-6 w-6 text-slate-700 dark:text-slate-300" />
                </div>
                <div className="min-w-0">
                  <h4 className="mb-1 text-base font-semibold text-slate-900 dark:text-white sm:text-lg">Email</h4>
                  <a href="mailto:muhammaddaffarmd@gmail.com" className="break-all text-sm text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white sm:text-[1rem]">
                    muhammaddaffarmd@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 rounded-xl border border-slate-200 bg-slate-100 p-3 dark:border-slate-700 dark:bg-dark-700">
                  <MapPin className="h-6 w-6 text-slate-700 dark:text-slate-300" />
                </div>
                <div className="min-w-0">
                  <h4 className="mb-1 text-base font-semibold text-slate-900 dark:text-white sm:text-lg">{t.location}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 sm:text-[1rem]">
                    Indonesia, Malang
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-4 sm:mt-10 sm:space-y-5">
              <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 dark:border-slate-700 dark:bg-dark-700/70 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 rounded-xl border border-slate-200 bg-slate-100 p-3 dark:border-slate-700 dark:bg-dark-800">
                    <FileText className="h-6 w-6 text-slate-700 dark:text-slate-300" />
                  </div>
                  <h4 className="text-base font-semibold text-slate-900 dark:text-white sm:text-lg">{t.resume}</h4>
                </div>

                {resumeItems.length ? (
                  <div className="mt-4 rounded-[1.35rem] border border-slate-700/80 bg-[#111111] p-4 shadow-[0_24px_60px_-44px_rgba(15,23,42,0.9)] sm:mt-5 sm:rounded-[1.5rem] sm:p-6">
                    <div className="inline-flex w-fit max-w-full rounded-full border border-slate-700 bg-transparent p-1">
                      {resumeItems.map((resume) => (
                        <button
                          key={resume.id}
                          type="button"
                          onClick={() => setSelectedResume(resume.id)}
                          className={`rounded-full px-3 py-2 text-[11px] font-semibold transition-colors sm:px-5 sm:text-xs ${
                            activeResume?.id === resume.id
                              ? 'bg-white text-slate-900'
                              : 'text-slate-200 hover:text-white'
                          }`}
                        >
                          {resume.label}
                        </button>
                      ))}
                    </div>

                    <div className="mt-6 flex flex-col gap-4 sm:mt-8 sm:flex-row sm:items-end sm:justify-between">
                      <div className="min-w-0">
                        <p className="break-words text-[1.6rem] font-semibold tracking-tight text-white sm:text-[2.2rem]">
                          {activeResume?.label}
                        </p>
                        <p className="mt-1.5 text-sm text-slate-400 sm:mt-2 sm:text-lg">{t.resume}</p>
                      </div>

                      <div className="flex shrink-0 items-center gap-2.5">
                        <a
                          href={activeResume?.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-900 transition hover:bg-slate-100 sm:h-14 sm:w-14"
                          aria-label={`${t.viewResume} ${activeResume?.label}`}
                          title={`${t.viewResume} ${activeResume?.label}`}
                        >
                          <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                        </a>
                        <a
                          href={activeResume?.url}
                          download
                          className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-600 text-white transition hover:border-slate-400 hover:bg-white/5 sm:h-14 sm:w-14"
                          aria-label={`${t.downloadResume} ${activeResume?.label}`}
                          title={`${t.downloadResume} ${activeResume?.label}`}
                        >
                          <Download className="h-4 w-4 sm:h-5 sm:w-5" />
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{t.resumeFallback}</p>
                )}
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 dark:border-slate-700 dark:bg-dark-700/70 sm:p-6">
                <h4 className="text-base font-semibold text-slate-900 dark:text-white sm:text-lg">{t.connect}</h4>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {t.connectDesc}
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {t.connectDesc2}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="h-full"
          >
            <form onSubmit={handleSubmit} className="glass-card flex h-full flex-col space-y-4 p-4 sm:space-y-5 sm:p-8">
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

              <div className="-mx-1 overflow-x-auto rounded-2xl px-1 py-2 sm:mx-0 sm:px-0 sm:py-0">
                <div className="flex min-h-[86px] min-w-[304px] items-center justify-start sm:min-h-[92px] sm:justify-center">
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
                  <>{t.submissionLimitReached}</>
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
