import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import type { BlogPost } from '../types/blog';

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
  showExcerpt?: boolean;
  showAuthor?: boolean;
  showCategories?: boolean;
  className?: string;
  onClick?: () => void;
}

const BlogCard: React.FC<BlogCardProps> = ({
  post,
  featured = false,
  showExcerpt = true,
  showAuthor = true,
  showCategories = true,
  className = '',
  onClick
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Format date for display
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  // Truncate text to specified word count
  const truncateText = (text: string, wordCount: number): string => {
    const words = text.split(' ');
    if (words.length <= wordCount) return text;
    return words.slice(0, wordCount).join(' ') + '...';
  };

  // Card hover animation
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseEnter = () => {
      gsap.to(card, {
        scale: 1.02,
        y: -5,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        scale: 1,
        y: 0,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <article 
      ref={cardRef}
      className={`blog-card ${featured ? 'blog-card--featured' : ''} ${className}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    >
      {/* Cover Image */}
      {post.coverImage && (
        <div className="blog-card__image">
          <img 
            src={post.coverImage} 
            alt={post.title}
            loading="lazy"
          />
          {post.featured && (
            <div className="featured-badge">
              <span>⭐ Featured</span>
            </div>
          )}
        </div>
      )}

      <div className="blog-card__content">
        {/* Categories */}
        {showCategories && post.categories.length > 0 && (
          <div className="blog-card__categories">
            {post.categories.slice(0, 2).map(category => (
              <span 
                key={category.id}
                className="category-tag"
                style={{ backgroundColor: `${category.color}20`, color: category.color }}
              >
                {category.icon} {category.name}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="blog-card__title">
          {featured ? post.title : truncateText(post.title, 12)}
        </h3>

        {/* Description/Excerpt */}
        {showExcerpt && (
          <p className="blog-card__excerpt">
            {truncateText(post.excerpt || post.description, featured ? 30 : 20)}
          </p>
        )}

        {/* Meta Information */}
        <div className="blog-card__meta">
          <div className="meta-left">
            {showAuthor && (
              <div className="author">
                <img 
                  src={post.author.avatar} 
                  alt={post.author.name}
                  className="author-avatar"
                />
                <span className="author-name">{post.author.name}</span>
              </div>
            )}
          </div>
          
          <div className="meta-right">
            <time 
              className="publish-date"
              dateTime={post.publishedDate.toISOString()}
            >
              {formatDate(post.publishedDate)}
            </time>
            <span className="reading-time">
              📖 {post.readingTime}min
            </span>
          </div>
        </div>

        {/* Tags (show first few) */}
        {post.tags.length > 0 && (
          <div className="blog-card__tags">
            {post.tags.slice(0, 3).map(tag => (
              <span key={tag.id} className="tag">
                #{tag.name}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="tag-more">
                +{post.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Read More Button */}
        <div className="blog-card__action">
          <button className="read-more-btn">
            Read More
            <svg className="arrow-icon" width="16" height="16" viewBox="0 0 16 16">
              <path d="M8 1l6 7-6 7M2 8h12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;