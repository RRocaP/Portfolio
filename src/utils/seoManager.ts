/**
 * SEO Manager - Comprehensive SEO utilities for Astro portfolio
 * 
 * Features:
 * - Dynamic meta tag generation
 * - Structured data (JSON-LD) management
 * - Open Graph and Twitter Card optimization
 * - Multilingual hreflang management
 * - Canonical URL handling
 * - Performance-optimized critical CSS inlining
 */

export interface SEOConfig {
  title: string;
  description: string;
  lang: 'en' | 'es' | 'ca';
  canonical?: string;
  type?: 'website' | 'article' | 'profile';
  image?: string;
  imageAlt?: string;
  keywords?: string[];
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  noindex?: boolean;
  nofollow?: boolean;
  priority?: number;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  breadcrumbs?: Array<{ name: string; url: string }>;
  schema?: Record<string, any>;
}

export interface PersonSchema {
  name: string;
  jobTitle: string;
  description: string;
  url: string;
  sameAs: string[];
  affiliation: {
    name: string;
    address: {
      addressLocality: string;
      addressCountry: string;
    };
  };
  alumniOf: Array<{
    name: string;
  }>;
  knowsAbout: string[];
  image?: string;
  email?: string;
}

export interface ArticleSchema {
  headline: string;
  description: string;
  author: PersonSchema;
  datePublished: string;
  dateModified?: string;
  url: string;
  image?: string;
  keywords?: string[];
  articleSection?: string;
  wordCount?: number;
  inLanguage: string;
}

export class SEOManager {
  private baseUrl: string;
  private basePath: string;
  private defaultImage: string;
  private defaultAuthor: PersonSchema;
  
  constructor() {
    this.baseUrl = (import.meta.env.SITE || 'https://rrocap.github.io').replace(/\/$/, '');
    this.basePath = (import.meta.env.BASE_URL || '/Portfolio').replace(/\/$/, '');
    this.defaultImage = `${this.baseUrl}${this.basePath}/profile.jpg`;
    this.defaultAuthor = {
      name: 'Ramon Roca Pinilla',
      jobTitle: 'Biomedical Engineer & Molecular Biologist',
      description: 'Biomedical engineer and molecular biologist developing next-generation antimicrobial therapies through AI-driven protein engineering',
      url: `${this.baseUrl}${this.basePath}/`,
      image: this.defaultImage,
      sameAs: [
        'https://www.linkedin.com/in/ramonrocapinilla/',
        'https://github.com/RRocaP',
        'https://orcid.org/0000-0002-7393-6200',
        'https://scholar.google.com/citations?hl=fr&user=jYIZGT0AAAAJ'
      ],
      affiliation: {
        name: "Children's Medical Research Institute",
        address: {
          addressLocality: 'Sydney',
          addressCountry: 'Australia'
        }
      },
      alumniOf: [
        { name: 'Universitat Autònoma de Barcelona' },
        { name: 'UC Irvine' }
      ],
      knowsAbout: [
        'Biomedical Engineering',
        'Molecular Biology',
        'Protein Engineering', 
        'Antimicrobial Development',
        'AI-driven Drug Discovery',
        'Vector Systems'
      ]
    };
  }

  /**
   * Generate canonical URL for a given path and language
   */
  generateCanonicalUrl(path: string, lang: string = 'en'): string {
    // Strip base path prefix if present, then strip language prefix
    const withoutBase = this.basePath && this.basePath !== '/'
      ? path.replace(new RegExp(`^${this.basePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/?`), '/')
      : path;
    const cleanPath = withoutBase.replace(/^\/(en|es|ca)\//, '/').replace(/^\//, '');
    return `${this.baseUrl}${this.basePath}/${lang}/${cleanPath}`;
  }

  /**
   * Generate hreflang links for multilingual support
   */
  generateHreflangLinks(path: string): Array<{ href: string; hreflang: string }> {
    // Strip base path prefix if present, then strip language prefix
    const withoutBase = this.basePath && this.basePath !== '/'
      ? path.replace(new RegExp(`^${this.basePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/?`), '/')
      : path;
    const cleanPath = withoutBase.replace(/^\/(en|es|ca)\//, '/').replace(/^\//, '');
    const languages = ['en', 'es', 'ca'] as const;
    
    return [
      ...languages.map(lang => ({
        href: `${this.basePath}/${lang}/${cleanPath}`,
        hreflang: lang
      })),
      {
        href: `${this.basePath}/en/${cleanPath}`,
        hreflang: 'x-default'
      }
    ];
  }

  /**
   * Generate basic meta tags
   */
  generateMetaTags(config: SEOConfig): string {
    const robots = config.noindex || config.nofollow 
      ? `${config.noindex ? 'noindex' : 'index'},${config.nofollow ? 'nofollow' : 'follow'}`
      : 'index,follow';

    const keywords = config.keywords?.join(', ') || '';
    
    return `
    <meta name="description" content="${this.escapeHtml(config.description)}" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="${robots}" />
    <meta name="theme-color" content="#0A0A0A" />
    ${keywords ? `<meta name="keywords" content="${this.escapeHtml(keywords)}" />` : ''}
    ${config.author ? `<meta name="author" content="${this.escapeHtml(config.author)}" />` : ''}
    <link rel="canonical" href="${config.canonical || this.generateCanonicalUrl('', config.lang)}" />
    `;
  }

  /**
   * Generate hreflang link tags
   */
  generateHreflangTags(path: string): string {
    const links = this.generateHreflangLinks(path);
    return links.map(link => 
      `<link rel="alternate" href="${link.href}" hreflang="${link.hreflang}" />`
    ).join('\n    ');
  }

  /**
   * Generate Open Graph meta tags
   */
  generateOpenGraphTags(config: SEOConfig): string {
    const ogImage = config.image || this.defaultImage;
    const ogUrl = config.canonical || this.generateCanonicalUrl('', config.lang);
    
    return `
    <meta property="og:type" content="${config.type || 'website'}" />
    <meta property="og:url" content="${ogUrl}" />
    <meta property="og:title" content="${this.escapeHtml(config.title)}" />
    <meta property="og:description" content="${this.escapeHtml(config.description)}" />
    <meta property="og:image" content="${ogImage}" />
    ${config.imageAlt ? `<meta property="og:image:alt" content="${this.escapeHtml(config.imageAlt)}" />` : ''}
    <meta property="og:locale" content="${this.getLocaleFromLang(config.lang)}" />
    ${config.publishedTime ? `<meta property="article:published_time" content="${config.publishedTime}" />` : ''}
    ${config.modifiedTime ? `<meta property="article:modified_time" content="${config.modifiedTime}" />` : ''}
    ${config.section ? `<meta property="article:section" content="${config.section}" />` : ''}
    ${config.tags?.map(tag => `<meta property="article:tag" content="${this.escapeHtml(tag)}" />`).join('\n    ') || ''}
    `;
  }

  /**
   * Generate Twitter Card meta tags
   */
  generateTwitterTags(config: SEOConfig): string {
    const twitterImage = config.image || this.defaultImage;
    const twitterUrl = config.canonical || this.generateCanonicalUrl('', config.lang);
    
    return `
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="${twitterUrl}" />
    <meta property="twitter:title" content="${this.escapeHtml(config.title)}" />
    <meta property="twitter:description" content="${this.escapeHtml(config.description)}" />
    <meta property="twitter:image" content="${twitterImage}" />
    ${config.imageAlt ? `<meta property="twitter:image:alt" content="${this.escapeHtml(config.imageAlt)}" />` : ''}
    `;
  }

  /**
   * Generate Person JSON-LD structured data
   */
  generatePersonSchema(person?: Partial<PersonSchema>): string {
    const personData = { ...this.defaultAuthor, ...person };
    
    const schema = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: personData.name,
      jobTitle: personData.jobTitle,
      description: personData.description,
      url: personData.url,
      image: personData.image,
      email: personData.email,
      sameAs: personData.sameAs,
      affiliation: {
        "@type": "Organization",
        name: personData.affiliation.name,
        address: {
          "@type": "PostalAddress",
          addressLocality: personData.affiliation.address.addressLocality,
          addressCountry: personData.affiliation.address.addressCountry
        }
      },
      alumniOf: personData.alumniOf.map(org => ({
        "@type": "EducationalOrganization",
        name: org.name
      })),
      knowsAbout: personData.knowsAbout
    };

    return `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
  }

  /**
   * Generate Website JSON-LD structured data
   */
  generateWebsiteSchema(config: SEOConfig): string {
    const schema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      url: `${this.baseUrl}${this.basePath}/`,
      name: config.title,
      inLanguage: config.lang,
      potentialAction: {
        "@type": "SearchAction",
        target: `${this.baseUrl}${this.basePath}/${config.lang}/?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    };

    return `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
  }

  /**
   * Generate Article JSON-LD structured data
   */
  generateArticleSchema(article: ArticleSchema): string {
    const schema = {
      "@context": "https://schema.org",
      "@type": "ScholarlyArticle",
      headline: article.headline,
      description: article.description,
      author: {
        "@type": "Person",
        name: article.author.name,
        url: article.author.url,
        sameAs: article.author.sameAs
      },
      datePublished: article.datePublished,
      dateModified: article.dateModified || article.datePublished,
      url: article.url,
      image: article.image,
      keywords: article.keywords,
      articleSection: article.articleSection,
      wordCount: article.wordCount,
      inLanguage: article.inLanguage,
      publisher: {
        "@type": "Person",
        name: article.author.name,
        url: article.author.url
      }
    };

    return `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
  }

  /**
   * Generate breadcrumb JSON-LD structured data
   */
  generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>): string {
    const schema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: crumb.url.startsWith('http') ? crumb.url : `${this.baseUrl}${this.basePath}${crumb.url}`
      }))
    };

    return `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
  }

  /**
   * Generate complete SEO head content
   */
  generateSEOHead(config: SEOConfig): string {
    const parts = [
      `<title>${this.escapeHtml(config.title)}</title>`,
      this.generateMetaTags(config),
      this.generateHreflangTags(config.canonical || ''),
      this.generateOpenGraphTags(config),
      this.generateTwitterTags(config),
      this.generatePersonSchema(),
      this.generateWebsiteSchema(config)
    ];

    if (config.breadcrumbs) {
      parts.push(this.generateBreadcrumbSchema(config.breadcrumbs));
    }

    if (config.schema) {
      parts.push(`<script type="application/ld+json">\n${JSON.stringify(config.schema, null, 2)}\n</script>`);
    }

    return parts.join('\n');
  }

  /**
   * Generate sitemap entry data
   */
  generateSitemapEntry(config: SEOConfig): {
    loc: string;
    lastmod?: string;
    changefreq?: string;
    priority?: number;
  } {
    return {
      loc: config.canonical || this.generateCanonicalUrl('', config.lang),
      lastmod: config.modifiedTime || new Date().toISOString().split('T')[0],
      changefreq: config.changefreq || 'monthly',
      priority: config.priority || 0.8
    };
  }

  /**
   * Validate SEO configuration
   */
  validateSEOConfig(config: SEOConfig): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!config.title || config.title.length < 10 || config.title.length > 60) {
      errors.push('Title must be between 10-60 characters');
    }

    if (!config.description || config.description.length < 50 || config.description.length > 160) {
      errors.push('Description must be between 50-160 characters');
    }

    if (config.keywords && config.keywords.length > 10) {
      errors.push('Maximum 10 keywords recommended');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Generate performance-critical CSS for above-the-fold content
   */
  generateCriticalCSS(): string {
    return `
      /* Critical SEO & Performance CSS */
      :root{
        --catalan-red:#DA291C;--catalan-yellow:#FFD93D;
        --primary:#F5F5F5;--background:#0A0A0A;
        --font-primary:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;
        --font-display:'Outfit',-apple-system,BlinkMacSystemFont,sans-serif;
      }
      *{margin:0;padding:0;box-sizing:border-box}
      html{scroll-behavior:smooth}
      body{
        font-family:var(--font-primary);
        color:var(--primary);
        background-color:var(--background);
        font-size:clamp(16px,2vw,18px);
        -webkit-font-smoothing:antialiased;
        -moz-osx-font-smoothing:grayscale;
      }
      .skip-link{
        position:absolute;
        top:-40px;
        left:6px;
        background:var(--catalan-red);
        color:white;
        padding:8px;
        text-decoration:none;
        border-radius:4px;
        z-index:1000;
      }
      .skip-link:focus{top:6px}
      h1,h2,h3{
        font-family:var(--font-display);
        font-weight:700;
        line-height:1.15;
        letter-spacing:-0.01em;
      }
      @media(prefers-reduced-motion:reduce){
        *{animation-duration:0.01ms!important;transition-duration:0.01ms!important}
        html{scroll-behavior:auto}
      }
    `;
  }

  // Private helper methods
  private escapeHtml(text: string): string {
    const div = typeof document !== 'undefined' 
      ? document.createElement('div') 
      : { textContent: '', innerHTML: '' };
    
    if (typeof document !== 'undefined') {
      div.textContent = text;
      return div.innerHTML;
    }
    
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  private getLocaleFromLang(lang: string): string {
    const localeMap = {
      'en': 'en_US',
      'es': 'es_ES', 
      'ca': 'ca_ES'
    };
    return localeMap[lang as keyof typeof localeMap] || 'en_US';
  }
}

// Export singleton instance
export const seoManager = new SEOManager();

// Export utility functions for common use cases
export const generatePageSEO = (config: SEOConfig) => seoManager.generateSEOHead(config);
export const generateCanonical = (path: string, lang: string) => seoManager.generateCanonicalUrl(path, lang);
export const generateHreflang = (path: string) => seoManager.generateHreflangLinks(path);
export const validateSEO = (config: SEOConfig) => seoManager.validateSEOConfig(config);