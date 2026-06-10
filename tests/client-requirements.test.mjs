import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const rootUrl = new URL('../', import.meta.url);
const rootPath = fileURLToPath(rootUrl);
const file = (path) => readFileSync(new URL(path, rootUrl), 'utf8');
const textExtensions = new Set(['.cjs', '.css', '.html', '.json', '.md', '.mjs', '.ts', '.tsx']);
const blockedGeneratorPattern = new RegExp(
  `${String.fromCharCode(109, 97, 103, 105, 99)}\\s*${String.fromCharCode(112, 97, 116, 116, 101, 114, 110, 115)}`,
  'i',
);

function projectText(dir = rootPath) {
  return readdirSync(dir)
    .filter((name) => !['.git', 'node_modules', 'tests', 'client files and feedback'].includes(name))
    .map((name) => {
      const full = join(dir, name);
      const stat = statSync(full);
      if (stat.isDirectory()) return projectText(full);
      const ext = name.slice(name.lastIndexOf('.'));
      return textExtensions.has(ext) ? readFileSync(full, 'utf8') : '';
    })
    .join('\n');
}

test('project metadata and copy contain no generator references', () => {
  assert.doesNotMatch(projectText(), blockedGeneratorPattern);
});

test('homepage head implements the client supplied SEO metadata and schema', () => {
  const html = file('index.html');

  assert.match(html, /Mdrn-Life DDW - 5 ppm Deuterium-Depleted Water/i);
  assert.match(html, /world's most depleted deuterium water at 5 ppm/i);
  assert.match(html, /https:\/\/mdrnlifeddw\.com\//i);
  assert.match(html, /application\/ld\+json/i);
  assert.match(html, /Mdrn-Life DDW/i);
});

test('app exposes the lab testing credibility page content from the client SEO brief', () => {
  const appText = projectText();

  assert.match(appText, /science\/lab-testing/i);
  assert.match(appText, /Hydroisotop GmbH/i);
  assert.match(appText, /USGS Reston Stable Isotope Lab/i);
  assert.match(appText, /Isotope Ratio Mass Spectrometry/i);
  assert.match(appText, /independently verified/i);
});

test('body navigation returns users to the full hero section', () => {
  const nav = file('src/components/Nav.tsx');

  assert.match(nav, /\{\s*label:\s*'Explore the Body',\s*href:\s*'#top'\s*\}/);
});

test('hero explore body CTA keeps users at the full hero section', () => {
  const hero = file('src/components/Hero.tsx');

  assert.match(hero, /href="#top"[^>]*>\s*Explore the Body/i);
});

test('products reflect the client feedback: one 5 ppm concentration in glass and PET', () => {
  const products = file('src/components/Products.tsx');

  assert.match(products, /5 ppm/i);
  assert.match(products, /Glass/i);
  assert.match(products, /PET/i);
  assert.doesNotMatch(products, /25 ppm|10 ppm|15 ppm|CORE PROTOCOL|ELITE|RESET/i);
});

test('interactive body side panel includes the client-provided systems and micro CTAs', () => {
  const organData = file('src/components/organData.ts');

  for (const phrase of [
    'Support Cognitive Performance From Within',
    'Hydrate the System Behind Vision',
    'Hydration Begins Here',
    'Fuel the Flow of Life',
    'Support Natural Detoxification Pathways',
    'Support the Foundation of Wellness',
    'Hydrate Recovery at the Cellular Level',
    'Radiance Starts Within',
    'Support Energy at the Source',
  ]) {
    assert.match(organData, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
  }
});

test('mobile body interaction uses a side drawer instead of full-screen overlay', () => {
  const hero = file('src/components/Hero.tsx');
  const body = file('src/components/InteractiveBody.tsx');
  const panel = file('src/components/OrganPanel.tsx');

  assert.match(hero, /activeId \? '-translate-x-\[34vw\] sm:-translate-x-\[24vw\] lg:-translate-x-\[15vw\] scale-100'/);
  assert.match(body, /hpe-body-stage/);
  assert.match(file('src/index.css'), /\.hpe-body-stage\s*\{\s*flex:\s*0 0 auto;\s*width:\s*clamp\(680px,\s*352vw,\s*760px\);\s*\}/);
  assert.match(panel, /right-3 bottom-3 w-\[78vw\] max-w-\[330px\]/);
  assert.doesNotMatch(panel, /w-\[calc\(100%-2rem\)\]/);
});

test('navigation follows the client supplied IA and keeps shop/contact paths explicit', () => {
  const nav = file('src/components/Nav.tsx');

  for (const label of [
    'Home',
    'Explore the Body',
    'The Science',
    'Benefits',
    'Athletes & Recovery',
    'Healthy Aging',
    'Shop',
    'Research',
    'Contact',
  ]) {
    assert.match(nav, new RegExp(`label:\\s*'${label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'`));
  }

  assert.match(nav, /href:\s*'#products'/);
  assert.match(nav, /href:\s*'#contact'/);
});

test('hero uses a cleaner premium background instead of the rejected grid and particle pattern', () => {
  const hero = file('src/components/Hero.tsx');
  const body = file('src/components/InteractiveBody.tsx');
  const css = file('src/index.css');

  assert.match(hero, /hpe-hero-premium/);
  assert.match(hero, /hpe-hero-liquid/);
  assert.doesNotMatch(hero, /hpe-grid/);
  assert.doesNotMatch(hero, /<Particles/);
  assert.doesNotMatch(hero, /hpe-hero-waterline/);
  assert.doesNotMatch(body, /hpe-glow-cyan|hpeOrbit|hpeScan|Orbiting rings|Ambient backdrop glow/);
  assert.match(body, /hpe-body-clean-stage/);
  assert.match(css, /\.hpe-hero-premium/);
  assert.match(css, /\.hpe-body-clean-stage/);
});

test('products route all commerce actions through Shopify-safe checkout handoff helpers', () => {
  const products = file('src/components/Products.tsx');
  const shopify = file('src/lib/shopify.ts');
  const tracking = file('src/lib/tracking.ts');

  assert.match(products, /getShopifyLinks/);
  assert.match(products, /trackCommerceEvent\('product_viewed'/);
  assert.match(products, /Buy Now/);
  assert.match(products, /Add to Cart/);
  assert.match(products, /Subscribe/);
  assert.doesNotMatch(products, /setTimeout\(\(\) => setAdding\(null\)/);

  assert.match(shopify, /VITE_SHOPIFY_STORE_DOMAIN/);
  assert.match(shopify, /\/cart\/\$\{variantId\}:\$\{quantity\}/);
  assert.match(shopify, /channel=buy_button/);
  assert.match(shopify, /subscriptionCheckoutUrl/);

  for (const phrase of ['Meta Pixel', 'Google Analytics 4', 'TikTok Pixel', 'Klaviyo']) {
    assert.match(tracking, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('developer handoff documents required Shopify, tracking, subscription, and social inputs', () => {
  const doc = file('docs/shopify-integration-handoff.md');

  for (const phrase of [
    'Shopify store domain',
    'variant ID',
    'Buy Button',
    'Storefront API',
    'Meta Pixel',
    'Google Analytics 4',
    'Google Ads',
    'TikTok Pixel',
    'Klaviyo',
    'Recharge',
    'Appstle',
    'Skio',
    'Shopify Subscriptions',
    'Instagram',
    'TikTok',
    'YouTube',
  ]) {
    assert.match(doc, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
  }
});
