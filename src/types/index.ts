export type Language = 'id' | 'en';
export type ArticleStatus = 'draft' | 'published';
export type ProfileRole = 'viewer' | 'admin';

export interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  platforms?: string[];
  availability?: string[];
  highlights?: string[];
  image?: string;
  link?: string;
  github?: string;
  isPrivate: boolean;
  resources?: {
    type: 'website' | 'app' | 'docs';
    url: string;
  }[];

}

export interface Role {
  title: string;
  duration: string;
  summary: string;
  stack: string[];
}

export interface Experience {
  id: number;
  company: string;
  roles: Role[];
}


export interface Skill {
  id: number;
  name: string;
  level: number; // 1-5
  category: 'backend' | 'database' | 'devops' | 'other';
}

export type ArticleBlock =
  | {
      type: 'paragraph' | 'heading';
      content: string;
    }
  | {
      type: 'image';
      src: string;
      alt: string;
      caption?: string;
    }
  | {
      type: 'list';
      items: string[];
    }
  | {
      type: 'highlight';
      title: string;
      content: string;
    }
  | {
      type: 'code';
      language: string;
      code: string;
      fileName?: string;
      caption?: string;
      command?: string;
    };

export interface Article {
  id: string | number;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  category: string;
  author: string;
  image: string;
  imageAlt: string;
  sections: ArticleBlock[];
  status?: ArticleStatus;
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  translations?: {
    en?: {
      title?: string;
      excerpt?: string;
      readTime?: string;
      category?: string;
      imageAlt?: string;
      sections?: ArticleBlock[];
    };
  };
}
