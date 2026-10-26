// Bump CACHE_NAME on every deploy. This is the only reliable purge mechanism.
const CACHE_NAME = 'cherkaoui-cache-v9';

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/style.css?v=20260905_02',
  '/lang.js?v=20260904_09',
  '/script.js?v=20260904_09'
];

const NAV_TIMEOUT_MS = 3000;

const TRUSTED_CDN_HOSTS = new Set([
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'cdn.jsdelivr.net'
]);

// ---------------------------------------------------------------------------
// Install: precache the shell. Per-asset add so a single 404 does not abort
// the whole install (cache.addAll is atomic and would leave users stranded
// on the previous SW forever if any precache URL goes stale).
// ---------------------------------------------------------------------------
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.allSettled(
        PRECACHE_ASSETS.map((url) =>
          cache.add(url).catch((err) => {
            console.warn('[sw] precache miss:', url, err);
          })
        )
      )
    )
  );
});

// ---------------------------------------------------------------------------
// Activate: purge every cache that is not the current version, then claim
// existing clients so the new SW takes effect immediately.
// ---------------------------------------------------------------------------
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// ---------------------------------------------------------------------------
// fetch with timeout — used for network-first navigations so a slow network
// cannot hang the page while the cache fallback sits idle.
// ---------------------------------------------------------------------------
function fetchWithTimeout(request, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('sw-timeout')), ms);
    fetch(request).then(
      (res) => { clearTimeout(timer); resolve(res); },
      (err) => { clearTimeout(timer); reject(err); }
    );
  });
}

// ---------------------------------------------------------------------------
// Fetch handler
// ---------------------------------------------------------------------------
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Gate 1: idempotent, HTTP(S) only.
  if (req.method !== 'GET') return;
  if (!req.url.startsWith('http')) return;

  const url = new URL(req.url);

  // -------------------------------------------------------------------------
  // Navigation: network-first, cache fallback.
  //
  // Only clean navigations (no query string) are written to the cache. A
  // navigation like /?lang=<payload> is served fresh from the network every
  // time, so a reflected parameter in lang.js can never become a persisted
  // payload in the SW cache.
  // -------------------------------------------------------------------------
  if (req.mode === 'navigate') {
    const cacheable = url.search === '';

    event.respondWith(
      fetchWithTimeout(req, NAV_TIMEOUT_MS)
        .then((network) => {
          if (cacheable && network && network.status === 200) {
            const clone = network.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put('/', clone));
          }
          return network;
        })
        .catch(() =>
          caches.match('/').then((cached) => cached || caches.match('/index.html'))
        )
    );
    return;
  }

  // -------------------------------------------------------------------------
  // Origin allowlist: same-origin, or an explicitly trusted CDN.
  // Anything else goes straight to the network untouched.
  // -------------------------------------------------------------------------
  const isSameOrigin = url.origin === self.location.origin;
  const isTrustedCdn = TRUSTED_CDN_HOSTS.has(url.hostname);
  if (!isSameOrigin && !isTrustedCdn) return;

  // -------------------------------------------------------------------------
  // Static assets: cache-first with background revalidation.
  //
  // Skip caching any response marked no-store so the server can opt out of
  // SW persistence per-asset without changing this file.
  // -------------------------------------------------------------------------
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) {
        fetch(req)
          .then((network) => {
            if (!network) return;
            const cc = (network.headers.get('Cache-Control') || '').toLowerCase();
            if (cc.includes('no-store')) return;
            if (network.status === 200 || network.type === 'opaque') {
              caches.open(CACHE_NAME).then((cache) => cache.put(req, network.clone()));
            }
          })
          .catch(() => { /* offline or aborted; keep serving the cache hit */ });
        return cached;
      }

      return fetch(req).then((network) => {
        if (!network) return network;
        const cc = (network.headers.get('Cache-Control') || '').toLowerCase();
        if (cc.includes('no-store')) return network;
        if (network.status === 200 || network.type === 'opaque') {
          caches.open(CACHE_NAME).then((cache) => cache.put(req, network.clone()));
        }
        return network;
      });
    })
  );
});
