export interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile';
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  keywords?: string[];
  lang?: 'en' | 'es' | 'ca';
  alternateUrls?: Record<'en' | 'es' | 'ca', string>;
}

export interface PersonSchema {
  name: string;
  jobTitle: string;
  url: string;
  sameAs: string[];
  description: string;
  image: string;
  email?: string;
  address?: {
    locality: string;
    country: string;
  };
}

export interface ArticleSchema {
  headline: string;
  description: string;
  author: PersonSchema;
  datePublished: string;
  dateModified?: string;
  image: string;
  url: string;
  publisher: {
    name: string;
    logo: string;
  };
}

export interface WebSiteSchema {
  name: string;
  url: string;
  description: string;
}

export interface MetaTag {
  name?: string;
  property?: string;
  content: string;
}

export interface LinkTag {
  rel: string;
  href: string;
  hreflang?: string;
}

const SITE_BASE = '/Portfolio';
const SITE_URL = 'https://rrocap.github.io';

export function getCanonicalUrl(pathname: string, base?: string): string {
  const siteBase = base || SITE_BASE;
  const cleanPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${SITE_URL}${siteBase}${cleanPath}`;
}

export function generateMetaTags(props: SEOProps): MetaTag[] {
  const tags: MetaTag[] = [];
  
  // Basic meta tags
  tags.push({ name: 'description', content: props.description });
  
  if (props.keywords?.length) {
    tags.push({ name: 'keywords', content: props.keywords.join(', ') });
  }
  
  if (props.author) {
    tags.push({ name: 'author', content: props.author });
  }
  
  // Open Graph tags
  tags.push({ property: 'og:title', content: props.title });
  tags.push({ property: 'og:description', content: props.description });
  tags.push({ property: 'og:type', content: props.ogType || 'website' });
  
  const canonical = props.canonical || '';
  tags.push({ property: 'og:url', content: getCanonicalUrl(canonical) });
  
  if (props.ogImage) {
    const imageUrl = props.ogImage.startsWith('http') 
      ? props.ogImage 
      : `${SITE_URL}${SITE_BASE}${props.ogImage}`;
    tags.push({ property: 'og:image', content: imageUrl });
  }
  
  if (props.publishedTime) {
    tags.push({ property: 'article:published_time', content: props.publishedTime });
  }
  
  if (props.modifiedTime) {
    tags.push({ property: 'article:modified_time', content: props.modifiedTime });
  }
  
  // Twitter Card tags
  tags.push({ name: 'twitter:card', content: props.twitterCard || 'summary_large_image' });
  tags.push({ name: 'twitter:title', content: props.title });
  tags.push({ name: 'twitter:description', content: props.description });
  
  if (props.ogImage) {
    const imageUrl = props.ogImage.startsWith('http') 
      ? props.ogImage 
      : `${SITE_URL}${SITE_BASE}${props.ogImage}`;
    tags.push({ name: 'twitter:image', content: imageUrl });
  }
  
  return tags;
}

export function generateHreflangTags(langs: string[], currentPath: string): LinkTag[] {
  const tags: LinkTag[] = [];
  
  langs.forEach(lang => {
    const path = currentPath.replace(/^\/(en|es|ca)/, `/${lang}`);
    tags.push({ 
      rel: 'alternate', 
      hreflang: lang, 
      href: getCanonicalUrl(path) 
    });
  });
  
  // Add x-default (fallback to English)
  const defaultPath = currentPath.replace(/^\/(en|es|ca)/, '/en');
  tags.push({ 
    rel: 'alternate', 
    hreflang: 'x-default', 
    href: getCanonicalUrl(defaultPath) 
  });
  
  return tags;
}

export function generateJSONLD(data: PersonSchema | WebSiteSchema): string {
  let schema: any;
  
  if ('jobTitle' in data) {
    // PersonSchema
    schema = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": data.name,
      "jobTitle": data.jobTitle,
      "url": data.url,
      "sameAs": data.sameAs,
      "description": data.description,
      "image": data.image.startsWith('http') 
        ? data.image 
        : `${SITE_URL}${SITE_BASE}${data.image}`,
      ...(data.email && { "email": data.email }),
      ...(data.address && { 
        "address": {
          "@type": "PostalAddress",
          "addressLocality": data.address.locality,
          "addressCountry": data.address.country
        }
      })
    };
  } else {
    // WebSiteSchema
    schema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": data.name,
      "url": getCanonicalUrl(data.url),
      "description": data.description,
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${getCanonicalUrl('/en/search')}?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    };
  }
  
  return JSON.stringify(schema, null, 0);
}