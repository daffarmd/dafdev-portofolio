import React from 'react';
import { motion } from 'framer-motion';
import { skills } from '../../data/skills';
import type { Language } from '../../types';

interface SkillsProps {
  language: Language;
}

const Skills: React.FC<SkillsProps> = ({ language }) => {
  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  const categoryTitles = {
    backend: language === 'id' ? 'Backend' : 'Backend',
    database: language === 'id' ? 'Database' : 'Database',
    devops: 'DevOps',
    other: language === 'id' ? 'Keahlian Lainnya' : 'Other Skills'
  };

  const categoryAccent = {
    backend: 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900',
    database: 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900',
    devops: 'bg-slate-700 text-white dark:bg-slate-300 dark:text-slate-900',
    other: 'bg-slate-600 text-white dark:bg-slate-400 dark:text-slate-900'
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <section id="skills" className="section-shell">
      <div className="section-container">
        <div className="mb-12 max-w-3xl sm:mb-16">
          <motion.span
            className="section-kicker"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            {language === 'id' ? 'Keahlian Utama' : 'Core Expertise'}
          </motion.span>
          <motion.h2
            className="section-title mt-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            {language === 'id' ? 'Keahlian Teknis' : 'Technical Skills'}
          </motion.h2>
          <motion.p
            className="section-subtitle"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            {language === 'id'
              ? 'Fokus keahlian teknis saya ada di pengembangan backend dengan Golang dan PostgreSQL, didukung teknologi lain yang relevan di stack saya.'
              : 'My technical expertise is focused on backend development with Golang and PostgreSQL, complemented by various other technologies in my stack.'}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
            <motion.div 
              key={category}
              className="glass-card p-5 md:p-7"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className={`mb-6 rounded-xl border border-slate-200 p-4 dark:border-slate-700 ${categoryAccent[category as keyof typeof categoryAccent]}`}>
                <h3 className="text-lg font-bold sm:text-xl">
                  {categoryTitles[category as keyof typeof categoryTitles]}
                </h3>
                <p className="mt-1 text-sm opacity-80">
                  {language === 'id' ? 'Fokus, praktis, dan siap production.' : 'Focused, practical, and production ready.'}
                </p>
              </div>
              <div className="space-y-6">
                {categorySkills.map((skill) => (
                  <motion.div key={skill.id} variants={itemVariants}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-slate-800 dark:text-white">{skill.name}</span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {skill.level === 5
                          ? language === 'id' ? 'Ahli' : 'Expert'
                          : skill.level === 4
                            ? language === 'id' ? 'Lanjutan' : 'Advanced'
                            : skill.level === 3
                              ? language === 'id' ? 'Menengah' : 'Intermediate'
                              : skill.level === 2
                                ? language === 'id' ? 'Dasar' : 'Basic'
                                : language === 'id' ? 'Pemula' : 'Beginner'}
                      </span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-slate-200 dark:bg-dark-600">
                      <div 
                        className="h-full rounded-full bg-slate-900 dark:bg-slate-100"
                        style={{ width: `${(skill.level / 5) * 100}%` }}
                      ></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="mt-12 rounded-2xl border border-slate-200/70 bg-white/90 p-5 text-center dark:border-slate-700 dark:bg-dark-800/80 sm:mt-14 sm:p-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">
            {language === 'id' ? 'Terus Belajar' : 'Always Learning'}
          </h3>
          <p className="mx-auto max-w-2xl text-slate-600 dark:text-slate-300">
            {language === 'id'
              ? 'Saat ini saya sedang mengeksplorasi Rust dan memperluas wawasan di distributed systems serta teknologi cloud-native.'
              : 'Currently exploring Rust and expanding my knowledge in distributed systems and cloud-native technologies.'}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
