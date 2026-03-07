import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Sparkles } from 'lucide-react';
import { QueueDemoScreen } from '../../components/showcase/ShowcaseDemos';

const QueueAppDemo: React.FC = () => {
  return (
    <section className="section-shell pt-24 sm:pt-28">
      <div className="section-container">
        <Link
          to="/showcase"
          className="inline-flex items-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900 dark:border-slate-700 dark:bg-dark-800 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Showcase
        </Link>

        <div className="mt-8 max-w-3xl">
          <span className="section-kicker">
            <Sparkles className="mr-2 h-4 w-4" />
            Queue Display Demo
          </span>
          <h1 className="section-title mt-4">Queue display dashboard concept</h1>
          <p className="section-subtitle">
            A compact public-facing queue display concept for ticket calling visibility and service flow monitoring.
          </p>
        </div>

        <div className="mt-10">
          <QueueDemoScreen />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {['Realtime display', 'Public-facing screen', 'Ticket calling', 'Queue visibility'].map((item) => (
            <span
              key={item}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-dark-800 dark:text-slate-200 sm:text-sm"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="mt-8 rounded-[1.4rem] border border-slate-200 bg-white/85 p-5 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur-sm dark:border-slate-700 dark:bg-dark-800/85 sm:rounded-[1.75rem] sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Use case</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Suitable for clinics and public service counters that need a clean, readable queue display on a shared screen.
              </p>
            </div>
            <a
              href="https://queue-display-eight.vercel.app/display"
              target="_blank"
              rel="noreferrer"
              className="btn-primary w-full sm:w-auto"
            >
              Open Live Demo
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QueueAppDemo;
