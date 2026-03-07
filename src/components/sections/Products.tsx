import React from 'react';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { Activity, ArrowUpRight, LayoutDashboard } from 'lucide-react';
import type { Language } from '../../types';
import hospitalDashboardImage from '../../assets/hospital-app-dashboard.png';
import queueDisplayDashboardImage from '../../assets/queue-display-dashboard.png';

interface ProductsProps {
  language: Language;
}

interface ProductItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  stack: string[];
  demoUrl: string;
  image: string;
  icon: React.ComponentType<{ className?: string }>;
}

const products: ProductItem[] = [
  {
    id: 'queue-display',
    title: 'Queue Display',
    summary: 'Realtime queue display for clinics and service counters, designed for public screens that need clear ticket calling visibility.',
    category: 'Queue Management',
    stack: ['Golang', 'Socket IO', 'Display Screen', 'Public-facing', 'Operational Tool', 'Realtime', 'Dashboard', 'Service Flow', 'Queue Visibility', 'SvelteKit'],
    demoUrl: 'https://queue-display-eight.vercel.app/display',
    image: queueDisplayDashboardImage,
    icon: LayoutDashboard,
  },
  {
    id: 'hospital-app',
    title: 'Hospital App',
    summary: 'Operational dashboard for hospital workflows with patient flow, occupancy, and alert monitoring in a live environment.',
    category: 'Healthcare Operations',
    stack: ['Golang', 'Dashboard', 'Operational Tool', 'Patient Flow', 'Bed Occupancy', 'Unit Coordination', 'Alert Monitoring.', 'SvelteKit'],
    demoUrl: 'https://hospital-app-one.vercel.app/',
    image: hospitalDashboardImage,
    icon: Activity,
  },
];

const Products: React.FC<ProductsProps> = ({ language }) => {
  const t = language === 'id'
    ? {
        kicker: 'Katalog Produk',
        title: 'Curated Product Catalog',
        subtitle: 'Produk yang saya tampilkan di sini tidak hanya bisa didemokan, tapi juga sudah disusun dengan value yang jelas untuk kebutuhan operasional nyata.',
        viewDemo: 'Lihat Demo',
        discuss: 'Diskusikan Project',
      }
    : {
        kicker: 'Product Catalog',
        title: 'Curated Product Catalog',
        subtitle: 'These products are positioned not only as demos, but as operational solutions with a clear value proposition.',
        viewDemo: 'View Demo',
        discuss: 'Discuss Project',
      };

  return (
    <section id="products" className="section-shell">
      <div className="section-container">
        <div className="mb-12 max-w-4xl">
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
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {t.subtitle}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
          {products.map((product, index) => {
            const Icon = product.icon;
            return (
              <motion.article
                key={product.id}
                className="glass-card flex h-full flex-col overflow-hidden p-3 md:p-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <div className="overflow-hidden rounded-[1.25rem] border border-slate-200 dark:border-slate-700 sm:rounded-[1.5rem]">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="h-44 w-full object-cover object-left-top sm:h-56"
                  />
                </div>

                <div className="flex h-full flex-col p-4 md:p-5">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-600 dark:bg-dark-700 dark:text-slate-200">
                        {product.category}
                      </span>
                      <h3 className="mt-4 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">{product.title}</h3>
                    </div>
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-dark-800">
                      <Icon className="h-5 w-5 text-slate-700 dark:text-slate-200" />
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:min-h-[84px]">
                    {product.summary}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {product.stack.map((tech) => (
                      <span
                        key={`${product.id}-${tech}`}
                        className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-dark-700 dark:text-slate-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto flex flex-col gap-3 pt-5 sm:flex-row">
                    <a
                      href={product.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary w-full text-xs sm:w-auto"
                    >
                      {t.viewDemo}
                      <ArrowUpRight className="ml-1.5 h-4 w-4" />
                    </a>
                    <RouterLink
                      to="/contact"
                      className="inline-flex w-full items-center justify-center rounded-full border border-slate-300 px-5 py-3 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-dark-700 sm:w-auto"
                    >
                      {t.discuss}
                    </RouterLink>
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

export default Products;
