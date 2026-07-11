import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const siteUrl = 'https://mdrnlifeddw.com';

const staticRoutes = [
  '/',
  '/science',
  '/science/lab-testing',
  '/benefits',
  '/athletes-recovery',
  '/healthy-aging',
  '/research',
  '/blogs/news',
  '/products',
  '/founder',
  '/learn',
  '/contact',
];

function readSource(path) {
  return readFileSync(resolve(root, path), 'utf8');
}

function unique(values) {
  return [...new Set(values)];
}

function extractSingleQuotedValues(source, key) {
  const pattern = new RegExp(`${key}:\\s*'([^']+)'`, 'g');
  return unique([...source.matchAll(pattern)].map((match) => match[1]));
}

const blogHandles = extractSingleQuotedValues(readSource('src/lib/blog.ts'), 'handle');
const learnSlugs = extractSingleQuotedValues(readSource('src/components/LearnPage.tsx'), 'slug');

const blogRoutes = blogHandles.map((handle) => `/blogs/news/${handle}`);
const learnRoutes = learnSlugs.map((slug) => `/learn/${slug}`);
const sitemapRoutes = unique([...staticRoutes, ...blogRoutes, ...learnRoutes]);

function xmlEscape(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...sitemapRoutes.map((route) => `  <url><loc>${xmlEscape(`${siteUrl}${route === '/' ? '/' : route}`)}</loc></url>`),
  '</urlset>',
  '',
].join('\n');

const routeManifest = {
  staticRoutes,
  blogRoutes,
  learnRoutes,
  indexableRoutes: sitemapRoutes,
};

writeFileSync(resolve(root, 'public/sitemap.xml'), sitemap, 'utf8');
writeFileSync(resolve(root, 'public/route-manifest.json'), `${JSON.stringify(routeManifest, null, 2)}\n`, 'utf8');

const htaccessPath = resolve(root, 'public/.htaccess');
const htaccess = readFileSync(htaccessPath, 'utf8');
const generatedRules = [
  '# BEGIN GENERATED SEO ROUTES',
  ...blogRoutes.map((route) => `RewriteRule ^${route.slice(1)}/?$ /index.html [L,QSA]`),
  ...learnRoutes.map((route) => `RewriteRule ^${route.slice(1)}/?$ /index.html [L,QSA]`),
  '# END GENERATED SEO ROUTES',
].join('\n');
writeFileSync(
  htaccessPath,
  htaccess.replace(/# BEGIN GENERATED SEO ROUTES[\s\S]*?# END GENERATED SEO ROUTES/, generatedRules),
  'utf8',
);

console.log(`Generated sitemap.xml with ${sitemapRoutes.length} URLs`);
console.log(`Generated route-manifest.json with ${blogRoutes.length} blog URLs and ${learnRoutes.length} Learn URLs`);
