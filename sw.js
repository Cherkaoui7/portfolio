// Ultra-fast Service Worker for 1ms Cache Retrieval
const CACHE_NAME = 'cherkaoui-cache-v2';
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './style.css?v=20260904_06',
  './lang.js?v=20260904_04',
  './script.js?v=20260904_05'
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
  // Navigation requests: Serve instant cached HTML (0ms response)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match(event.request)
        .then((cached) => cached || caches.match('./index.html') || caches.match('./'))
        .then((cachedResponse) => {
          const fetchPromise = fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                const clone = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
              }
              return networkResponse;
            })
            .catch(() => cachedResponse);

          return cachedResponse || fetchPromise;
        })
    );
    return;
  }

  // Static assets (CSS, JS, Fonts, Images): Cache First with background revalidation
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        // Asynchronously update cache in background
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
            }
          })
          .catch(() => {});
        return cached;
      }

      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return networkResponse;
      });
    })
  );
});
