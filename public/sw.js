const CACHE_NAME = 'mdrnlifeddw-public-v2';
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
        const cached = await cache.match(cacheKey);
        const update = updatePublicPage(request, cache, cacheKey);
        if (cached) {
          event.waitUntil(update.catch(() => undefined));
          return cached;
        }
        return update;
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
