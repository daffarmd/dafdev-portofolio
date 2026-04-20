import { Experience } from '../types';

export const experiences: Experience[] = [
  {
    id: 1,
    company: 'PT Angon Data Ajisaka',
    roles: [
      {
        title: "Backend Developer",
        duration: "January 2025 - Present", 
        summary: 'Building internal services, partner integrations, and operational tooling with a reliability-first approach.',
        stack: ['Golang', 'PostgreSQL', 'gRPC', 'REST API', 'Svelte', 'n8n', 'RAG'],
        achievements: [
          'Designed and implemented workflow automation systems using n8n, reducing repetitive operational tasks such as transaction processing and status updates by up to 60-80%.',
          'Built an AI-powered IT support assistant using RAG architecture, improving response accuracy and reducing manual support workload significantly.',
        ],
      },
      {
        title: "IT Support",
        duration: "June 2023 - December 2024", 
        summary: 'Handled incident response, client issue resolution, and day-to-day system stability across internal operations.',
        stack: ['Monitoring', 'Troubleshooting', 'Client Support', 'Documentation']
      }
    ]
  },
  {
    id: 2,
    company: 'Institut Teknologi Nasional Malang',
    roles: [
      {
        title: "Backend Intern",
        duration: "January 2022 - December 2022", 
        summary: 'Contributed to campus internal apps by building backend features, responsive interfaces, and API integrations.',
        stack: ['PHP', 'CodeIgniter 3', 'Bootstrap', 'JavaScript', 'REST API']
      }
    ]
  }
];
