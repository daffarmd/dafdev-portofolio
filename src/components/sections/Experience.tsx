import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Sparkles } from 'lucide-react';
import { experiences } from '../../data/experiences';
import type { Language } from '../../types';

interface ExperienceProps {
  language: Language;
}

const Experience: React.FC<ExperienceProps> = ({ language }) => {
  return (
    <section id="experience" className="section-shell">
      <div className="section-container">
        <div className="mb-12 max-w-3xl sm:mb-16">
          <motion.span
            className="section-kicker"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            {language === 'id' ? 'Perjalanan Karier' : 'Career Path'}
          </motion.span>
          <motion.h2
            className="section-title mt-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            {language === 'id' ? 'Pengalaman Kerja' : 'Work Experience'}
          </motion.h2>
          <motion.p
            className="section-subtitle"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {language === 'id'
              ? 'Pengalaman membangun produk internal dan integrasi enterprise dengan fokus pada reliability.'
              : 'Experience building internal products and enterprise integrations with a focus on reliability.'}
          </motion.p>
        </div>

        <div className="relative">
          <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-slate-200 via-slate-300 to-transparent dark:from-slate-700 dark:via-slate-600 md:left-1/2 md:-translate-x-1/2"></div>

          <div className="space-y-10 sm:space-y-12">
            {experiences.map((exp, index) => (
              <motion.div 
                key={exp.id}
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="absolute left-0 top-5 z-10 rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm dark:border-slate-700 dark:bg-dark-800 md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
                  <Briefcase className="h-4 w-4 text-slate-700 dark:text-slate-200" />
                </div>

                <div className={`pb-6 pl-12 sm:pb-8 md:w-1/2 md:pl-0 ${
                  index % 2 === 0 ? 'md:ml-auto md:pl-12' : 'md:mr-auto md:pr-12'
                }`}>
                  <div className="glass-card p-5 transition-transform hover:-translate-y-1 sm:p-7">
                    <div className="mb-5 flex items-center justify-between gap-3 border-b border-slate-200 pb-4 dark:border-slate-700">
                      <h4 className="text-lg font-semibold text-slate-900 dark:text-white">{exp.company}</h4>
                      <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600 dark:border-slate-600 dark:bg-dark-700 dark:text-slate-300">
                        <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                        {language === 'id' ? 'Pengalaman' : 'Experience'}
                      </span>
                    </div>

                    {exp.roles.map((role, i) => (
                      <div
                        key={i}
                        className={`${i > 0 ? 'mt-5 border-t border-slate-200 pt-5 dark:border-slate-700' : ''}`}
                      >
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                          <h3 className="text-base font-bold text-slate-900 dark:text-white">{role.title}</h3>
                          <span className="inline-block rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:border-slate-600 dark:bg-dark-700 dark:text-slate-200">
                            {role.duration}
                          </span>
                        </div>
                        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300 sm:leading-7">
                          {role.summary}
                        </p>
                        {role.achievements?.length ? (
                          <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-600 dark:text-slate-300 sm:leading-7">
                            {role.achievements.map((achievement) => (
                              <li key={achievement} className="flex gap-3">
                                <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-slate-400 dark:bg-slate-500" />
                                <span>{achievement}</span>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                        <div className="mt-4 flex flex-wrap gap-2">
                          {role.stack.map((item) => (
                            <span
                              key={`${role.title}-${item}`}
                              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-dark-800 dark:text-slate-200"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
