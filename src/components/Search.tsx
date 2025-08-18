import { useState, useEffect, useMemo } from 'react';
import { publications } from '../data/publications.js';
import { projects, type Project } from '../data/projects.ts';
import type { Lang } from '../data/i18n.ts';
import { getApiEndpoint, isFeatureEnabled } from '../utils/featureFlags';

interface SearchableItem {
  id: string;
  title: string;
  description: string;
  year: string | number;
  type: 'publication' | 'project';
  url?: string;
  technologies?: string[];
  journal?: string;
  category?: string;
  featured?: boolean;
}

interface SearchProps {
  lang: Lang;
  placeholder?: string;
  className?: string;
  maxResults?: number;
}

// Create searchable index from all content
const createSearchIndex = (): SearchableItem[] => {
  const searchablePublications: SearchableItem[] = publications.map((pub, index) => ({
    id: `pub-${index}`,
    title: pub.title,
    description: pub.title, // Use title as description for publications
    year: pub.year,
    type: 'publication' as const,
    url: pub.url,
    journal: pub.journal,
    featured: pub.featured
  }));

  const searchableProjects: SearchableItem[] = projects.map((project) => ({
    id: `project-${project.id}`,
    title: project.title,
    description: project.description,
    year: project.year,
    type: 'project' as const,
    url: project.links.demo || project.links.paper || project.links.github,
    technologies: project.technologies,
    category: project.category,
    featured: project.featured
  }));

  return [...searchablePublications, ...searchableProjects];
};

// Simple text search with relevance scoring
const searchItems = (items: SearchableItem[], query: string): SearchableItem[] => {
  if (!query.trim()) return [];
  
  const lowercaseQuery = query.toLowerCase();
  const terms = lowercaseQuery.split(' ').filter(term => term.length > 0);
  
  const scoredResults = items.map(item => {
    let score = 0;
    const searchText = [
      item.title,
      item.description,
      item.journal || '',
      item.category || '',
      ...(item.technologies || [])
    ].join(' ').toLowerCase();
    
    // Exact title match gets highest score
    if (item.title.toLowerCase().includes(lowercaseQuery)) {
      score += 100;
    }
    
    // Description match
    if (item.description.toLowerCase().includes(lowercaseQuery)) {
      score += 50;
    }
    
    // Individual term matches
    terms.forEach(term => {
      const termMatches = (searchText.match(new RegExp(term, 'g')) || []).length;
      score += termMatches * 10;
    });
    
    // Year match
    if (item.year.toString().includes(query)) {
      score += 25;
    }
    
    // Featured items get small boost
    if (item.featured) {
      score += 5;
    }
    
    // Recent items get small boost
    const currentYear = new Date().getFullYear();
    const yearDiff = currentYear - Number(item.year);
    if (yearDiff <= 3) {
      score += 3;
    }
    
    return { ...item, score };
  });
  
  return scoredResults
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);
};

// Translations for search interface
const getSearchTranslations = (lang: Lang) => ({
  placeholder: {
    en: 'Search publications, projects, technologies...',
    es: 'Buscar publicaciones, proyectos, tecnologías...',
    ca: 'Cercar publicacions, projectes, tecnologies...'
  }[lang],
  noResults: {
    en: 'No results found',
    es: 'No se encontraron resultados',
    ca: 'No s\'han trobat resultats'
  }[lang],
  publications: {
    en: 'Publications',
    es: 'Publicaciones', 
    ca: 'Publicacions'
  }[lang],
  projects: {
    en: 'Projects',
    es: 'Proyectos',
    ca: 'Projectes'
  }[lang]
});

export default function Search({ lang, placeholder, className = '', maxResults = 10 }: SearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [searchIndex] = useState(() => createSearchIndex());
  const [isSearching, setIsSearching] = useState(false);
  const [serverResults, setServerResults] = useState<SearchableItem[]>([]);
  
  const translations = getSearchTranslations(lang);
  
  // Perform search (server-side in dev, client-side in production)
  const performSearch = async (searchQuery: string): Promise<SearchableItem[]> => {
    if (!searchQuery.trim()) {
      return [];
    }

    if (isFeatureEnabled('enableDynamicSearch')) {
      // Use server-side search in development
      try {
        setIsSearching(true);
        const endpoint = getApiEndpoint('search');
        const response = await fetch(`${endpoint}?q=${encodeURIComponent(searchQuery)}&lang=${lang}&maxResults=${maxResults}`);
        
        if (response.ok) {
          const data = await response.json();
          return data.results || [];
        } else {
          console.warn('Server search failed, falling back to client-side search');
          return searchItems(searchIndex, searchQuery).slice(0, maxResults);
        }
      } catch (error) {
        console.warn('Server search error, falling back to client-side search:', error);
        return searchItems(searchIndex, searchQuery).slice(0, maxResults);
      } finally {
        setIsSearching(false);
      }
    } else {
      // Use client-side search in production
      return searchItems(searchIndex, searchQuery).slice(0, maxResults);
    }
  };

  // Results computation with both server and client search support
  const results = useMemo(() => {
    if (isFeatureEnabled('enableDynamicSearch')) {
      return serverResults;
    } else {
      return searchItems(searchIndex, query).slice(0, maxResults);
    }
  }, [searchIndex, query, maxResults, serverResults]);

  // Handle search query changes
  useEffect(() => {
    if (isFeatureEnabled('enableDynamicSearch') && query.trim()) {
      const debounceTimeout = setTimeout(() => {
        performSearch(query).then(setServerResults);
      }, 300); // Debounce server requests
      
      return () => clearTimeout(debounceTimeout);
    }
  }, [query]);
  
  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.search-container')) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(value.length > 0);
  };
  
  const handleResultClick = () => {
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div className={`search-container relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.length > 0 && setIsOpen(true)}
          placeholder={placeholder || translations.placeholder}
          className="w-full px-4 py-3 pl-10 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
        />
        
        {/* Search Icon / Loading Spinner */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isSearching ? (
            <svg className="animate-spin h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>
        
        {/* Clear Button */}
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      {/* Search Results */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl z-50 max-h-80 overflow-y-auto">
          {results.length > 0 ? (
            <div className="py-2">
              {results.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  onClick={handleResultClick}
                  className="block px-4 py-3 hover:bg-gray-800 transition-colors border-b border-gray-800 last:border-b-0"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          item.type === 'publication' 
                            ? 'bg-blue-900 text-blue-300' 
                            : 'bg-green-900 text-green-300'
                        }`}>
                          {item.type === 'publication' ? translations.publications : translations.projects}
                        </span>
                        {item.featured && (
                          <span className="px-2 py-1 text-xs bg-red-900 text-red-300 rounded-full">
                            Featured
                          </span>
                        )}
                      </div>
                      <h3 className="text-white font-medium text-sm leading-tight mb-1 line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-400 text-xs line-clamp-2 mb-1">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{item.year}</span>
                        {item.journal && <span>" {item.journal}</span>}
                        {item.category && <span>" {item.category}</span>}
                      </div>
                      {item.technologies && item.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.technologies.slice(0, 3).map((tech, index) => (
                            <span key={index} className="px-2 py-1 text-xs bg-gray-800 text-gray-300 rounded">
                              {tech}
                            </span>
                          ))}
                          {item.technologies.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{item.technologies.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="px-4 py-8 text-center text-gray-400">
              <svg className="mx-auto h-12 w-12 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.518-.858-6.166-2.292C7.229 11.258 9.516 10 12 10s4.771 1.258 6.166 2.708A11.042 11.042 0 0112 15z" />
              </svg>
              <p className="text-sm">{translations.noResults}</p>
              <p className="text-xs text-gray-500 mt-1">Try searching for publications, projects, or technologies</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}