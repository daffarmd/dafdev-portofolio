import { Project } from '../types';
import homfineImage from '../assets/homfine.png'

export const projects: Project[] = [
  
  {
    id: 1,
    title: 'Enterprise H2H Integration - Bank Kalsel',
    description:
      'Developed a secure and scalable host-to-host integration system enabling real-time, financial data exchange between internal systems and third-party banking APIs.',
    technologies: ['Golang', 'RestApi'],
    image: 'https://imgs.search.brave.com/W77sdIirm-ShqZ_u7lw_y2KgXNQ2pXSGsd-zqPMuaDw/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pMC53/cC5jb20vZGlhbmlz/YS5jb20vd3AtY29u/dGVudC91cGxvYWRz/LzIwMjQvMDIvTG9n/by1CYW5rLUthbHNl/bC5qcGc_cmVzaXpl/PTEzMDAsODAwJnNz/bD0x',
    isPrivate: true,
    resources: [
      {
        type: "website",
        url: "https://www.bankkalsel.web.id/"
      }
    ]
  },

  {
    id: 2,
    title: 'Cetak Toolbox (Cetak Bukti Bayar)',
    description:
      'is a web platform to replace wrong JSON to right JSON, this common issue on Angon Support.',
    technologies: ['Golang', 'HTMX'],
    image: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    github: 'https://github.com/fiantyogalihp/agn-cetak-toolbox',
    isPrivate: false
  },

   {
    id: 3,
    title: 'A Simple JWT Login',
    description:
    'A basic authentication service built using Golang that implements secure login functionality with JSON Web Tokens (JWT). Includes password hashing, user authentication, and role-based access control with PostgreSQL and database migration support.',
    technologies: ['Golang', 'PostgreSQL'],
    image: 'https://imgs.search.brave.com/B3ea0g6as4Pfs_t-whNo7sYOx0AOwnVusGv0DhzA4Ng/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9sb2dp/bi11c2VyLXBhc3N3/b3JkLWNvbXB1dGVy/LXNjcmVlbi1waWN0/dXJlLTYyNzU1MjU2/LmpwZw',
    github: 'https://github.com/daffarmd/jwt-login',
    isPrivate: false

  },


  {
    id: 4,
    title: 'Homfine Finance',
    description:
      'A financial management app that helps you track, plan, and grow your financial assets with ease.',
    technologies: ['Golang', 'PostgreSQL', 'Svelte', 'Docker'],
    image: homfineImage,
    isPrivate: true

  },
 
];