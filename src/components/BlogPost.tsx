import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import type { BlogPost as BlogPostType, TableOfContentsItem } from '../types/blog';

interface BlogPostProps {
  post: BlogPostType;
  showTOC?: boolean;
  showRelated?: boolean;
  showSocialShare?: boolean;
  className?: string;
}

interface ShareData {
  title: string;
  text: string;
  url: string;
}

const BlogPost: React.FC<BlogPostProps> = ({ 
  post, 
  showTOC = true, 
  showRelated = true, 
  showSocialShare = true,
  className = '' 
}) => {
  const [activeSection, setActiveSection] = useState<string>('');
  const [readingProgress, setReadingProgress] = useState<number>(0);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState<boolean>(false);
  
  const articleRef = useRef<HTMLArticleElement>(null);
  const tocRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const shareMenuRef = useRef<HTMLDivElement>(null);

  // Format date for display
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  // Calculate reading progress
  useEffect(() => {
    const handleScroll = () => {
      if (!articleRef.current) return;
      
      const article = articleRef.current;
      const rect = article.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const articleHeight = article.offsetHeight;
      
      if (rect.top <= 0) {
        const scrolled = Math.abs(rect.top);
        const progress = Math.min(scrolled / (articleHeight - windowHeight), 1);
        setReadingProgress(progress * 100);
      } else {
        setReadingProgress(0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update progress bar
  useEffect(() => {
    if (progressBarRef.current) {
      gsap.to(progressBarRef.current, {
        width: `${readingProgress}%`,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }, [readingProgress]);

  // Table of Contents navigation
  const handleTOCClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  // Share functionality
  const handleShare = async (platform?: string) => {
    const shareData: ShareData = {
      title: post.title,
      text: post.description,
      url: window.location.href,
    };

    if (platform) {
      const urls: { [key: string]: string } = {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareData.url)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`,
        email: `mailto:?subject=${encodeURIComponent(shareData.title)}&body=${encodeURIComponent(shareData.text + '\n\n' + shareData.url)}`,
      };
      
      window.open(urls[platform], '_blank', 'width=600,height=400');
    } else if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareData.url);
        alert('Link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy link');
      }
    }
  };

  // Animate share menu
  useEffect(() => {
    if (shareMenuRef.current) {
      if (isShareMenuOpen) {
        gsap.fromTo(shareMenuRef.current,
          { opacity: 0, scale: 0.8, y: 10 },
          { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: 'back.out(1.7)' }
        );
      }
    }
  }, [isShareMenuOpen]);

  // Render Table of Contents
  const renderTOC = (items: TableOfContentsItem[]) => {
    return (
      <ul className="toc-list">
        {items.map((item) => (
          <li key={item.id} className={`toc-item level-${item.level}`}>
            <button
              onClick={() => handleTOCClick(item.id)}
              className={`toc-link ${activeSection === item.id ? 'active' : ''}`}
            >
              {item.title}
            </button>
            {item.children && renderTOC(item.children)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <article ref={articleRef} className={`blog-post ${className}`}>
      {/* Reading Progress Bar */}
      <div className="reading-progress-container">
        <div 
          ref={progressBarRef}
          className="reading-progress-bar"
          style={{ width: '0%' }}
        />
      </div>

      {/* Post Header */}
      <header className="post-header">
        <div className="post-meta">
          <div className="categories">
            {post.categories.map(category => (
              <span 
                key={category.id} 
                className="category-badge"
                style={{ backgroundColor: category.color }}
              >
                {category.icon} {category.name}
              </span>
            ))}
          </div>
          
          <div className="post-info">
            <time dateTime={post.publishedDate.toISOString()}>
              {formatDate(post.publishedDate)}
            </time>
            <span className="reading-time">
              Reading time: {post.readingTime} min
            </span>
            {post.featured && <span className="featured-badge">Featured</span>}
          </div>
        </div>

        <h1 className="post-title">{post.title}</h1>
        
        <p className="post-description">{post.description}</p>

        {/* Author Info */}
        <div className="author-info">
          <img 
            src={post.author.avatar} 
            alt={post.author.name}
            className="author-avatar"
          />
          <div className="author-details">
            <span className="author-name">{post.author.name}</span>
            <span className="author-bio">{post.author.bio}</span>
          </div>
        </div>

        {/* Social Share */}
        {showSocialShare && (
          <div className="social-share">
            <div className="share-container">
              <button 
                onClick={() => setIsShareMenuOpen(!isShareMenuOpen)}
                className="share-button"
                aria-expanded={isShareMenuOpen}
              >
                Share
              </button>
              
              {isShareMenuOpen && (
                <div ref={shareMenuRef} className="share-menu">
                  <button onClick={() => handleShare('twitter')}>Twitter</button>
                  <button onClick={() => handleShare('linkedin')}>LinkedIn</button>
                  <button onClick={() => handleShare('facebook')}>Facebook</button>
                  <button onClick={() => handleShare('email')}>Email</button>
                  <button onClick={() => handleShare()}>Copy Link</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Cover Image */}
        {post.coverImage && (
          <div className="cover-image">
            <img src={post.coverImage} alt={post.title} />
          </div>
        )}
      </header>

      {/* Main Content Layout */}
      <div className="post-layout">
        {/* Table of Contents */}
        {showTOC && post.toc && (
          <aside ref={tocRef} className="table-of-contents">
            <h3>Table of Contents</h3>
            {renderTOC(post.toc)}
          </aside>
        )}

        {/* Post Content */}
        <div className="post-content">
          <div 
            className="prose"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </div>

      {/* Post Footer */}
      <footer className="post-footer">
        {/* Tags */}
        <div className="tags">
          <span className="tags-label">Tags:</span>
          {post.tags.map(tag => (
            <span key={tag.id} className="tag">
              {tag.name}
            </span>
          ))}
        </div>

        {/* Updated Date */}
        {post.updatedDate && (
          <div className="updated-info">
            <small>
              Last updated: {formatDate(post.updatedDate)}
            </small>
          </div>
        )}

        {/* Share Again */}
        {showSocialShare && (
          <div className="share-footer">
            <p>Found this helpful? Share it with others!</p>
            <div className="share-buttons">
              <button onClick={() => handleShare('twitter')} className="share-btn twitter">
                Tweet
              </button>
              <button onClick={() => handleShare('linkedin')} className="share-btn linkedin">
                Share
              </button>
            </div>
          </div>
        )}
      </footer>
    </article>
  );
};

export default BlogPost;