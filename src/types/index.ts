export interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  image?: string;
  link?: string;
  github?: string;
}

export interface Experience {
  id: number;
  company: string;
  position: string;
  duration: string;
  description: string[];
}

export interface Skill {
  id: number;
  name: string;
  level: number; // 1-5
  category: 'backend' | 'database' | 'devops' | 'other';
}