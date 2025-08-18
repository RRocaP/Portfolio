import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import BlogCard from './BlogCard';
import Search from './Search';
import type { BlogPost, BlogListProps, BlogFilters, PaginationData } from '../types/blog';
import { categories, tags } from '../data/blog';

interface ExtendedBlogListProps extends BlogListProps {
  onPostClick?: (post: BlogPost) => void;
}

const BlogList: React.FC<ExtendedBlogListProps> = ({
  posts,
  pagination,
  filters = {},
  title = 'Latest Posts',
  description = 'Discover insights from biomedical research and protein engineering',
  showFilters = true,
  showSearch = true,
  featuredFirst = true,
  onPostClick
}) => {
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(posts);
  const [activeFilters, setActiveFilters] = useState<BlogFilters>(filters);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'readingTime'>('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState<boolean>(false);

  const listRef = useRef<HTMLDivElement>(null);
  const filterMenuRef = useRef<HTMLDivElement>(null);

  // Filter and sort posts
  useEffect(() => {
    let filtered = [...posts];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        post.categories.some(cat => cat.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply category filters
    if (activeFilters.categories && activeFilters.categories.length > 0) {
      filtered = filtered.filter(post =>
        post.categories.some(cat => activeFilters.categories!.includes(cat.slug))
      );
    }

    // Apply tag filters
    if (activeFilters.tags && activeFilters.tags.length > 0) {
      filtered = filtered.filter(post =>
        post.tags.some(tag => activeFilters.tags!.includes(tag.slug))
      );
    }

    // Apply featured filter
    if (activeFilters.featured !== undefined) {
      filtered = filtered.filter(post => post.featured === activeFilters.featured);
    }

    // Apply date range filters
    if (activeFilters.dateFrom) {
      filtered = filtered.filter(post => post.publishedDate >= activeFilters.dateFrom!);
    }
    if (activeFilters.dateTo) {
      filtered = filtered.filter(post => post.publishedDate <= activeFilters.dateTo!);
    }

    // Sort posts
    filtered.sort((a, b) => {
      if (featuredFirst) {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
      }

      switch (sortBy) {
        case 'date':
          return b.publishedDate.getTime() - a.publishedDate.getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'readingTime':
          return a.readingTime - b.readingTime;
        default:
          return 0;
      }
    });

    setFilteredPosts(filtered);
  }, [posts, searchQuery, activeFilters, sortBy, featuredFirst]);

  // Animate filter menu
  useEffect(() => {
    if (filterMenuRef.current) {
      if (isFilterMenuOpen) {
        gsap.fromTo(filterMenuRef.current,
          { opacity: 0, height: 0 },
          { opacity: 1, height: 'auto', duration: 0.3, ease: 'power2.out' }
        );
      } else {
        gsap.to(filterMenuRef.current, {
          opacity: 0,
          height: 0,
          duration: 0.3,
          ease: 'power2.in'
        });
      }
    }
  }, [isFilterMenuOpen]);

  // Handle filter changes
  const handleCategoryFilter = (categorySlug: string) => {
    const currentCategories = activeFilters.categories || [];
    const newCategories = currentCategories.includes(categorySlug)
      ? currentCategories.filter(c => c !== categorySlug)
      : [...currentCategories, categorySlug];
    
    setActiveFilters(prev => ({
      ...prev,
      categories: newCategories.length > 0 ? newCategories : undefined
    }));
  };

  const handleTagFilter = (tagSlug: string) => {
    const currentTags = activeFilters.tags || [];
    const newTags = currentTags.includes(tagSlug)
      ? currentTags.filter(t => t !== tagSlug)
      : [...currentTags, tagSlug];
    
    setActiveFilters(prev => ({
      ...prev,
      tags: newTags.length > 0 ? newTags : undefined
    }));
  };

  const clearFilters = () => {
    setActiveFilters({});
    setSearchQuery('');
  };

  // Calculate active filter count
  const activeFilterCount = 
    (activeFilters.categories?.length || 0) +
    (activeFilters.tags?.length || 0) +
    (activeFilters.featured !== undefined ? 1 : 0) +
    (searchQuery ? 1 : 0);

  return (
    <section className="blog-list" ref={listRef}>
      {/* Header */}
      <div className="blog-list__header">
        <div className="header-content">
          <h2 className="blog-list__title">{title}</h2>
          <p className="blog-list__description">{description}</p>
        </div>

        {/* Search and Controls */}
        <div className="blog-list__controls">
          {showSearch && (
            <div className="search-container">
              <Search
                placeholder="Search posts..."
                onSearch={setSearchQuery}
                className="blog-search"
              />
            </div>
          )}

          <div className="view-controls">
            <button
              onClick={() => setViewMode('grid')}
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              title="Grid view"
            >
              <svg width="20" height="20" viewBox="0 0 20 20">
                <rect x="2" y="2" width="6" height="6" fill="currentColor"/>
                <rect x="12" y="2" width="6" height="6" fill="currentColor"/>
                <rect x="2" y="12" width="6" height="6" fill="currentColor"/>
                <rect x="12" y="12" width="6" height="6" fill="currentColor"/>
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              title="List view"
            >
              <svg width="20" height="20" viewBox="0 0 20 20">
                <rect x="2" y="4" width="16" height="2" fill="currentColor"/>
                <rect x="2" y="9" width="16" height="2" fill="currentColor"/>
                <rect x="2" y="14" width="16" height="2" fill="currentColor"/>
              </svg>
            </button>
          </div>

          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as 'date' | 'title' | 'readingTime')}
            className="sort-select"
          >
            <option value="date">Sort by Date</option>
            <option value="title">Sort by Title</option>
            <option value="readingTime">Sort by Reading Time</option>
          </select>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="blog-list__filters">
          <div className="filter-toggle">
            <button 
              onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
              className="filter-toggle-btn"
            >
              🔍 Filters
              {activeFilterCount > 0 && (
                <span className="filter-count">{activeFilterCount}</span>
              )}
            </button>
            
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="clear-filters-btn">
                Clear All
              </button>
            )}
          </div>

          <div 
            ref={filterMenuRef} 
            className={`filter-menu ${isFilterMenuOpen ? 'open' : ''}`}
          >
            {/* Categories */}
            <div className="filter-group">
              <h4>Categories</h4>
              <div className="filter-options">
                {categories.map(category => (
                  <label key={category.id} className="filter-option">
                    <input
                      type="checkbox"
                      checked={activeFilters.categories?.includes(category.slug) || false}
                      onChange={() => handleCategoryFilter(category.slug)}
                    />
                    <span className="filter-label">
                      {category.icon} {category.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Featured Filter */}
            <div className="filter-group">
              <h4>Content Type</h4>
              <div className="filter-options">
                <label className="filter-option">
                  <input
                    type="checkbox"
                    checked={activeFilters.featured === true}
                    onChange={() => setActiveFilters(prev => ({
                      ...prev,
                      featured: prev.featured === true ? undefined : true
                    }))}
                  />
                  <span className="filter-label">⭐ Featured Posts Only</span>
                </label>
              </div>
            </div>

            {/* Popular Tags */}
            <div className="filter-group">
              <h4>Popular Tags</h4>
              <div className="filter-options tags-filter">
                {tags.slice(0, 8).map(tag => (
                  <button
                    key={tag.id}
                    onClick={() => handleTagFilter(tag.slug)}
                    className={`tag-filter ${activeFilters.tags?.includes(tag.slug) ? 'active' : ''}`}
                  >
                    #{tag.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="blog-list__results">
        <span className="results-count">
          {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'} found
        </span>
      </div>

      {/* Posts Grid/List */}
      <div className={`blog-list__posts ${viewMode}`}>
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post, index) => (
            <BlogCard
              key={post.id}
              post={post}
              featured={index === 0 && post.featured && viewMode === 'grid'}
              showExcerpt={true}
              showAuthor={true}
              showCategories={true}
              className={`post-${index + 1}`}
              onClick={() => onPostClick?.(post)}
            />
          ))
        ) : (
          <div className="no-posts">
            <div className="no-posts-content">
              <span className="no-posts-icon">📝</span>
              <h3>No posts found</h3>
              <p>Try adjusting your search or filters to find what you're looking for.</p>
              {activeFilterCount > 0 && (
                <button onClick={clearFilters} className="btn btn-primary">
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="blog-list__pagination">
          <div className="pagination">
            {pagination.hasPrev && (
              <button className="pagination-btn prev">
                ← Previous
              </button>
            )}
            
            <div className="pagination-info">
              Page {pagination.currentPage} of {pagination.totalPages}
            </div>
            
            {pagination.hasNext && (
              <button className="pagination-btn next">
                Next →
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default BlogList;