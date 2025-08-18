/**
 * Video Configuration and Optimization Utilities
 * Manages video loading strategies based on device capabilities
 */

export interface VideoSource {
  src: string;
  type: string;
  quality: 'low' | 'medium' | 'high';
  size: number; // in bytes
}

export interface VideoConfig {
  id: string;
  sources: VideoSource[];
  poster: string;
  duration?: number;
  autoplay: boolean;
  preload: 'none' | 'metadata' | 'auto';
}

// External video hosting (could be CDN, GitHub releases, etc.)
const VIDEO_CDN_BASE = 'https://github.com/rrocap/Portfolio/releases/download/v1.0.0-videos/';

export const HERO_VIDEO_CONFIG: VideoConfig = {
  id: 'hero-protein',
  sources: [
    // Compressed WebM version (would be ~800KB if available)
    {
      src: `${VIDEO_CDN_BASE}hero-protein-compressed.webm`,
      type: 'video/webm',
      quality: 'medium',
      size: 800 * 1024 // 800KB estimate
    },
    // Fallback MP4 - load from external source when needed
    {
      src: `${VIDEO_CDN_BASE}hero-protein.mp4`,
      type: 'video/mp4', 
      quality: 'high',
      size: 4.8 * 1024 * 1024 // 4.8MB
    }
  ],
  poster: '/Portfolio/hero/video-poster.jpg',
  duration: 30,
  autoplay: true,
  preload: 'none'
};

export class VideoOptimizer {
  private static instance: VideoOptimizer;
  private loadedVideos = new Map<string, HTMLVideoElement>();
  private loadingPromises = new Map<string, Promise<HTMLVideoElement>>();

  static getInstance(): VideoOptimizer {
    if (!VideoOptimizer.instance) {
      VideoOptimizer.instance = new VideoOptimizer();
    }
    return VideoOptimizer.instance;
  }

  /**
   * Get optimal video source based on device capabilities
   */
  getOptimalSource(config: VideoConfig): VideoSource {
    const connection = (navigator as any).connection;
    const isSlowConnection = connection && (
      connection.effectiveType === 'slow-2g' || 
      connection.effectiveType === '2g'
    );
    
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const prefersDataSaver = connection?.saveData === true;
    const hasLowMemory = (navigator as any).deviceMemory && (navigator as any).deviceMemory < 4;

    // Conservative approach for constrained devices
    if (isSlowConnection || prefersDataSaver || hasLowMemory) {
      // Don't load video at all, just show poster
      return null as any;
    }

    // Choose best format supported by browser
    const video = document.createElement('video');
    
    for (const source of config.sources) {
      if (video.canPlayType(source.type)) {
        // For mobile, prefer smaller files
        if (isMobile && source.quality !== 'low' && source.size > 1024 * 1024) {
          continue;
        }
        return source;
      }
    }

    // Fallback to first source
    return config.sources[0];
  }

  /**
   * Preload video intelligently based on conditions
   */
  async preloadVideo(config: VideoConfig, priority: 'high' | 'low' = 'low'): Promise<HTMLVideoElement | null> {
    if (this.loadedVideos.has(config.id)) {
      return this.loadedVideos.get(config.id)!;
    }

    if (this.loadingPromises.has(config.id)) {
      return this.loadingPromises.get(config.id)!;
    }

    const source = this.getOptimalSource(config);
    if (!source) {
      return null; // Skip video loading
    }

    const loadPromise = this.loadVideoElement(config, source, priority);
    this.loadingPromises.set(config.id, loadPromise);

    try {
      const video = await loadPromise;
      this.loadedVideos.set(config.id, video);
      return video;
    } catch (error) {
      console.warn(`Failed to preload video ${config.id}:`, error);
      this.loadingPromises.delete(config.id);
      return null;
    }
  }

  private async loadVideoElement(
    config: VideoConfig, 
    source: VideoSource, 
    priority: 'high' | 'low'
  ): Promise<HTMLVideoElement> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      
      // Configure video element
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = priority === 'high' ? 'metadata' : 'none';
      video.poster = config.poster;
      
      // Set up source
      const sourceElement = document.createElement('source');
      sourceElement.src = source.src;
      sourceElement.type = source.type;
      video.appendChild(sourceElement);

      // Timeout for loading
      const timeout = setTimeout(() => {
        reject(new Error(`Video loading timeout: ${config.id}`));
      }, 15000);

      const handleLoad = () => {
        clearTimeout(timeout);
        video.removeEventListener('loadeddata', handleLoad);
        video.removeEventListener('error', handleError);
        resolve(video);
      };

      const handleError = () => {
        clearTimeout(timeout);
        video.removeEventListener('loadeddata', handleLoad);
        video.removeEventListener('error', handleError);
        reject(new Error(`Video loading failed: ${config.id}`));
      };

      video.addEventListener('loadeddata', handleLoad);
      video.addEventListener('error', handleError);

      // Start loading
      video.load();
    });
  }

  /**
   * Check if video should be loaded based on various factors
   */
  shouldLoadVideo(): boolean {
    // Check user preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return false;

    // Check connection
    const connection = (navigator as any).connection;
    if (connection) {
      if (connection.saveData) return false;
      if (['slow-2g', '2g'].includes(connection.effectiveType)) return false;
    }

    // Check device capabilities
    const deviceMemory = (navigator as any).deviceMemory;
    if (deviceMemory && deviceMemory < 4) return false; // Less than 4GB RAM

    // Check battery
    const battery = (navigator as any).battery;
    if (battery && battery.charging === false && battery.level < 0.3) return false;

    return true;
  }

  /**
   * Get cached video element if available
   */
  getCachedVideo(id: string): HTMLVideoElement | null {
    return this.loadedVideos.get(id) || null;
  }

  /**
   * Clean up resources
   */
  cleanup(): void {
    this.loadedVideos.forEach(video => {
      video.pause();
      video.src = '';
      video.load();
    });
    this.loadedVideos.clear();
    this.loadingPromises.clear();
  }
}

// Export singleton instance
export const videoOptimizer = VideoOptimizer.getInstance();