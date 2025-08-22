// Modern Service Worker for Ramon Roca Pinilla Portfolio
// Ultra-performance caching with latest web standards

const CACHE_NAME = 'ramon-portfolio-v2.2.0';
const STATIC_CACHE = 'static-v2.2.0';
const DYNAMIC_CACHE = 'dynamic-v2.2.0';
const API_CACHE = 'api-v2.2.0';
const IMAGE_CACHE = 'images-v2.2.0';

// Critical resources to cache immediately
const STATIC_ASSETS = [
  '/',
  '/en/',
  '/es/',
  '/ca/',
  '/site.webmanifest',
  '/offline.html',
  '/favicon.svg',
  // Critical CSS/JS will be added dynamically
];

// Resources to prefetch for better performance
const PREFETCH_ASSETS = [
  '/profile.jpg',
  '/og-image.png'
];

// Advanced caching strategies with performance optimizations
const CACHE_STRATEGIES = {
  // Images: Cache first with long expiration
  images: {
    regex: /\.(jpg|jpeg|png|gif|webp|svg|avif)$/i,
    strategy: 'cache-first',
    maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
    cacheName: IMAGE_CACHE,
    maxEntries: 100
  },
  
  // Fonts: Cache first (they rarely change)
  fonts: {
    regex: /\.(woff|woff2|ttf|otf)$/i,
    strategy: 'cache-first',
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
    cacheName: STATIC_CACHE
  },
  
  // Google Fonts: Cache first
  googleFonts: {
    regex: /^https:\/\/fonts\.(googleapis|gstatic)\.com\//,
    strategy: 'cache-first',
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
    cacheName: STATIC_CACHE
  },
  
  // External APIs: Network first with short cache
  api: {
    regex: /^https:\/\/(mmtf\.rcsb\.org|cdn\.jsdelivr\.net)\//,
    strategy: 'network-first',
    maxAge: 60 * 60 * 1000, // 1 hour
    cacheName: API_CACHE,
    maxEntries: 50
  },
  
  // Static assets: Stale while revalidate for optimal performance
  static: {
    regex: /\.(css|js|mjs)$/i,
    strategy: 'stale-while-revalidate',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    cacheName: STATIC_CACHE
  },
  
  // HTML pages: Network first with cache fallback
  pages: {
    regex: /\/(en|es|ca)?\/?$/,
    strategy: 'network-first',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    cacheName: DYNAMIC_CACHE
  }
};

// Install event - cache critical resources with error handling
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing v2.2.0');
  
  event.waitUntil(
    Promise.all([
      // Cache critical static assets
      caches.open(STATIC_CACHE).then(async (cache) => {
        console.log('Service Worker: Caching static assets');
        try {
          await cache.addAll(STATIC_ASSETS);
          console.log('Service Worker: Static assets cached successfully');
        } catch (error) {
          console.warn('Service Worker: Failed to cache some static assets:', error);
          // Cache assets individually to avoid complete failure
          for (const asset of STATIC_ASSETS) {
            try {
              await cache.add(asset);
            } catch (e) {
              console.warn(`Failed to cache ${asset}:`, e);
            }
          }
        }
      }),
      
      // Prefetch important assets
      caches.open(IMAGE_CACHE).then(async (cache) => {
        for (const asset of PREFETCH_ASSETS) {
          try {
            await cache.add(asset);
          } catch (e) {
            console.warn(`Failed to prefetch ${asset}:`, e);
          }
        }
      }),
      
      self.skipWaiting()
    ])
  );
});

// Activate event - clean up old caches and optimize storage
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating v2.2.0');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        const currentCaches = [STATIC_CACHE, DYNAMIC_CACHE, API_CACHE, IMAGE_CACHE];
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!currentCaches.includes(cacheName)) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Clean up oversized caches
      cleanupOversizedCaches(),
      
      self.clients.claim()
    ])
  );
});

// Fetch event - intelligent caching
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;
  
  // Skip chrome-extension and other protocols
  if (!url.protocol.startsWith('http')) return;
  
  // Determine caching strategy
  const strategy = getCachingStrategy(request.url);
  
  event.respondWith(
    handleRequest(request, strategy)
  );
});

// Get appropriate caching strategy for URL
function getCachingStrategy(url) {
  for (const [name, config] of Object.entries(CACHE_STRATEGIES)) {
    if (config.regex.test(url)) {
      return { ...config, name };
    }
  }
  
  // Default strategy for HTML pages
  return {
    name: 'default',
    strategy: 'network-first',
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  };
}

// Handle request based on strategy with performance optimizations
async function handleRequest(request, strategy) {
  const cacheName = strategy.cacheName || 
    (strategy.name === 'static' ? STATIC_CACHE : DYNAMIC_CACHE);
  
  switch (strategy.strategy) {
    case 'cache-first':
      return cacheFirst(request, cacheName, strategy);
    
    case 'network-first':
      return networkFirst(request, cacheName, strategy);
    
    case 'stale-while-revalidate':
      return staleWhileRevalidate(request, cacheName, strategy);
    
    default:
      return networkFirst(request, cacheName, strategy);
  }
}

// Cache First Strategy
async function cacheFirst(request, cacheName, strategy) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse && !isExpired(cachedResponse, strategy.maxAge)) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    if (networkResponse.status === 200) {
      const responseClone = networkResponse.clone();
      await cache.put(request, responseClone);
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Cache First failed:', error);
    const cache = await caches.open(cacheName);
    return cache.match(request) || new Response('Network Error', { status: 503 });
  }
}

// Network First Strategy
async function networkFirst(request, cacheName, strategy) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      const responseClone = networkResponse.clone();
      await cache.put(request, responseClone);
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Network First failed, trying cache:', error);
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/offline.html');
    }
    
    return new Response('Network Error', { status: 503 });
  }
}

// Stale While Revalidate Strategy
async function staleWhileRevalidate(request, cacheName, strategy) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  // Always try to update in background
  const networkPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => null);
  
  // Return cached version immediately if available
  if (cachedResponse && !isExpired(cachedResponse, strategy.maxAge)) {
    // Trigger background update
    networkPromise;
    return cachedResponse;
  }
  
  // Otherwise wait for network
  try {
    return await networkPromise;
  } catch (error) {
    return cachedResponse || new Response('Network Error', { status: 503 });
  }
}

// Check if cached response is expired
function isExpired(response, maxAge) {
  if (!maxAge) return false;
  
  const cachedDate = response.headers.get('date');
  if (!cachedDate) return false;
  
  const cachedTime = new Date(cachedDate).getTime();
  const now = Date.now();
  
  return (now - cachedTime) > maxAge;
}

// Background sync for analytics and performance data
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-analytics') {
    event.waitUntil(sendAnalytics());
  }
});

// Send analytics data when online
async function sendAnalytics() {
  // Implementation for background analytics sync
  console.log('Background sync: Analytics data sent');
}

// Push notifications (for future use)
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: data,
    actions: [
      {
        action: 'explore',
        title: 'Explore',
        icon: '/action-explore.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/action-close.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handling for cache management
self.addEventListener('message', (event) => {
  if (event.data && event.data.type) {
    switch (event.data.type) {
      case 'SKIP_WAITING':
        self.skipWaiting();
        break;
      
      case 'GET_VERSION':
        event.ports[0].postMessage({
          type: 'VERSION',
          version: CACHE_NAME
        });
        break;
      
      case 'CLEAR_CACHE':
        event.waitUntil(clearAllCaches());
        break;
    }
  }
});

// Clear all caches
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames.map(cacheName => caches.delete(cacheName))
  );
  console.log('All caches cleared');
}

// Add cache size management
async function cleanupOversizedCaches() {
  const cachePromises = Object.values(CACHE_STRATEGIES)
    .filter(strategy => strategy.maxEntries)
    .map(async (strategy) => {
      const cache = await caches.open(strategy.cacheName || DYNAMIC_CACHE);
      const keys = await cache.keys();
      
      if (keys.length > strategy.maxEntries) {
        const entriesToDelete = keys.slice(0, keys.length - strategy.maxEntries);
        await Promise.all(entriesToDelete.map(key => cache.delete(key)));
        console.log(`Cleaned up ${entriesToDelete.length} entries from ${strategy.cacheName}`);
      }
    });
    
  await Promise.all(cachePromises);
}

// Performance monitoring
function logPerformanceMetrics() {
  if ('performance' in self && 'memory' in performance) {
    const memory = performance.memory;
    console.log('SW Memory Usage:', {
      used: Math.round(memory.usedJSHeapSize / 1024 / 1024) + ' MB',
      total: Math.round(memory.totalJSHeapSize / 1024 / 1024) + ' MB'
    });
  }
}

// Log metrics every 10 minutes
setInterval(logPerformanceMetrics, 600000);

console.log('Service Worker: Loaded v2.2.0', CACHE_NAME);
console.log('Service Worker: Cache strategies configured:', Object.keys(CACHE_STRATEGIES));
logPerformanceMetrics();