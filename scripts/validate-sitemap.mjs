import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const sitemap = readFileSync(resolve(root, 'dist/sitemap.xml'), 'utf8');
const manifest = JSON.parse(readFileSync(resolve(root, 'dist/route-manifest.json'), 'utf8'));
const failures = [];

if (!sitemap.startsWith('<?xml version="1.0" encoding="UTF-8"?>')) failures.push('missing XML declaration');
if (!/<urlset\s+xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/.test(sitemap)) failures.push('invalid urlset root');
if (!sitemap.trimEnd().endsWith('</urlset>')) failures.push('missing closing urlset');
if (/<html|<!doctype/i.test(sitemap)) failures.push('contains HTML');

const urls = [...sitemap.matchAll(/<url><loc>([^<]+)<\/loc><\/url>/g)].map((match) => match[1]);
if (urls.length !== manifest.indexableRoutes.length) failures.push(`expected ${manifest.indexableRoutes.length} URLs, found ${urls.length}`);
if (new Set(urls).size !== urls.length) failures.push('contains duplicate URLs');

for (const route of manifest.indexableRoutes) {
  const expected = `https://mdrnlifeddw.com${route === '/' ? '/' : route}`;
  if (!urls.includes(expected)) failures.push(`missing ${expected}`);
}

if (failures.length) throw new Error(`Sitemap validation failed:\n- ${failures.join('\n- ')}`);
console.log(`Validated sitemap.xml: ${urls.length} unique canonical URLs`);
