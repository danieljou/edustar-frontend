// EduStar Service Worker — v1
const CACHE_NAME = 'edustar-v1';
const OFFLINE_URL = '/offline.html';

// ── Install ──────────────────────────────────────────────────────────────────
// Pre-cache the offline page so it is always available without network
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.add(OFFLINE_URL))
  );
  self.skipWaiting();
});

// ── Activate ─────────────────────────────────────────────────────────────────
// Delete any old caches from previous SW versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// ── Fetch ─────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Ignore non-GET and browser-extension requests
  if (request.method !== 'GET') return;
  if (!request.url.startsWith('http')) return;

  // ── Navigation (HTML pages) — network-first, then cache, then offline ──
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache a fresh copy of every successfully-loaded page
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(async () => {
          // Try the cached version of the page, then fall back to offline.html
          const cached = await caches.match(request);
          return cached || caches.match(OFFLINE_URL);
        })
    );
    return;
  }

  // ── Static assets (JS / CSS / fonts / images) — cache-first ──
  const dest = request.destination;
  if (dest === 'script' || dest === 'style' || dest === 'font' || dest === 'image') {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        });
      })
    );
  }
});
