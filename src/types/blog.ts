// Blog system type definitions
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  content: string;
  author: Author;
  publishedDate: Date;
  updatedDate?: Date;
  coverImage?: string;
  readingTime: number; // in minutes
  categories: Category[];
  tags: Tag[];
  featured: boolean;
  published: boolean;
  lang: 'en' | 'es' | 'ca';
  relatedPosts?: string[]; // Array of post IDs
  toc?: TableOfContentsItem[]; // Table of contents
  seo?: SEOMetadata;
}

export interface Author {
  name: string;
  bio: string;
  avatar: string;
  social: {
    website?: string;
    twitter?: string;
    linkedin?: string;
    github?: string;
    orcid?: string;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string; // Hex color for theming
  icon?: string; // Optional icon class or SVG
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  count?: number; // Number of posts with this tag
}

export interface TableOfContentsItem {
  id: string;
  title: string;
  level: number; // 1-6 for h1-h6
  children?: TableOfContentsItem[];
}

export interface SEOMetadata {
  canonicalUrl?: string;
  noindex?: boolean;
  ogImage?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  keywords?: string[];
}

export interface BlogArchive {
  year: number;
  months: {
    month: number;
    monthName: string;
    posts: BlogPost[];
  }[];
}

export interface BlogStats {
  totalPosts: number;
  totalCategories: number;
  totalTags: number;
  averageReadingTime: number;
  postsPerMonth: { [key: string]: number };
  mostPopularTags: Tag[];
  mostPopularCategories: Category[];
}

export interface BlogSearchResult {
  post: BlogPost;
  matches: {
    field: 'title' | 'description' | 'content' | 'tags' | 'categories';
    snippet: string;
    score: number;
  }[];
}

export interface BlogFilters {
  categories?: string[];
  tags?: string[];
  authors?: string[];
  dateFrom?: Date;
  dateTo?: Date;
  featured?: boolean;
  lang?: 'en' | 'es' | 'ca';
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNext: boolean;
  hasPrev: boolean;
  nextPage?: number;
  prevPage?: number;
}

export interface BlogListProps {
  posts: BlogPost[];
  pagination?: PaginationData;
  filters?: BlogFilters;
  title?: string;
  description?: string;
  showFilters?: boolean;
  showSearch?: boolean;
  featuredFirst?: boolean;
}

export interface RSSItem {
  title: string;
  description: string;
  pubDate: string;
  link: string;
  guid: string;
  categories: string[];
  author: string;
  enclosure?: {
    url: string;
    type: string;
    length: string;
  };
}