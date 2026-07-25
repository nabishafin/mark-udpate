import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const dist = resolve(root, 'dist');
const manifest = JSON.parse(readFileSync(resolve(dist, 'route-manifest.json'), 'utf8'));
const failures = [];

function routeFile(route) {
  return route === '/' ? resolve(dist, 'index.html') : resolve(dist, route.slice(1), 'index.html');
}

for (const route of manifest.indexableRoutes) {
  const file = routeFile(route);
  if (!existsSync(file)) {
    failures.push(`${route}: missing route HTML`);
    continue;
  }
  const html = readFileSync(file, 'utf8');
  const canonical = `https://mdrnlifeddw.com${route === '/' ? '/' : route}`;
  const h1Count = (html.match(/<h1(?:\s|>)/gi) || []).length;
  if (h1Count !== 1) failures.push(`${route}: expected one H1, found ${h1Count}`);
  if (!html.includes(`<link rel="canonical" href="${canonical}"`)) failures.push(`${route}: wrong canonical`);
  if (!/<title>[^<]{10,}<\/title>/i.test(html)) failures.push(`${route}: missing title`);
  if (!/<meta name="description" content="[^"]{50,}"/i.test(html)) failures.push(`${route}: missing description`);
  if (!html.includes('data-prerendered="true"')) failures.push(`${route}: missing initial HTML body`);

  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  const types = [];
  for (const match of schemas) {
    try {
      const parsed = JSON.parse(match[1]);
      types.push(parsed['@type']);
      if ('aggregateRating' in parsed || 'review' in parsed) failures.push(`${route}: unverified review schema`);
    } catch {
      failures.push(`${route}: invalid JSON-LD`);
    }
  }
  if (route === '/products' && (!types.includes('Product') || !types.includes('ItemList'))) {
    failures.push('/products: missing Product or ItemList JSON-LD');
  }
  if (route.startsWith('/blogs/news/') && !types.includes('BlogPosting')) {
    failures.push(`${route}: missing BlogPosting JSON-LD`);
  }
  if (route.startsWith('/learn/') && !types.includes('Article')) {
    failures.push(`${route}: missing Article JSON-LD`);
  }
}

if (failures.length) throw new Error(`SEO validation failed:\n- ${failures.join('\n- ')}`);
console.log(`Validated initial HTML, metadata, and JSON-LD for ${manifest.indexableRoutes.length} routes`);
