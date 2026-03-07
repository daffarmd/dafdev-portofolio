import React from 'react';
import { ArrowUpRight, BookOpen, Clock3, Sparkles } from 'lucide-react';

const Articles: React.FC = () => {
  return (
    <div className="min-h-screen py-12 pt-28">
      <div className="mx-auto w-full max-w-[1080px] px-6 md:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/85 p-6 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.35)] backdrop-blur-sm dark:border-slate-700 dark:bg-dark-800/85 sm:p-8 md:p-10">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 dark:border-slate-700 dark:bg-dark-700 dark:text-slate-300">
                <Sparkles className="mr-2 h-4 w-4" />
                Coming Soon
              </div>

              <div className="mt-6 flex items-center">
                <div className="rounded-2xl bg-gradient-to-br from-primary-600 to-secondary-500 p-4 shadow-md shadow-primary-700/20">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <h1 className="ml-5 text-4xl font-display font-extrabold tracking-tight text-slate-900 md:text-6xl dark:text-white">
                  Daf Notes
                </h1>
              </div>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                Articles are being prepared in a cleaner format. I am curating practical write-ups about backend engineering, product thinking, and debugging notes.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {['Backend Notes', 'System Design', 'Debugging Logs'].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-dark-700 dark:text-slate-200"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-8 inline-flex items-center text-sm font-semibold text-slate-700 dark:text-slate-200">
                Publishing queue is in progress
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </div>
            </div>

            <div className="rounded-[1.75rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-5 text-white shadow-[0_24px_60px_-32px_rgba(15,23,42,0.9)]">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/55">
                  Writing Pipeline
                </p>
                <Clock3 className="h-5 w-5 text-white/60" />
              </div>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">Stage 01</p>
                  <h2 className="mt-2 text-xl font-bold">Drafting ideas</h2>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">
                    Short engineering notes are being refined into readable case studies.
                  </p>
                </div>

                <div className="rounded-2xl border border-primary-400/20 bg-primary-500/10 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-200/70">Stage 02</p>
                  <h2 className="mt-2 text-xl font-bold text-white">Editing and packaging</h2>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">
                    Layout, visuals, and article structure are being prepared before launch.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-dashed border-white/15 p-4">
                <p className="text-sm font-semibold text-white">Expected first release</p>
                <p className="mt-1 text-2xl font-display font-bold">Soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Articles;
