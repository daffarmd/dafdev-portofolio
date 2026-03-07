import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Sparkles } from 'lucide-react';
import { HospitalDemoScreen } from '../../components/showcase/ShowcaseDemos';

const HospitalAppDemo: React.FC = () => {
  return (
    <section className="section-shell pt-28">
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
            Hospital App Demo
          </span>
          <h1 className="section-title mt-4">Hospital operations dashboard concept</h1>
          <p className="section-subtitle">
            A management view for patient flow, occupancy, shift alerts, and unit-level operational visibility.
          </p>
        </div>

        <div className="mt-10">
          <HospitalDemoScreen />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {['Patient board', 'Occupancy map', 'Operational alerts', 'Shift overview'].map((item) => (
            <span
              key={item}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-dark-800 dark:text-slate-200"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="mt-8 rounded-[1.75rem] border border-slate-200 bg-white/85 p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur-sm dark:border-slate-700 dark:bg-dark-800/85">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Use case</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Built for healthcare operations where triage, occupancy, and unit coordination need to be visible in one place.
              </p>
            </div>
            <a
              href="https://github.com/daffarmd"
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
            >
              Explore Repository
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HospitalAppDemo;
