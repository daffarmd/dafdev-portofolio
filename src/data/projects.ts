import type { Project } from '../types';

export const projects: Project[] = [
  {
    id: 1,
    title: 'NDE',
    description:
      'Backend API for Nota Dinas Elektronik mobile workflows, handling document submission, approval flows, and structured data exchange across internal services.',
    platforms: ['Mobile', 'Internal System'],
    availability: ['Production'],
    technologies: ['Golang', 'REST API', 'PostgreSQL'],
    highlights: [
      'Designed API flows for electronic official memo processes',
      'Built reliable endpoints for approval and document tracking',
      'Supported mobile integration with internal business services',
    ],
    isPrivate: true,
  },
  {
    id: 2,
    title: 'Insanul Barokah',
    description:
      'Backend API for a production mobile application available on App Store and Play Store, powering core app flows and operational data exchange.',
    platforms: ['iOS', 'Android'],
    availability: ['App Store', 'Play Store'],
    technologies: ['Golang', 'REST API', 'PostgreSQL'],
    highlights: [
      'Delivered APIs consumed directly by the mobile client',
      'Structured backend services for stable production usage',
      'Handled business data exchange between app and core system',
    ],
    isPrivate: true,
  },
  {
    id: 3,
    title: 'Tirtekna',
    description:
      'Backend API contribution for Tirtekna mobile product flows, connecting the application layer with business logic and production-ready service endpoints.',
    platforms: ['Mobile'],
    availability: ['Live Website'],
    technologies: ['Golang', 'REST API', 'PostgreSQL'],
    highlights: [
      'Exposed API endpoints for mobile-first product features',
      'Maintained integration between app workflows and backend services',
      'Supported production delivery with a clean service contract',
    ],
    isPrivate: true,
    resources: [
      {
        type: 'website',
        url: 'https://tirtekna.com/',
      },
    ],
  },
  {
    id: 4,
    title: 'Masjid Dashboard',
    description:
      'Fullstack development for a mosque management website, covering the user-facing web platform and the supporting application services behind it.',
    platforms: ['Web'],
    availability: ['Live Website'],
    technologies: ['Golang', 'Web', 'Dashboard', 'PostgreSQL'],
    highlights: [
      'Built the website flow together with the backend services it depends on',
      'Handled application logic for mosque management operations',
      'Supported stable live deployment for active production usage',
    ],
    isPrivate: true,
  },
];
