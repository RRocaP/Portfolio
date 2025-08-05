// Service Worker for Portfolio PWA
// Version 1.0.0

const CACHE_NAME = 'portfolio-v1.0.0';
const STATIC_CACHE = 'portfolio-static-v1.0.0';
const DYNAMIC_CACHE = 'portfolio-dynamic-v1.0.0';

// Assets to cache on install
const STATIC_ASSETS = [
  '/Portfolio/',
  '/Portfolio/en/',
  '/Portfolio/es/',
  '/Portfolio/ca/',
  '/Portfolio/manifest.json',
  '/Portfolio/favicon.svg',
  '/Portfolio/profile.jpg',
  // Add critical CSS and JS files (will be populated by build process)
];

// Assets to cache dynamically
const CACHE_STRATEGIES = {
  // Images - Cache with fallback
  images: /\.(jpg|jpeg|png|gif|webp|svg)$/i,
  // Fonts - Cache first
  fonts: /\.(woff|woff2|ttf|otf)$/i,
  // Scripts and styles - Network first with cache fallback
  assets: /\.(js|css)$/i,
  // API calls or external resources
  external: /^https?:\/\/(?!.*\.(?:js|css|jpg|jpeg|png|gif|webp|svg|woff|woff2)$)/i,
};

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Installation complete');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Installation failed', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activation complete');
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip cross-origin requests for external APIs
  if (url.origin !== location.origin && !isAsset(request.url)) {
    return;
  }
  
  event.respondWith(handleRequest(request));
});

// Request handling with different strategies
async function handleRequest(request) {
  const url = request.url;
  
  try {
    // Strategy 1: Cache first for fonts and static assets
    if (CACHE_STRATEGIES.fonts.test(url)) {
      return await cacheFirst(request, STATIC_CACHE);
    }
    
    // Strategy 2: Stale while revalidate for images
    if (CACHE_STRATEGIES.images.test(url)) {
      return await staleWhileRevalidate(request, DYNAMIC_CACHE);
    }
    
    // Strategy 3: Network first for scripts and styles
    if (CACHE_STRATEGIES.assets.test(url)) {
      return await networkFirst(request, DYNAMIC_CACHE);
    }
    
    // Strategy 4: Cache first for navigation (HTML pages)
    if (request.mode === 'navigate') {
      return await networkFirst(request, DYNAMIC_CACHE, '/Portfolio/');
    }
    
    // Default: Network first
    return await networkFirst(request, DYNAMIC_CACHE);
    
  } catch (error) {
    console.error('Service Worker: Request failed', error);
    
    // Fallback for navigation requests
    if (request.mode === 'navigate') {
      const fallback = await caches.match('/Portfolio/');
      return fallback || new Response('Offline - Please check your connection', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'text/plain' }
      });
    }
    
    throw error;
  }
}

// Cache first strategy
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  if (cached) {
    return cached;
  }
  
  const response = await fetch(request);
  
  if (response.ok) {
    cache.put(request, response.clone());
  }
  
  return response;
}

// Network first strategy
async function networkFirst(request, cacheName, fallbackUrl = null) {
  const cache = await caches.open(cacheName);
  
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }
    
    if (fallbackUrl) {
      const fallback = await cache.match(fallbackUrl);
      if (fallback) {
        return fallback;
      }
    }
    
    throw error;
  }
}

// Stale while revalidate strategy
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  // Start fetch in background
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => {
    // Fail silently, return cached version
  });
  
  // Return cached version immediately if available
  if (cached) {
    fetchPromise; // Continue background update
    return cached;
  }
  
  // Wait for fetch if no cache available
  return await fetchPromise;
}

// Helper function to determine if URL is an asset
function isAsset(url) {
  return Object.values(CACHE_STRATEGIES).some(pattern => pattern.test(url));
}

// Background sync for offline actions (future enhancement)
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    console.log('Service Worker: Background sync triggered');
    // Handle background sync operations
  }
});

// Push notifications (future enhancement)
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    console.log('Service Worker: Push notification received', data);
    
    const options = {
      body: data.body,
      icon: '/Portfolio/favicon.svg',
      badge: '/Portfolio/favicon.svg',
      vibrate: [100, 50, 100],
      data: {
        url: data.url || '/Portfolio/'
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'Portfolio Update', options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  const url = event.notification.data?.url || '/Portfolio/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clients => {
      // Check if there's already a window/tab open with the target URL
      for (const client of clients) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Open new window/tab
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// Handle messages from main thread
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});