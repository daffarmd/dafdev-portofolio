import React from 'react';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import {
  ArrowUpRight,
  Building2,
  Rocket,
} from 'lucide-react';
import type { Language } from '../types';
import { HospitalPreview, QueuePreview } from '../components/showcase/ShowcaseDemos';

interface ShowcasePageProps {
  language: Language;
}

const ShowcasePage: React.FC<ShowcasePageProps> = ({ language }) => {
  const t = language === 'id'
    ? {
        kicker: 'Showcase',
        title: 'Interactive App Demos',
        subtitle: 'Hover kartu untuk melihat mini preview produk yang bisa dipakai saat presentasi atau pitching.',
        hint: 'Hover untuk lihat demo',
        view: 'Lihat Konsep',
        openDemo: 'Open Demo',
        hoverNote: 'Hover kartu untuk preview',
        ready: 'Ready Demo',
        queueTitle: 'Queue Display',
        queueDesc: 'Realtime queue display untuk layar publik dengan fokus pada panggilan nomor antrean dan visibilitas layanan.',
        queueHighlights: ['Display realtime', 'Public-facing screen', 'Queue visibility'],
        hospitalTitle: 'Hospital App',
        hospitalDesc: 'Dashboard operasional rumah sakit untuk pasien, bed occupancy, dan koordinasi unit layanan.',
        hospitalHighlights: ['Patient board', 'Monitoring ruangan', 'Alert operasional'],
      }
    : {
        kicker: 'Showcase',
        title: 'Interactive App Demos',
        subtitle: 'Hover each card to reveal a mini product preview suitable for presentations and pitching.',
        hint: 'Hover to preview',
        view: 'View Concept',
        openDemo: 'Open Demo',
        hoverNote: 'Hover card to preview',
        ready: 'Ready Demo',
        queueTitle: 'Queue Display',
        queueDesc: 'A realtime public-facing queue display focused on ticket calling visibility and service flow monitoring.',
        queueHighlights: ['Realtime display', 'Public-facing screen', 'Queue visibility'],
        hospitalTitle: 'Hospital App',
        hospitalDesc: 'An operational hospital dashboard for patient flow, bed occupancy, and unit coordination.',
        hospitalHighlights: ['Patient board', 'Room monitoring', 'Operational alerts'],
      };

  const showcaseItems = [
    {
      id: 'queue-display',
      title: t.queueTitle,
      description: t.queueDesc,
      status: t.ready,
      theme: 'from-[#274d87] via-[#1e3963] to-[#152847]',
      accent: 'bg-sky-400/15 text-sky-100 border-sky-300/20',
      highlights: t.queueHighlights,
      preview: <QueuePreview />,
      demoPath: 'https://queue-display-eight.vercel.app/display',
      demoExternal: true,
      icon: Rocket,
    },
    {
      id: 'hospital-app',
      title: t.hospitalTitle,
      description: t.hospitalDesc,
      status: t.ready,
      theme: 'from-[#245a6b] via-[#1d4250] to-[#122935]',
      accent: 'bg-emerald-400/15 text-emerald-100 border-emerald-300/20',
      highlights: t.hospitalHighlights,
      preview: <HospitalPreview />,
      demoPath: 'https://hospital-app-one.vercel.app/',
      demoExternal: true,
      icon: Building2,
    },
  ];

  return (
    <section className="section-shell pt-28">
      <div className="section-container">
        <div className="mb-12 max-w-3xl">
          <span className="section-kicker">{t.kicker}</span>
          <h1 className="section-title mt-4">{t.title}</h1>
          <p className="section-subtitle">{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {showcaseItems.map((project, index) => {
            const Icon = project.icon;
            return (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                viewport={{ once: true }}
                className={`group relative overflow-hidden rounded-[2rem] bg-gradient-to-br ${project.theme} p-6 text-white shadow-[0_26px_70px_-40px_rgba(15,23,42,0.9)]`}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_28%)] opacity-90" />

                <div className="relative z-10 flex h-full min-h-[520px] flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur-sm">
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <div className={`rounded-full border px-3 py-1 text-xs font-semibold ${project.accent}`}>
                      {project.status}
                    </div>
                  </div>

                  <div className="mt-8 max-w-md transition duration-300 group-hover:opacity-0 group-hover:translate-y-3 xl:group-hover:pointer-events-none">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">{t.hint}</p>
                    <h2 className="mt-3 text-4xl font-display font-extrabold tracking-tight text-white">
                      {project.title}
                    </h2>
                    <p className="mt-4 text-base leading-relaxed text-white/72">
                      {project.description}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {project.highlights.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/90"
                        >
                          {item}
                        </span>
                      ))}
                    </div>

                    <div className="mt-8 inline-flex items-center text-sm font-semibold text-white">
                      {t.view}
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </div>
                  </div>

                  <div className="mt-auto flex flex-wrap items-center gap-3 pt-6">
                    {project.demoExternal ? (
                      <a
                        href={project.demoPath}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5"
                      >
                        {t.openDemo}
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                      </a>
                    ) : (
                      <RouterLink
                        to={project.demoPath}
                        className="inline-flex items-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5"
                      >
                        {t.openDemo}
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                      </RouterLink>
                    )}
                    <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/50">
                      {t.hoverNote}
                    </span>
                  </div>

                  <div className="mt-5 xl:absolute xl:inset-x-6 xl:bottom-20">
                    <div className="h-[280px] rounded-[1.6rem] border border-white/10 bg-[#0b1220]/45 p-3 backdrop-blur-sm transition duration-300 xl:opacity-0 xl:translate-y-4 xl:group-hover:opacity-100 xl:group-hover:translate-y-0">
                      {project.preview}
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ShowcasePage;
