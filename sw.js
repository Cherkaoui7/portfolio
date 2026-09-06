// Ultra-fast Service Worker for 1ms Cache Retrieval
const CACHE_NAME = 'cherkaoui-cache-v8';
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './style.css?v=20260905_02',
  './lang.js?v=20260904_09',
  './script.js?v=20260904_09'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // 1. Security Gate: Only intercept idempotent GET requests (Cache API does not support non-GET)
  if (event.request.method !== 'GET') return;

  // 2. Security Gate: Only intercept standard HTTP/HTTPS schemes (reject chrome-extension, data, blob)
  if (!event.request.url.startsWith('http://') && !event.request.url.startsWith('https://')) return;

  const url = new URL(event.request.url);

  // 3. Navigation requests: Serve instant cached HTML (0ms response) with network fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match(event.request)
        .then((cached) => {
          if (cached) {
            // Background revalidation for seamless zero-stale navigation
            fetch(event.request)
              .then((networkResponse) => {
                if (networkResponse && networkResponse.status === 200) {
                  const clone = networkResponse.clone();
                  caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                }
              })
              .catch(() => { });
            return cached;
          }
          return fetch(event.request);
        })
    );
    return;
  }

  // 4. Security Gate: Only cache same-origin assets or approved CDN origins
  const isSameOrigin = url.origin === self.location.origin;
  const isTrustedCdn = url.hostname === 'fonts.googleapis.com' ||
                       url.hostname === 'fonts.gstatic.com' ||
                       url.hostname === 'cdn.jsdelivr.net';

  if (!isSameOrigin && !isTrustedCdn) {
    // Pass untrusted third-party requests directly to network without caching
    return;
  }

  // 5. Static assets: Cache First with secure background revalidation (supports standard and opaque responses)
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        // Asynchronously update cache in background with cloned response
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
              const clone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
            }
          })
          .catch(() => { });
        return cached;
      }

      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return networkResponse;
      });
    })
  );
});
