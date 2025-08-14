// Enhanced service worker with basic predictive prefetch heuristic
const CACHE = 'portfolio-v1';
const PREFETCH_LIMIT = 4;
const navStats = new Map(); // path -> count (kept only in-memory)
self.addEventListener('install', (e) => {
  self.skipWaiting();
});
self.addEventListener('activate', (e) => {
  clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  // Predictive prefetch & runtime strategies can be inserted here
  if (url.origin === location.origin && url.pathname.startsWith('/Portfolio/assets/')) {
    event.respondWith(caches.open(CACHE).then(async cache => {
      const cached = await cache.match(event.request);
      if (cached) return cached;
      const res = await fetch(event.request);
      cache.put(event.request, res.clone());
      return res;
    }));
  }
});

// Listen to navigation messages to build simple transition probabilities
self.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'NAVIGATED') {
    const path = e.data.path;
    navStats.set(path, (navStats.get(path) || 0) + 1);
  }
  if (e.data && e.data.type === 'CANDIDATES') {
    // e.data.paths = array of candidate internal links on current page
    const paths = e.data.paths.filter((p) => p.startsWith('/Portfolio/'));
    // Score paths by historical frequency
    const scored = paths.map(p => ({ p, score: navStats.get(p) || 0 })).sort((a,b)=> b.score - a.score).slice(0,PREFETCH_LIMIT);
    scored.forEach(({ p }) => prefetchPath(p));
  }
});

async function prefetchPath(path) {
  try {
    const cache = await caches.open(CACHE);
    const url = path.endsWith('/') ? path + 'index.html' : path;
    if (await cache.match(url)) return;
    const res = await fetch(url, { credentials: 'same-origin' });
    if (res.ok) cache.put(url, res.clone());
  } catch {}
}
