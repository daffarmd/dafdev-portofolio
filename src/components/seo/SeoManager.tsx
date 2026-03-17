import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

type SeoConfig = {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  schema?: 'person-profile';
};

const DEFAULT_IMAGE_PATH = '/og-image.png';
const SITE_URL = 'https://muhammaddaffaramadhan.vercel.app';
const PERSON_NAME = 'Muhammad Daffa Ramadhan';
const PERSON_DESCRIPTION = 'Backend Developer specializing in Golang, PostgreSQL, and scalable API systems.';

const HOME_SEO: SeoConfig = {
  title: 'Home | Muhammad Daffa Ramadhan',
  description:
    'Portfolio resmi Muhammad Daffa Ramadhan, Backend Developer yang fokus pada Golang, PostgreSQL, REST API, dan pengembangan sistem backend yang scalable.',
  path: '/',
  schema: 'person-profile',
};

const SEO_CONFIG: Record<string, SeoConfig> = {
  '/': HOME_SEO,
  '/about': {
    title: 'About | Muhammad Daffa Ramadhan',
    description: 'Pelajari profil, pengalaman, dan perjalanan karier Muhammad Daffa Ramadhan sebagai Backend Developer.',
    path: '/about',
  },
  '/showcase': {
    title: 'Showcase | Muhammad Daffa Ramadhan',
    description: 'Showcase produk dan demo aplikasi yang dikembangkan oleh Muhammad Daffa Ramadhan.',
    path: '/showcase',
  },
  '/contact': {
    title: 'Contact | Muhammad Daffa Ramadhan',
    description: 'Hubungi Muhammad Daffa Ramadhan untuk diskusi kebutuhan proyek backend dan peluang kolaborasi.',
    path: '/contact',
  },
  '/my-notes': {
    title: 'My Notes | Muhammad Daffa Ramadhan',
    description: 'Artikel teknis dan catatan pengembangan software oleh Muhammad Daffa Ramadhan.',
    path: '/my-notes',
  },
};

const getSeoConfig = (pathname: string): SeoConfig => {
  if (pathname === '/') {
    return HOME_SEO;
  }

  if (pathname.startsWith('/my-notes/')) {
    return {
      ...SEO_CONFIG['/my-notes'],
      path: pathname,
    };
  }

  if (pathname.startsWith('/showcase/')) {
    return {
      ...SEO_CONFIG['/showcase'],
      path: pathname,
    };
  }

  return SEO_CONFIG[pathname] ?? {
    title: 'Page Not Found | Muhammad Daffa Ramadhan',
    description: 'Halaman yang Anda cari tidak ditemukan di website Muhammad Daffa Ramadhan.',
    path: pathname,
    noindex: true,
  };
};

const upsertMeta = (selector: string, attr: 'name' | 'property', key: string, content: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

const upsertLink = (rel: string, href: string) => {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
};

const upsertJsonLd = (id: string, schemaObject: object) => {
  let element = document.getElementById(id) as HTMLScriptElement | null;
  if (!element) {
    element = document.createElement('script');
    element.type = 'application/ld+json';
    element.id = id;
    document.head.appendChild(element);
  }
  element.textContent = JSON.stringify(schemaObject);
};

const removeElementById = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.remove();
  }
};

const buildPersonProfileSchema = (siteUrl: string) => {
  const personId = `${siteUrl}/#person`;
  const profilePageId = `${siteUrl}/#profilepage`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': personId,
        name: PERSON_NAME,
        alternateName: ['Daffa Ramadhan', 'Daf Dev'],
        url: `${siteUrl}/`,
        image: `${siteUrl}${DEFAULT_IMAGE_PATH}`,
        jobTitle: 'Backend Developer',
        description: PERSON_DESCRIPTION,
        knowsAbout: ['Golang', 'PostgreSQL', 'REST API', 'gRPC', 'Backend Development'],
        sameAs: ['https://github.com/daffarmd', 'https://www.linkedin.com/in/muhammaddaffaramadhan/'],
        mainEntityOfPage: {
          '@id': profilePageId,
        },
      },
      {
        '@type': 'ProfilePage',
        '@id': profilePageId,
        url: `${siteUrl}/`,
        name: 'Home | Muhammad Daffa Ramadhan',
        inLanguage: 'id-ID',
        mainEntity: {
          '@id': personId,
        },
      },
    ],
  };
};

const SeoManager = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const siteUrl = SITE_URL.replace(/\/$/, '');
    const seo = getSeoConfig(pathname);
    const canonicalUrl = `${siteUrl}${seo.path}`;
    const ogImageUrl = `${siteUrl}${DEFAULT_IMAGE_PATH}`;
    const robotsContent = seo.noindex
      ? 'noindex, follow, max-image-preview:large'
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

    document.title = seo.title;

    upsertMeta('meta[name="description"]', 'name', 'description', seo.description);
    upsertMeta('meta[name="robots"]', 'name', 'robots', robotsContent);

    upsertLink('canonical', canonicalUrl);

    upsertMeta('meta[property="og:type"]', 'property', 'og:type', 'website');
    upsertMeta('meta[property="og:title"]', 'property', 'og:title', seo.title);
    upsertMeta('meta[property="og:description"]', 'property', 'og:description', seo.description);
    upsertMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    upsertMeta('meta[property="og:image"]', 'property', 'og:image', ogImageUrl);

    upsertMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', seo.title);
    upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', seo.description);
    upsertMeta('meta[name="twitter:image"]', 'name', 'twitter:image', ogImageUrl);

    if (seo.schema === 'person-profile') {
      upsertJsonLd('person-profile-schema', buildPersonProfileSchema(siteUrl));
    } else {
      removeElementById('person-profile-schema');
    }
  }, [pathname]);

  return null;
};

export default SeoManager;
