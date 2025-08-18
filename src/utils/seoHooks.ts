/**
 * SEO Hooks and Automation Utilities
 * 
 * Provides automated SEO optimizations, content analysis, and validation
 * for the Astro portfolio site.
 */

import type { SEOConfig, PersonSchema, ArticleSchema } from './seoManager';
import { seoManager } from './seoManager';

export interface ContentAnalysis {
  readingTime: number;
  wordCount: number;
  headingStructure: Array<{ level: number; text: string; id?: string }>;
  keywords: string[];
  readabilityScore: number;
  seoScore: number;
  suggestions: string[];
  images: Array<{ src: string; alt?: string; title?: string }>;
  links: Array<{ href: string; text: string; external: boolean }>;
}

export interface SEOAudit {
  score: number;
  issues: Array<{
    severity: 'error' | 'warning' | 'info';
    message: string;
    fix?: string;
  }>;
  performance: {
    metaTagsOptimized: boolean;
    structuredDataValid: boolean;
    imageSeoOptimized: boolean;
    linkStructureValid: boolean;
  };
}

export class SEOHooks {
  private stopWords = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
    'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
    'to', 'was', 'will', 'with', 'the', 'this', 'but', 'they', 'have',
    'had', 'what', 'said', 'each', 'which', 'their', 'time', 'if'
  ]);

  /**
   * Auto-generate SEO config from page content
   */
  generateSEOFromContent(content: string, url: string, lang: 'en' | 'es' | 'ca'): SEOConfig {
    const analysis = this.analyzeContent(content);
    const title = this.extractTitle(content) || this.generateTitleFromKeywords(analysis.keywords);
    const description = this.generateDescription(content, analysis.keywords);
    
    return {
      title,
      description,
      lang,
      canonical: seoManager.generateCanonicalUrl(url, lang),
      keywords: analysis.keywords.slice(0, 8),
      type: this.detectContentType(content),
      changefreq: this.determineChangeFrequency(content),
      priority: this.calculatePriority(url, analysis)
    };
  }

  /**
   * Comprehensive content analysis for SEO optimization
   */
  analyzeContent(content: string): ContentAnalysis {
    const text = this.stripHtmlTags(content);
    const words = text.toLowerCase().split(/\s+/).filter(word => word.length > 2);
    const wordCount = words.length;
    const readingTime = Math.ceil(wordCount / 200); // Average reading speed
    
    // Extract headings
    const headingMatches = content.match(/<h([1-6])[^>]*>(.*?)<\/h[1-6]>/gi) || [];
    const headingStructure = headingMatches.map(match => {
      const levelMatch = match.match(/<h([1-6])/i);
      const textMatch = match.match(/>(.*?)<\/h[1-6]>/i);
      const idMatch = match.match(/id=["']([^"']*)/);
      
      return {
        level: levelMatch ? parseInt(levelMatch[1]) : 1,
        text: textMatch ? this.stripHtmlTags(textMatch[1]).trim() : '',
        id: idMatch ? idMatch[1] : undefined
      };
    });

    // Extract keywords using simple frequency analysis
    const keywords = this.extractKeywords(words);

    // Calculate readability (simplified Flesch score)
    const sentences = text.split(/[.!?]+/).length;
    const avgWordsPerSentence = wordCount / Math.max(sentences, 1);
    const avgSyllables = this.estimateAverageSyllables(words);
    const readabilityScore = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllables;

    // Extract images
    const imageMatches = content.match(/<img[^>]+>/gi) || [];
    const images = imageMatches.map(match => {
      const srcMatch = match.match(/src=["']([^"']*)/);
      const altMatch = match.match(/alt=["']([^"']*)/);
      const titleMatch = match.match(/title=["']([^"']*)/);
      
      return {
        src: srcMatch ? srcMatch[1] : '',
        alt: altMatch ? altMatch[1] : undefined,
        title: titleMatch ? titleMatch[1] : undefined
      };
    });

    // Extract links
    const linkMatches = content.match(/<a[^>]+href=["']([^"']*)[^>]*>(.*?)<\/a>/gi) || [];
    const links = linkMatches.map(match => {
      const hrefMatch = match.match(/href=["']([^"']*)/);
      const textMatch = match.match(/>(.*?)<\/a>/);
      const href = hrefMatch ? hrefMatch[1] : '';
      
      return {
        href,
        text: textMatch ? this.stripHtmlTags(textMatch[1]).trim() : '',
        external: href.startsWith('http') && !href.includes('rrocap.github.io')
      };
    });

    const seoScore = this.calculateSEOScore({
      wordCount,
      headingStructure,
      keywords,
      images,
      links,
      readabilityScore
    });

    const suggestions = this.generateSEOSuggestions({
      wordCount,
      headingStructure,
      keywords,
      images,
      links,
      readabilityScore,
      seoScore
    });

    return {
      readingTime,
      wordCount,
      headingStructure,
      keywords,
      readabilityScore: Math.max(0, Math.min(100, readabilityScore)),
      seoScore,
      suggestions,
      images,
      links
    };
  }

  /**
   * Audit SEO implementation for a page
   */
  auditSEO(html: string, config: SEOConfig): SEOAudit {
    const issues: SEOAudit['issues'] = [];
    let score = 100;

    // Check title
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    if (!titleMatch || titleMatch[1].length < 10 || titleMatch[1].length > 60) {
      issues.push({
        severity: 'error',
        message: 'Title should be between 10-60 characters',
        fix: 'Optimize title length for better search engine visibility'
      });
      score -= 15;
    }

    // Check meta description
    const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)/i);
    if (!descMatch || descMatch[1].length < 50 || descMatch[1].length > 160) {
      issues.push({
        severity: 'error',
        message: 'Meta description should be between 50-160 characters',
        fix: 'Write compelling description that summarizes page content'
      });
      score -= 15;
    }

    // Check canonical URL
    const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)/i);
    if (!canonicalMatch) {
      issues.push({
        severity: 'warning',
        message: 'Missing canonical URL',
        fix: 'Add canonical link to prevent duplicate content issues'
      });
      score -= 10;
    }

    // Check hreflang tags
    const hreflangMatches = html.match(/<link[^>]+hreflang=/gi) || [];
    if (hreflangMatches.length < 3) { // Expecting en, es, ca + x-default
      issues.push({
        severity: 'warning',
        message: 'Incomplete hreflang implementation',
        fix: 'Add hreflang tags for all supported languages'
      });
      score -= 8;
    }

    // Check structured data
    const jsonLdMatches = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>(.*?)<\/script>/gis) || [];
    let structuredDataValid = true;
    try {
      jsonLdMatches.forEach(match => {
        const jsonMatch = match.match(/>(.*?)<\/script>/is);
        if (jsonMatch) {
          JSON.parse(jsonMatch[1]);
        }
      });
    } catch {
      structuredDataValid = false;
      issues.push({
        severity: 'error',
        message: 'Invalid structured data JSON-LD',
        fix: 'Validate and fix JSON-LD syntax'
      });
      score -= 12;
    }

    // Check Open Graph tags
    const ogTitleMatch = html.match(/<meta[^>]+property=["']og:title["']/i);
    const ogDescMatch = html.match(/<meta[^>]+property=["']og:description["']/i);
    const ogImageMatch = html.match(/<meta[^>]+property=["']og:image["']/i);
    
    if (!ogTitleMatch || !ogDescMatch || !ogImageMatch) {
      issues.push({
        severity: 'warning',
        message: 'Incomplete Open Graph tags',
        fix: 'Add all required Open Graph meta tags for social sharing'
      });
      score -= 8;
    }

    // Check images for alt text
    const imgMatches = html.match(/<img[^>]*>/gi) || [];
    const imagesWithoutAlt = imgMatches.filter(img => !img.includes('alt='));
    if (imagesWithoutAlt.length > 0) {
      issues.push({
        severity: 'warning',
        message: `${imagesWithoutAlt.length} images missing alt text`,
        fix: 'Add descriptive alt text to all images for accessibility and SEO'
      });
      score -= Math.min(10, imagesWithoutAlt.length * 2);
    }

    // Check heading structure
    const headings = html.match(/<h[1-6][^>]*>/gi) || [];
    const h1Count = headings.filter(h => h.startsWith('<h1')).length;
    if (h1Count !== 1) {
      issues.push({
        severity: h1Count === 0 ? 'error' : 'warning',
        message: h1Count === 0 ? 'Missing H1 tag' : 'Multiple H1 tags found',
        fix: 'Use exactly one H1 tag per page for proper heading hierarchy'
      });
      score -= h1Count === 0 ? 15 : 8;
    }

    const performance = {
      metaTagsOptimized: !issues.some(i => i.message.includes('title') || i.message.includes('description')),
      structuredDataValid,
      imageSeoOptimized: imagesWithoutAlt.length === 0,
      linkStructureValid: canonicalMatch !== null && hreflangMatches.length >= 3
    };

    return {
      score: Math.max(0, score),
      issues,
      performance
    };
  }

  /**
   * Generate research article schema from publication data
   */
  generateResearchArticleSchema(publication: any): ArticleSchema {
    return {
      headline: publication.title,
      description: publication.abstract || publication.description || '',
      author: seoManager.defaultAuthor,
      datePublished: publication.date || new Date().toISOString(),
      dateModified: publication.updatedDate || publication.date || new Date().toISOString(),
      url: `https://rrocap.github.io/Portfolio/en/research/${publication.slug}`,
      image: publication.image || 'https://rrocap.github.io/Portfolio/research-default.jpg',
      keywords: publication.tags || publication.keywords || [],
      articleSection: 'Research',
      wordCount: publication.wordCount,
      inLanguage: 'en'
    };
  }

  /**
   * Generate meta tags for social media optimization
   */
  generateSocialMetaTags(config: SEOConfig): string {
    const twitterHandle = '@ramonrocapinilla'; // Can be made configurable
    
    return `
    <!-- Social Media Optimization -->
    <meta name="twitter:site" content="${twitterHandle}" />
    <meta name="twitter:creator" content="${twitterHandle}" />
    <meta property="og:site_name" content="Ramon Roca Pinilla Portfolio" />
    <meta property="og:locale" content="${this.getLocaleFromLang(config.lang)}" />
    ${config.type === 'article' ? `
    <meta property="article:author" content="Ramon Roca Pinilla" />
    <meta property="article:publisher" content="Ramon Roca Pinilla" />
    ` : ''}
    `;
  }

  // Private helper methods
  private stripHtmlTags(html: string): string {
    return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  private extractTitle(content: string): string | null {
    const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/i);
    if (h1Match) {
      return this.stripHtmlTags(h1Match[1]).trim();
    }
    
    const titleMatch = content.match(/<title>(.*?)<\/title>/i);
    if (titleMatch) {
      return this.stripHtmlTags(titleMatch[1]).trim();
    }
    
    return null;
  }

  private generateTitleFromKeywords(keywords: string[]): string {
    if (keywords.length === 0) return 'Ramon Roca Pinilla - Biomedical Engineer';
    
    const topKeywords = keywords.slice(0, 3);
    return `${topKeywords.join(', ')} | Ramon Roca Pinilla`;
  }

  private generateDescription(content: string, keywords: string[]): string {
    const text = this.stripHtmlTags(content);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
    
    if (sentences.length > 0) {
      let description = sentences[0].trim();
      if (description.length < 100 && sentences.length > 1) {
        description += '. ' + sentences[1].trim();
      }
      
      // Truncate to 160 characters
      if (description.length > 160) {
        description = description.substring(0, 157) + '...';
      }
      
      return description;
    }
    
    return `Learn about ${keywords.slice(0, 2).join(' and ')} from biomedical engineer Ramon Roca Pinilla.`;
  }

  private extractKeywords(words: string[]): string[] {
    const wordFreq = new Map<string, number>();
    
    words
      .filter(word => !this.stopWords.has(word) && word.length > 3)
      .forEach(word => {
        wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
      });
    
    return Array.from(wordFreq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(entry => entry[0]);
  }

  private estimateAverageSyllables(words: string[]): number {
    if (words.length === 0) return 1;
    
    const totalSyllables = words.reduce((sum, word) => {
      // Simple syllable estimation
      const vowels = word.match(/[aeiouy]+/gi);
      const syllableCount = vowels ? vowels.length : 1;
      return sum + Math.max(1, syllableCount);
    }, 0);
    
    return totalSyllables / words.length;
  }

  private detectContentType(content: string): 'website' | 'article' | 'profile' {
    if (content.includes('research') || content.includes('publication') || content.includes('article')) {
      return 'article';
    }
    if (content.includes('about') || content.includes('bio') || content.includes('profile')) {
      return 'profile';
    }
    return 'website';
  }

  private determineChangeFrequency(content: string): 'monthly' | 'weekly' | 'yearly' {
    if (content.includes('blog') || content.includes('news') || content.includes('update')) {
      return 'weekly';
    }
    if (content.includes('research') || content.includes('publication')) {
      return 'yearly';
    }
    return 'monthly';
  }

  private calculatePriority(url: string, analysis: ContentAnalysis): number {
    let priority = 0.5;
    
    // Home page gets highest priority
    if (url === '/' || url === '/en/' || url === '/es/' || url === '/ca/') {
      priority = 1.0;
    }
    // Research and main sections get high priority
    else if (url.includes('/research/') || url.includes('/about/')) {
      priority = 0.8;
    }
    // Adjust based on content quality
    else if (analysis.seoScore > 80) {
      priority += 0.2;
    }
    
    return Math.min(1.0, priority);
  }

  private calculateSEOScore(analysis: Partial<ContentAnalysis>): number {
    let score = 100;
    
    // Word count penalty/bonus
    if (analysis.wordCount && (analysis.wordCount < 300 || analysis.wordCount > 3000)) {
      score -= 10;
    }
    
    // Heading structure
    if (analysis.headingStructure) {
      const hasH1 = analysis.headingStructure.some(h => h.level === 1);
      if (!hasH1) score -= 15;
      
      if (analysis.headingStructure.length < 2) score -= 10;
    }
    
    // Keywords
    if (analysis.keywords && analysis.keywords.length < 5) {
      score -= 8;
    }
    
    // Images without alt text
    if (analysis.images) {
      const imagesWithoutAlt = analysis.images.filter(img => !img.alt);
      score -= imagesWithoutAlt.length * 3;
    }
    
    // Readability
    if (analysis.readabilityScore && analysis.readabilityScore < 60) {
      score -= 5;
    }
    
    return Math.max(0, score);
  }

  private generateSEOSuggestions(analysis: ContentAnalysis & { seoScore: number }): string[] {
    const suggestions: string[] = [];
    
    if (analysis.wordCount < 300) {
      suggestions.push('Add more content - aim for at least 300 words');
    }
    
    if (analysis.headingStructure.length < 2) {
      suggestions.push('Add more headings to improve content structure');
    }
    
    if (!analysis.headingStructure.some(h => h.level === 1)) {
      suggestions.push('Add an H1 heading for better SEO');
    }
    
    if (analysis.keywords.length < 5) {
      suggestions.push('Include more relevant keywords naturally in content');
    }
    
    const imagesWithoutAlt = analysis.images.filter(img => !img.alt);
    if (imagesWithoutAlt.length > 0) {
      suggestions.push(`Add alt text to ${imagesWithoutAlt.length} images`);
    }
    
    if (analysis.readabilityScore < 60) {
      suggestions.push('Improve readability with shorter sentences and simpler words');
    }
    
    if (analysis.links.filter(l => l.external).length === 0) {
      suggestions.push('Consider adding relevant external links to authoritative sources');
    }
    
    return suggestions;
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
export const seoHooks = new SEOHooks();

// Export utility functions
export const analyzePageContent = (content: string) => seoHooks.analyzeContent(content);
export const generateAutoSEO = (content: string, url: string, lang: 'en' | 'es' | 'ca') => 
  seoHooks.generateSEOFromContent(content, url, lang);
export const auditPageSEO = (html: string, config: SEOConfig) => seoHooks.auditSEO(html, config);