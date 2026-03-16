import React from 'react';
import { motion } from 'framer-motion';
import { projects } from '../../data/projects';
import { ArrowUpRight, Lock } from 'lucide-react';
import type { Language } from '../../types';

interface ProjectsProps {
  language: Language;
}

const cardThemes = [
  'from-[#0f172a] via-[#10243f] to-[#16345a]',
  'from-[#1f2937] via-[#183046] to-[#114e60]',
  'from-[#101828] via-[#1e293b] to-[#24475f]',
  'from-[#111827] via-[#17324b] to-[#155e75]',
];

const Projects: React.FC<ProjectsProps> = ({ language }) => {
  const t = language === 'id'
    ? {
        kicker: 'Featured Projects',
        title: 'Project Perusahaan yang Saya Kerjakan',
        subtitle: 'Section ini menampilkan project dari perusahaan tempat saya bekerja, dengan kontribusi utama di backend API dan satu project fullstack untuk website management.',
        projectLabel: 'Project',
        privateWork: 'Company Project',
        contributionLabel: 'Contribution',
        platformLabel: 'Platform',
        availabilityLabel: 'Availability',
        stackLabel: 'Tech Stack',
        openLink: 'Open Link',
      }
    : {
        kicker: 'Featured Projects',
        title: 'Company Projects I Worked On',
        subtitle: 'This section highlights company projects I contributed to, focused mostly on backend API delivery plus web management product.',
        projectLabel: 'Project',
        privateWork: 'Company Project',
        contributionLabel: 'Contribution',
        platformLabel: 'Platform',
        availabilityLabel: 'Availability',
        stackLabel: 'Tech Stack',
        openLink: 'Open Link',
      };

  return (
    <section id="projects" className="section-shell">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          viewport={{ once: true }}
          className="rounded-[2rem] border border-slate-200/80 bg-white/88 p-6 shadow-[0_24px_70px_-42px_rgba(15,23,42,0.22)] backdrop-blur-sm dark:border-slate-700 dark:bg-dark-800/88 sm:p-8"
        >
          <span className="section-kicker">{t.kicker}</span>
          <h2 className="section-title mt-4">{t.title}</h2>
          <p className="section-subtitle">{t.subtitle}</p>
        </motion.div>

        <div className="mt-8 grid grid-cols-1 gap-5 xl:grid-cols-2">
          {projects.map((project, index) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
              viewport={{ once: true }}
              className={`h-full overflow-hidden rounded-[1.6rem] bg-gradient-to-br ${cardThemes[index % cardThemes.length]} p-[1px] shadow-[0_24px_60px_-38px_rgba(15,23,42,0.75)] sm:rounded-[2rem]`}
            >
              <div className="flex h-full flex-col rounded-[calc(1.6rem-1px)] bg-[#09111f]/88 p-4 text-white sm:rounded-[calc(2rem-1px)] sm:p-6">
                <div className="grid gap-3 border-b border-white/10 pb-4 sm:min-h-[136px] sm:gap-4 sm:pb-5 sm:grid-cols-[minmax(0,1fr)_auto]">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                      {t.projectLabel} 0{index + 1}
                    </p>
                    <div className="mt-3 pb-1 sm:min-h-[84px]">
                      <h3 className="line-clamp-2 break-words text-[1.35rem] font-display font-extrabold leading-[1.15] tracking-tight sm:text-3xl">
                        {project.title}
                      </h3>
                    </div>
                  </div>
                  <div className="flex justify-start sm:justify-end">
                    <span className="inline-flex h-fit w-fit shrink-0 items-center whitespace-nowrap rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/92 backdrop-blur-sm">
                      <Lock className="mr-1.5 h-3.5 w-3.5 shrink-0" />
                      {t.privateWork}
                    </span>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-white/72 line-clamp-5 sm:mt-5 sm:min-h-[112px] sm:text-[15px] sm:leading-7 sm:line-clamp-4">
                  {project.description}
                </p>

                <div className="mt-4 grid gap-3 sm:mt-5 sm:grid-cols-2">
                  <div className="rounded-[1.15rem] border border-white/10 bg-white/5 p-4 sm:min-h-[124px] sm:rounded-[1.35rem]">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45">{t.platformLabel}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {project.platforms?.map((item) => (
                        <span
                          key={`${project.id}-platform-${item}`}
                          className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-white"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[1.15rem] border border-white/10 bg-white/5 p-4 sm:min-h-[124px] sm:rounded-[1.35rem]">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45">{t.availabilityLabel}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {project.availability?.map((item) => (
                        <span
                          key={`${project.id}-availability-${item}`}
                          className="rounded-full border border-cyan-300/15 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-100"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-3 rounded-[1.15rem] border border-white/10 bg-white/5 p-4 sm:min-h-[182px] sm:rounded-[1.35rem]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45">{t.contributionLabel}</p>
                  <div className="mt-3 grid gap-2">
                    {project.highlights?.map((item) => (
                      <div key={item} className="flex items-center rounded-xl bg-white/5 px-3 py-2 text-sm text-white/78 sm:min-h-[44px]">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-3 rounded-[1.15rem] border border-white/10 bg-white/5 p-4 sm:min-h-[132px] sm:rounded-[1.35rem]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45">{t.stackLabel}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={`${project.id}-${tech}`}
                        className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-white"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-auto flex items-end pt-4 sm:min-h-[72px] sm:pt-5">
                  {project.resources?.length ? (
                    <div className="flex w-full flex-wrap gap-3">
                      {project.resources.map((resource) => (
                        <a
                          key={`${project.id}-${resource.type}`}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex w-full items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 sm:w-auto"
                        >
                          {t.openLink}
                          <ArrowUpRight className="ml-2 h-4 w-4" />
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="h-10" />
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
