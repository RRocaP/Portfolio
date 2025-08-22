// Enhanced Service Worker for Portfolio Site
// Advanced caching with predictive prefetching and performance monitoring

const CACHE_VERSION = 'v2.0.0';
const STATIC_CACHE = `portfolio-static-${CACHE_VERSION}`;
const PAGES_CACHE = `portfolio-pages-${CACHE_VERSION}`;
const IMAGES_CACHE = `portfolio-images-${CACHE_VERSION}`;
const API_CACHE = `portfolio-api-${CACHE_VERSION}`;
const OFFLINE_PAGE = '/Portfolio/offline.html';

// Enhanced feature flags
const FEATURES = {
  BACKGROUND_SYNC: false, // Enable only when serverless endpoints available
  UPDATE_NOTIFICATIONS: true,
  OFFLINE_FALLBACK: true,
  PREDICTIVE_PREFETCH: true,
  PERFORMANCE_MONITORING: true,
  CACHE_ANALYTICS: true,
  NETWORK_FIRST_API: true,
  IMAGE_OPTIMIZATION: true
};

// Enhanced assets categorization
const CRITICAL_ASSETS = [
  '/Portfolio/',
  '/Portfolio/manifest.json',
  '/Portfolio/styles/optimized-core.css',
  '/Portfolio/styles/tokens.css'
];

const STATIC_ASSETS = [
  ...CRITICAL_ASSETS,
  '/Portfolio/styles/optimized-enhanced.css',
  '/Portfolio/styles/optimized-accessibility.css',
  '/Portfolio/favicon.svg'
];

const IMAGE_ASSETS = [
  '/Portfolio/profile.avif',
  '/Portfolio/profile.webp', 
  '/Portfolio/profile.jpg',
  '/Portfolio/hero/video-poster.avif',
  '/Portfolio/hero/video-poster.webp',
  '/Portfolio/hero/video-poster.jpg'
];

// Pages to pre-cache
const PAGES_TO_CACHE = [
  '/Portfolio/en/',
  '/Portfolio/es/',
  '/Portfolio/ca/',
  '/Portfolio/offline.html'
];

// Enhanced caching patterns
const CACHE_FIRST_PATTERNS = [
  /\.(?:css|js)$/,
  /\.(?:woff|woff2|ttf|eot)$/,
  /\/manifest\.json$/,
  /\/favicon\./
];

const IMAGE_PATTERNS = [
  /\.(?:png|jpg|jpeg|webp|avif|gif|svg|ico)$/,
  /\/profile\./,
  /\/hero\//
];

const API_PATTERNS = [
  /\/api\/(?!auth|admin)/  // Cache safe API routes
];

// URLs to exclude from caching
const EXCLUDE_PATTERNS = [
  /\/api\/auth/,       // Authentication endpoints
  /\/api\/admin/,      // Admin interfaces  
  /\.(?:map)$/,        // Source maps
  /\/sw\.js$/,         // Service worker itself
  /chrome-extension:/, // Browser extensions
  /moz-extension:/,    // Firefox extensions
  /\/metrics/,         // Live metrics
  /nocache/,           // Explicit no-cache
  /timestamp/          // Time-sensitive data
];

// Performance monitoring
let performanceMetrics = {
  cacheHits: 0,
  cacheMisses: 0,
  networkRequests: 0,
  offlineHits: 0,
  prefetchSuccess: 0,
  prefetchFailed: 0
};

// Enhanced install event with prioritized caching
self.addEventListener('install', event => {
  console.log('[SW] Installing enhanced service worker version:', CACHE_VERSION);
  
  event.waitUntil(
    Promise.all([
      // Cache critical assets first (high priority)
      caches.open(STATIC_CACHE).then(cache => {
        console.log('[SW] Caching critical assets');
        return cache.addAll(CRITICAL_ASSETS).then(() => {
          // Cache remaining static assets
          return cache.addAll(STATIC_ASSETS.filter(asset => !CRITICAL_ASSETS.includes(asset)));
        });
      }).catch(err => {
        console.warn('[SW] Failed to cache static assets:', err);
      }),
      
      // Cache images in separate cache
      caches.open(IMAGES_CACHE).then(cache => {
        console.log('[SW] Caching image assets');
        return cache.addAll(IMAGE_ASSETS).catch(err => {
          console.warn('[SW] Failed to cache some images:', err);
        });
      }),
      
      // Cache key pages
      caches.open(PAGES_CACHE).then(cache => {
        console.log('[SW] Caching key pages');
        return cache.addAll(PAGES_TO_CACHE).catch(err => {
          console.warn('[SW] Failed to cache some pages:', err);
        });
      }),
      
      // Initialize API cache
      caches.open(API_CACHE).then(cache => {
        console.log('[SW] API cache initialized');
      })
    ])
  );
  
  // Skip waiting for immediate activation
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activating service worker version:', CACHE_VERSION);
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName.includes('portfolio-') && 
                !cacheName.includes(CACHE_VERSION)) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Claim all clients immediately
      self.clients.claim()
    ])
  );
  
  // Notify clients about the update
  if (FEATURES.UPDATE_NOTIFICATIONS) {
    notifyClientsOfUpdate();
  }
});

// Enhanced fetch event with performance monitoring and predictive prefetching
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests and excluded patterns
  if (request.method !== 'GET' || shouldExclude(url)) {
    return;
  }
  
  // Performance monitoring
  if (FEATURES.PERFORMANCE_MONITORING) {
    performanceMetrics.networkRequests++;
  }
  
  // Route to appropriate caching strategy
  if (isImageAsset(url)) {
    event.respondWith(imageOptimizedStrategy(request));
  } else if (isStaticAsset(url)) {
    event.respondWith(cacheFirstStrategy(request));
  } else if (isAPIRequest(url)) {
    event.respondWith(networkFirstAPIStrategy(request));
  } else if (isPageRequest(request)) {
    event.respondWith(staleWhileRevalidateStrategy(request));
    
    // Predictive prefetching
    if (FEATURES.PREDICTIVE_PREFETCH) {
      scheduleRelatedContentPrefetch(url);
    }
  }
});

// Background sync for contact form (when enabled)
if (FEATURES.BACKGROUND_SYNC) {
  self.addEventListener('sync', event => {
    if (event.tag === 'contact-form') {
      console.log('[SW] Background sync: contact-form');
      event.waitUntil(syncContactForm());
    }
  });
}

// Message handling for client communication
self.addEventListener('message', event => {
  const { type, payload } = event.data || {};
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
    
    case 'GET_VERSION':
      event.ports[0].postMessage({ version: CACHE_VERSION });
      break;
    
    case 'CLEAR_CACHES':
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ success: true });
      }).catch(err => {
        event.ports[0].postMessage({ success: false, error: err.message });
      });
      break;
    
    case 'QUEUE_CONTACT_FORM':
      if (FEATURES.BACKGROUND_SYNC && payload) {
        queueContactForm(payload);
      }
      break;
  }
});

// Enhanced cache-first strategy for static assets
async function cacheFirstStrategy(request) {
  try {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      if (FEATURES.PERFORMANCE_MONITORING) {
        performanceMetrics.cacheHits++;
      }
      
      // Update cache in background with freshness check
      updateCacheInBackground(request, cache);
      return cachedResponse;
    }
    
    if (FEATURES.PERFORMANCE_MONITORING) {
      performanceMetrics.cacheMisses++;
    }
    
    // Not in cache, fetch from network
    const networkResponse = await fetch(request);
    
    if (networkResponse.status === 200) {
      // Cache with expiration headers consideration
      const shouldCache = shouldCacheResponse(networkResponse);
      if (shouldCache) {
        cache.put(request, networkResponse.clone());
      }
    }
    
    return networkResponse;
  } catch (error) {
    console.warn('[SW] Cache-first strategy failed:', error);
    return createErrorResponse('Asset unavailable', 503);
  }
}

// Image-optimized caching strategy
async function imageOptimizedStrategy(request) {
  try {
    const cache = await caches.open(IMAGES_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      if (FEATURES.PERFORMANCE_MONITORING) {
        performanceMetrics.cacheHits++;
      }
      return cachedResponse;
    }
    
    if (FEATURES.PERFORMANCE_MONITORING) {
      performanceMetrics.cacheMisses++;
    }
    
    // Fetch with timeout for images
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
    
    try {
      const networkResponse = await fetch(request, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (networkResponse.status === 200) {
        // Cache images with longer expiration
        cache.put(request, networkResponse.clone());
      }
      
      return networkResponse;
    } catch (fetchError) {
      clearTimeout(timeoutId);
      throw fetchError;
    }
  } catch (error) {
    console.warn('[SW] Image strategy failed:', error);
    return createImagePlaceholder();
  }
}

// Network-first strategy for API requests  
async function networkFirstAPIStrategy(request) {
  try {
    const cache = await caches.open(API_CACHE);
    
    try {
      // Try network first with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout
      
      const networkResponse = await fetch(request, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (networkResponse.status === 200) {
        // Cache successful API responses with short TTL
        cache.put(request, networkResponse.clone());
      }
      
      return networkResponse;
    } catch (networkError) {
      // Fall back to cache
      const cachedResponse = await cache.match(request);
      
      if (cachedResponse) {
        if (FEATURES.PERFORMANCE_MONITORING) {
          performanceMetrics.offlineHits++;
        }
        
        // Add offline indicator header
        const response = cachedResponse.clone();
        response.headers.set('X-Served-By', 'service-worker-cache');
        return response;
      }
      
      throw networkError;
    }
  } catch (error) {
    console.warn('[SW] API strategy failed:', error);
    return createErrorResponse('API unavailable', 503);
  }
}

// Stale-while-revalidate strategy for pages
async function staleWhileRevalidateStrategy(request) {
  try {
    const cache = await caches.open(PAGES_CACHE);
    const cachedResponse = await cache.match(request);
    
    // Always try to fetch from network
    const networkPromise = fetch(request).then(response => {
      if (response.status === 200) {
        cache.put(request, response.clone());
      }
      return response;
    }).catch(() => null);
    
    // Return cached version immediately if available
    if (cachedResponse) {
      networkPromise.catch(() => {}); // Prevent unhandled promise rejection
      return cachedResponse;
    }
    
    // Wait for network if no cached version
    const networkResponse = await networkPromise;
    
    if (networkResponse) {
      return networkResponse;
    }
    
    // Fallback to offline page
    if (FEATURES.OFFLINE_FALLBACK) {
      return await cache.match(OFFLINE_PAGE) || 
             new Response('Offline', { status: 503 });
    }
    
    return new Response('Page unavailable', { status: 503 });
  } catch (error) {
    console.warn('[SW] Stale-while-revalidate strategy failed:', error);
    
    // Try offline fallback
    if (FEATURES.OFFLINE_FALLBACK) {
      try {
        const cache = await caches.open(PAGES_CACHE);
        return await cache.match(OFFLINE_PAGE) || 
               new Response('Offline', { status: 503 });
      } catch (fallbackError) {
        return new Response('Service unavailable', { status: 503 });
      }
    }
    
    return new Response('Service unavailable', { status: 503 });
  }
}

// Enhanced helper functions
function shouldExclude(url) {
  // Check for ?nocache query parameter
  if (url.searchParams.has('nocache')) {
    return true;
  }
  
  return EXCLUDE_PATTERNS.some(pattern => pattern.test(url.href));
}

function isStaticAsset(url) {
  return CACHE_FIRST_PATTERNS.some(pattern => pattern.test(url.pathname));
}

function isImageAsset(url) {
  return IMAGE_PATTERNS.some(pattern => pattern.test(url.pathname));
}

function isAPIRequest(url) {
  return API_PATTERNS.some(pattern => pattern.test(url.pathname));
}

function isPageRequest(request) {
  return request.headers.get('accept')?.includes('text/html');
}

function shouldCacheResponse(response) {
  // Don't cache error responses
  if (!response.ok) return false;
  
  // Check cache-control headers
  const cacheControl = response.headers.get('cache-control');
  if (cacheControl && cacheControl.includes('no-cache')) return false;
  
  return true;
}

function createErrorResponse(message, status) {
  return new Response(
    JSON.stringify({ error: message, timestamp: Date.now() }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        'X-Served-By': 'service-worker'
      }
    }
  );
}

function createImagePlaceholder() {
  const svg = `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#2A2A2A"/>
    <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#757575" font-family="system-ui" font-size="16">
      Image unavailable
    </text>
  </svg>`;
  
  return new Response(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml',
      'X-Served-By': 'service-worker-placeholder'
    }
  });
}

async function updateCacheInBackground(request, cache) {
  try {
    const response = await fetch(request);
    if (response.status === 200 && shouldCacheResponse(response)) {
      cache.put(request, response);
    }
  } catch (error) {
    // Ignore background update errors
  }
}

function notifyClientsOfUpdate() {
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'SW_UPDATED',
        version: CACHE_VERSION
      });
    });
  });
}

async function clearAllCaches() {
  const cacheNames = await caches.keys();
  return Promise.all(
    cacheNames.map(cacheName => caches.delete(cacheName))
  );
}

// Background sync functions (when enabled)
async function queueContactForm(data) {
  if (!FEATURES.BACKGROUND_SYNC) return;
  
  try {
    // Store form data in IndexedDB for background sync
    const db = await openDB();
    const transaction = db.transaction(['contact_queue'], 'readwrite');
    const store = transaction.objectStore('contact_queue');
    
    await store.add({
      ...data,
      timestamp: Date.now(),
      attempts: 0
    });
    
    console.log('[SW] Contact form queued for background sync');
  } catch (error) {
    console.error('[SW] Failed to queue contact form:', error);
  }
}

async function syncContactForm() {
  if (!FEATURES.BACKGROUND_SYNC) return;
  
  try {
    const db = await openDB();
    const transaction = db.transaction(['contact_queue'], 'readwrite');
    const store = transaction.objectStore('contact_queue');
    const items = await store.getAll();
    
    for (const item of items) {
      try {
        const response = await fetch('/Portfolio/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(item)
        });
        
        if (response.ok) {
          await store.delete(item.id);
          console.log('[SW] Contact form synced successfully');
        } else if (item.attempts < 3) {
          // Retry up to 3 times
          await store.put({ ...item, attempts: item.attempts + 1 });
        } else {
          // Remove after 3 failed attempts
          await store.delete(item.id);
          console.warn('[SW] Contact form sync failed after 3 attempts');
        }
      } catch (error) {
        console.error('[SW] Contact form sync error:', error);
        
        if (item.attempts < 3) {
          await store.put({ ...item, attempts: item.attempts + 1 });
        } else {
          await store.delete(item.id);
        }
      }
    }
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// IndexedDB helper (for background sync)
function openDB() {
  return new Promise((resolve, reject) => {
    if (!FEATURES.BACKGROUND_SYNC) {
      reject(new Error('Background sync not enabled'));
      return;
    }
    
    const request = indexedDB.open('portfolio-sw', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = event => {
      const db = event.target.result;
      
      if (!db.objectStoreNames.contains('contact_queue')) {
        const store = db.createObjectStore('contact_queue', { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        store.createIndex('timestamp', 'timestamp');
      }
    };
  });
}

// Predictive prefetching system
const prefetchQueue = new Set();
const navigationHistory = [];
const maxHistorySize = 20;

function scheduleRelatedContentPrefetch(currentUrl) {
  if (!FEATURES.PREDICTIVE_PREFETCH) return;
  
  // Track navigation history
  navigationHistory.push(currentUrl.pathname);
  if (navigationHistory.length > maxHistorySize) {
    navigationHistory.shift();
  }
  
  // Schedule prefetch with idle callback
  if ('requestIdleCallback' in self) {
    requestIdleCallback(() => {
      prefetchRelatedContent(currentUrl);
    });
  } else {
    setTimeout(() => prefetchRelatedContent(currentUrl), 1000);
  }
}

async function prefetchRelatedContent(currentUrl) {
  const relatedUrls = getRelatedUrls(currentUrl);
  
  for (const url of relatedUrls) {
    if (prefetchQueue.has(url)) continue;
    
    prefetchQueue.add(url);
    
    try {
      const response = await fetch(url);
      if (response.ok) {
        // Cache the prefetched content
        const cache = await caches.open(PAGES_CACHE);
        cache.put(url, response);
        
        if (FEATURES.PERFORMANCE_MONITORING) {
          performanceMetrics.prefetchSuccess++;
        }
        
        console.log('[SW] Prefetched:', url);
      }
    } catch (error) {
      if (FEATURES.PERFORMANCE_MONITORING) {
        performanceMetrics.prefetchFailed++;
      }
      console.warn('[SW] Prefetch failed:', url, error);
    } finally {
      prefetchQueue.delete(url);
    }
  }
}

function getRelatedUrls(currentUrl) {
  const related = [];
  const currentPath = currentUrl.pathname;
  
  // Language-based prefetching
  if (currentPath.includes('/en/')) {
    related.push(currentPath.replace('/en/', '/es/'));
    related.push(currentPath.replace('/en/', '/ca/'));
  } else if (currentPath.includes('/es/')) {
    related.push(currentPath.replace('/es/', '/en/'));
    related.push(currentPath.replace('/es/', '/ca/'));
  } else if (currentPath.includes('/ca/')) {
    related.push(currentPath.replace('/ca/', '/en/'));
    related.push(currentPath.replace('/ca/', '/es/'));
  }
  
  // Research page prefetching
  if (currentPath.includes('/research/')) {
    related.push('/Portfolio/en/metrics');
    related.push('/Portfolio/en/');
  } else if (currentPath === '/Portfolio/en/') {
    related.push('/Portfolio/en/metrics');
    related.push('/Portfolio/en/research/functional-inclusion-bodies');
  }
  
  // Limit to 3 related URLs to avoid overloading
  return related.slice(0, 3);
}

// Performance metrics reporting
function reportPerformanceMetrics() {
  if (!FEATURES.PERFORMANCE_MONITORING) return;
  
  const metrics = {
    ...performanceMetrics,
    timestamp: Date.now(),
    cacheEfficiency: performanceMetrics.cacheHits / 
      (performanceMetrics.cacheHits + performanceMetrics.cacheMisses) * 100,
    prefetchEfficiency: performanceMetrics.prefetchSuccess / 
      (performanceMetrics.prefetchSuccess + performanceMetrics.prefetchFailed) * 100
  };
  
  // Send metrics to clients
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'SW_PERFORMANCE_METRICS',
        metrics
      });
    });
  });
  
  console.log('[SW] Performance metrics:', metrics);
}

// Report metrics every 5 minutes
setInterval(reportPerformanceMetrics, 5 * 60 * 1000);

// Cache cleanup on quota exceeded
self.addEventListener('quotaexceeded', async () => {
  console.warn('[SW] Storage quota exceeded, cleaning up old caches');
  
  try {
    // Delete oldest images first
    const imageCache = await caches.open(IMAGES_CACHE);
    const keys = await imageCache.keys();
    
    // Delete half of the cached images
    const toDelete = keys.slice(0, Math.floor(keys.length / 2));
    await Promise.all(toDelete.map(key => imageCache.delete(key)));
    
    console.log('[SW] Cleaned up', toDelete.length, 'cached images');
  } catch (error) {
    console.error('[SW] Cache cleanup failed:', error);
  }
});

// Enhanced error reporting
self.addEventListener('error', (event) => {
  console.error('[SW] Service worker error:', event.error);
  
  // Report critical errors to clients
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'SW_ERROR',
        error: {
          message: event.error?.message || 'Unknown error',
          filename: event.filename,
          lineno: event.lineno,
          timestamp: Date.now()
        }
      });
    });
  });
});

// Log service worker registration
console.log(`[SW] Enhanced service worker loaded - Version: ${CACHE_VERSION}`);
console.log(`[SW] Features enabled:`, FEATURES);
console.log(`[SW] Cache strategies: Static (cache-first), Images (optimized), API (network-first), Pages (stale-while-revalidate)`);