const CACHE_NAME = 'mdrnlifeddw-public-v4';
const PUBLIC_SHELL = ['/', '/human-poster.webp?v=20260725b'];
const PRIVATE_PATHS = [
  /^\/api(?:\/|$)/,
  /^\/account(?:\/|$)/,
  /^\/login\/?$/,
  /^\/checkout(?:\/|$)/,
  /^\/products\/cart\/?$/,
  /^\/cart(?:\/|$)/,
  /^\/checkouts(?:\/|$)/,
  /^\/orders(?:\/|$)/,
];

function isPrivatePath(pathname) {
  return PRIVATE_PATHS.some((pattern) => pattern.test(pathname));
}

async function updatePublicPage(request, cache, cacheKey) {
  const response = await fetch(request);
  if (response.ok && response.type === 'basic') {
    await cache.put(cacheKey, response.clone());
  }
  return response;
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PUBLIC_SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || request.headers.has('range')) return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin || isPrivatePath(url.pathname)) return;

  if (request.mode === 'navigate') {
    const cacheKey = url.pathname;
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        // Public documents must be network-first. A cache-first navigation can
        // pin visitors to an old HTML shell and therefore an old JS bundle or
        // product image after a release. The cached page remains an offline
        // fallback only.
        try {
          return await updatePublicPage(request, cache, cacheKey);
        } catch {
          const cached = await cache.match(cacheKey);
          if (cached) return cached;
          throw new Error('Public page unavailable');
        }
      }),
    );
    return;
  }

  if (
    url.pathname.startsWith('/assets/') ||
    url.pathname.startsWith('/fonts/') ||
    url.pathname === '/human-poster.webp' ||
    url.pathname === '/brand/logo.png'
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        const response = await fetch(request);
        if (response.ok && response.type === 'basic') {
          await cache.put(request, response.clone());
        }
        return response;
      }),
    );
  }
});
