// Modern Service Worker for Ramon Roca Pinilla Portfolio
// Ultra-performance caching with latest web standards

const CACHE_NAME = 'ramon-portfolio-v2.1.0';
const STATIC_CACHE = 'static-v2.1.0';
const DYNAMIC_CACHE = 'dynamic-v2.1.0';

// Critical resources to cache immediately
const STATIC_ASSETS = [
  '/',
  '/en/',
  '/manifest.json',
  '/offline.html',
  // Add critical CSS/JS files here when built
];

// Advanced caching strategies
const CACHE_STRATEGIES = {
  // Images: Cache first with background update
  images: {
    regex: /\.(jpg|jpeg|png|gif|webp|svg|avif)$/i,
    strategy: 'cache-first',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  },
  
  // Fonts: Cache first (they rarely change)
  fonts: {
    regex: /\.(woff|woff2|ttf|otf)$/i,
    strategy: 'cache-first',
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
  },
  
  // API data: Network first with cache fallback
  api: {
    regex: /\/api\//i,
    strategy: 'network-first',
    maxAge: 5 * 60 * 1000, // 5 minutes
  },
  
  // Static assets: Stale while revalidate
  static: {
    regex: /\.(css|js)$/i,
    strategy: 'stale-while-revalidate',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  }
};

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing');
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      self.skipWaiting()
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
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

// Handle request based on strategy
async function handleRequest(request, strategy) {
  const cacheName = strategy.name === 'static' ? STATIC_CACHE : DYNAMIC_CACHE;
  
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

console.log('Service Worker: Loaded', CACHE_NAME);