import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <section className="section-shell pt-28 sm:pt-32">
      <div className="section-container">
        <div className="glass-card p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">404</p>
          <h1 className="mt-3 text-3xl font-display font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Page Not Found
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            Halaman yang Anda cari tidak tersedia. Kembali ke homepage untuk melihat profil Muhammad Daffa Ramadhan.
          </p>
          <RouterLink to="/" className="btn-primary mt-6 inline-flex">
            Back to Home
          </RouterLink>
        </div>
      </div>
    </section>
  );
};

export default NotFoundPage;
