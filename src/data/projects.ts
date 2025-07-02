import { Project } from '../types';

export const projects: Project[] = [
  {
    id: 1,
    title: 'Distributed Task Scheduler',
    description:
      'A high-performance task scheduler built with Go that distributes workloads across multiple nodes. Includes fault tolerance, job prioritization, and a monitoring dashboard.',
    technologies: ['Golang', 'PostgreSQL', 'Redis', 'Docker'],
    image: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    github: 'https://github.com/username/task-scheduler',
  },
  {
    id: 2,
    title: 'API Gateway Service',
    description:
      'A robust API gateway service that handles routing, authentication, rate limiting, and request transformation. Deployed in production serving 100K+ daily requests.',
    technologies: ['Golang', 'gRPC', 'JWT', 'Kubernetes'],
    image: 'https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    github: 'https://github.com/username/api-gateway',
  },
  {
    id: 3,
    title: 'E-commerce Inventory System',
    description:
      'Inventory management system for an e-commerce platform. Features include real-time stock updates, inventory forecasting, and integration with multiple sales channels.',
    technologies: ['Golang', 'PostgreSQL', 'RabbitMQ', 'Docker'],
    image: 'https://images.pexels.com/photos/7988079/pexels-photo-7988079.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    github: 'https://github.com/username/inventory-system',
  },
  {
    id: 4,
    title: 'Event-Driven Data Pipeline',
    description:
      'A scalable data processing pipeline that ingests, transforms, and stores events from multiple sources. Supports data validation, transformation, and real-time analytics.',
    technologies: ['Golang', 'Kafka', 'PostgreSQL', 'Prometheus'],
    image: 'https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    github: 'https://github.com/username/data-pipeline',
  },
];