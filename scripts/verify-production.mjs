const baseUrl = (process.env.BASE_URL || 'https://mdrnlifeddw.com').replace(/\/$/, '');
const requiredHeaders = [
  'content-security-policy',
  'strict-transport-security',
  'x-content-type-options',
  'referrer-policy',
  'permissions-policy',
];
const criticalRoutes = [
  '/',
  '/products',
  '/products/',
  '/science/lab-testing',
  '/blogs/news/deuterium-depleted-water-immune-support',
  '/blogs/news/can-deuterium-depleted-water-improve-recovery',
  '/blogs/news/deuterium-depleted-water-anti-aging',
  '/learn/deuterium-mitochondria',
];
const failures = [];
const legacyRedirects = {
  '/pages/q-a-how-to-deplete-deuterium-from-water': '/science',
  '/pages/deuterium': '/science',
  '/pages/about-us': '/founder',
  '/pages/scientific-studies': '/research',
  '/pages/faq': '/science',
  '/pages/subscription-policy': '/policies/subscription-policy',
  '/pages/sca-affiliate-empty-page': '/science',
  '/pages/ccpa-opt-out': '/policies/privacy-policy',
  '/pages/collab': '/contact',
  '/collections/all': '/products',
  '/products/mdrn-life-ddw': '/products',
  '/products/mdrn-life-ddw-pet-plastic': '/products',
};

async function request(path, options = {}) {
  try {
    return await fetch(`${baseUrl}${path}`, {
      redirect: 'manual',
      signal: AbortSignal.timeout(12_000),
      ...options,
    });
  } catch (error) {
    failures.push(`${path}: request failed (${error instanceof Error ? error.message : error})`);
    return null;
  }
}

try {
  const wwwResponse = await fetch('https://www.mdrnlifeddw.com/', {
    redirect: 'manual',
    signal: AbortSignal.timeout(12_000),
  });
  const location = wwwResponse.headers.get('location') || '';
  if (![301, 308].includes(wwwResponse.status) || new URL(location, baseUrl).origin !== baseUrl) {
    failures.push(`www canonical redirect is invalid (${wwwResponse.status}, ${location || 'no location'})`);
  }
} catch (error) {
  failures.push(`www HTTPS/certificate check failed (${error instanceof Error ? error.message : error})`);
}

for (const path of criticalRoutes) {
  const response = await request(path);
  if (!response) continue;
  if (response.status !== 200) {
    failures.push(`${path}: expected 200, received ${response.status}`);
    continue;
  }
  const html = await response.text();
  const canonicalPath = path === '/products/' ? '/products' : path;
  const canonical = `${baseUrl}${canonicalPath === '/' ? '/' : canonicalPath}`;
  if (!/<title>[^<]+<\/title>/i.test(html)) failures.push(`${path}: initial HTML has no title`);
  if (!html.includes(`<link rel="canonical" href="${canonical}"`)) failures.push(`${path}: initial HTML has wrong canonical`);
  if (!/<h1(?:\s|>)/i.test(html)) failures.push(`${path}: initial HTML has no H1`);
  for (const header of requiredHeaders) {
    if (!response.headers.get(header)) failures.push(`${path}: missing ${header}`);
  }
}

const product = await request('/products');
if (product?.status === 200) {
  const html = await product.text();
  if (!html.includes('"@type":"Product"') || !html.includes('"@type":"ItemList"')) {
    failures.push('/products: initial HTML is missing Product or ItemList JSON-LD');
  }
}

for (const path of criticalRoutes.filter((route) => route.startsWith('/blogs/news/'))) {
  const response = await request(path);
  if (response?.status === 200 && !(await response.text()).includes('"@type":"BlogPosting"')) {
    failures.push(`${path}: initial HTML is missing BlogPosting JSON-LD`);
  }
}

const sitemap = await request('/sitemap.xml');
if (sitemap?.status !== 200) {
  failures.push(`/sitemap.xml: expected 200, received ${sitemap?.status ?? 'no response'}`);
} else {
  const contentType = sitemap.headers.get('content-type') || '';
  const body = await sitemap.text();
  if (!contentType.includes('xml')) failures.push('/sitemap.xml: wrong Content-Type');
  if (!body.startsWith('<?xml') || !body.includes('<urlset')) failures.push('/sitemap.xml: invalid XML body');
}

const robots = await request('/robots.txt');
if (robots?.status !== 200 || !/^Sitemap: https:\/\/mdrnlifeddw\.com\/sitemap\.xml$/m.test(await robots.text())) {
  failures.push('/robots.txt: missing canonical Sitemap directive');
}

for (const endpoint of ['/api/contact', '/api/email-support', '/api/marketing-signup']) {
  const response = await request(endpoint);
  if (response?.status !== 405) failures.push(`${endpoint}: GET should return 405, received ${response?.status ?? 'no response'}`);
}

const unknown = await request('/codex-production-404-check');
if (unknown?.status !== 404) failures.push(`/unknown route: expected 404, received ${unknown?.status ?? 'no response'}`);

for (const [source, destination] of Object.entries(legacyRedirects)) {
  const response = await request(source);
  if (![301, 308].includes(response?.status)) {
    failures.push(`${source}: expected permanent redirect, received ${response?.status ?? 'no response'}`);
  } else {
    const location = response.headers.get('location') || '';
    if (new URL(location, baseUrl).pathname !== destination) {
      failures.push(`${source}: redirects to ${location || 'nothing'}, expected ${destination}`);
    }
  }
}

if (failures.length) {
  console.error(`Production verification failed for ${baseUrl}:\n- ${failures.join('\n- ')}`);
  process.exitCode = 1;
} else {
  console.log(`Production verification passed for ${baseUrl}`);
}
