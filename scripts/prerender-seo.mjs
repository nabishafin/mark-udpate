import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const root = process.cwd();
const dist = resolve(root, 'dist');
const siteUrl = 'https://mdrnlifeddw.com';
const defaultImage = `${siteUrl}/products/mdrn-life-ddw-glass.webp`;
const baseHtml = readFileSync(resolve(dist, 'index.html'), 'utf8');
const registry = JSON.parse(readFileSync(resolve(root, 'src/data/content-registry.json'), 'utf8'));
const manifest = JSON.parse(readFileSync(resolve(dist, 'route-manifest.json'), 'utf8'));
const blogSource = readFileSync(resolve(root, 'src/lib/blog.ts'), 'utf8');
const learnSource = readFileSync(resolve(root, 'src/components/LearnPage.tsx'), 'utf8');
const shopifyProducts = await loadShopifyProducts();

const staticSeo = {
  '/': {
    title: '5 ppm Deuterium Depleted Water | Mdrn-Life DDW',
    description: 'Explore USA-made 5 ppm deuterium depleted water with independent IRMS testing, transparent lab reports, and glass or PET options.',
    h1: '5 ppm Deuterium Depleted Water',
  },
  '/science': {
    title: 'Deuterium Depleted Water Science | Mdrn-Life DDW',
    description: 'Explore the science of deuterium depleted water, hydrogen isotopes, mitochondrial research, and independent IRMS verification.',
    h1: 'The Science of Deuterium Depleted Water',
  },
  '/science/lab-testing': {
    title: 'Independent DDW Lab Testing | Mdrn-Life DDW',
    description: 'Review independent IRMS lab testing and batch documentation for Mdrn-Life 5 ppm deuterium depleted water.',
    h1: 'Independent DDW Lab Testing',
  },
  '/benefits': {
    title: 'DDW Research and Potential Benefits | Mdrn-Life',
    description: 'Review the proposed mechanisms, emerging research, and important limitations behind deuterium depleted water.',
    h1: 'DDW Research and Potential Benefits',
  },
  '/athletes-recovery': {
    title: 'DDW Hydration for Athletes and Recovery | Mdrn-Life',
    description: 'Explore cellular hydration, mitochondrial research, and the potential role of 5 ppm DDW in a structured recovery routine.',
    h1: 'Hydration, Athletes, and Recovery',
  },
  '/healthy-aging': {
    title: 'DDW and Healthy Aging Research | Mdrn-Life',
    description: 'Explore research into deuterium, mitochondrial function, cellular hydration, and healthy aging without overstating the evidence.',
    h1: 'DDW and Healthy Aging Research',
  },
  '/research': {
    title: 'Deuterium Depletion Research Library | Mdrn-Life',
    description: 'Browse references and educational resources related to deuterium depletion, stable isotopes, and mitochondrial research.',
    h1: 'Deuterium Depletion Research',
  },
  '/blogs/news': {
    title: 'Deuterium Depleted Water Articles | Mdrn-Life',
    description: 'Read educational articles about deuterium depleted water, hydration, mitochondria, performance, metabolism, and healthy aging.',
    h1: 'Deuterium Depleted Water Articles',
  },
  '/products': {
    title: 'Buy 5 ppm Deuterium Depleted Water | Mdrn-Life',
    description: 'Shop USA-made, independently tested 5 ppm deuterium depleted water in glass and PET bottles.',
    h1: 'Buy 5 ppm Deuterium Depleted Water',
  },
  '/founder': {
    title: 'About the Founder | Mdrn-Life DDW',
    description: 'Learn about the people and purpose behind Mdrn-Life DDW and its focus on independently verified 5 ppm water.',
    h1: 'About the Founder',
  },
  '/learn': {
    title: 'Learn About Deuterium Depleted Water | Mdrn-Life',
    description: 'Explore educational guides on deuterium, hydration, mitochondria, recovery, cognition, gut health, and performance.',
    h1: 'Learn About Deuterium Depleted Water',
  },
  '/contact': {
    title: 'Contact Mdrn-Life DDW',
    description: 'Contact the Mdrn-Life DDW support team with product, order, shipping, subscription, or general questions.',
    h1: 'Contact Mdrn-Life DDW',
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Mdrn-Life DDW',
  url: siteUrl,
  logo: `${siteUrl}/brand/logo.png`,
  sameAs: [
    'https://www.instagram.com/modernlifewater/',
    'https://www.tiktok.com/@modernlifeddw',
    'https://www.youtube.com/channel/UC19CpjpBOs1SxrAr47eX-xg',
  ],
};

function loadBuildEnv() {
  const values = { ...process.env };
  for (const filename of ['.env', '.env.local', '.env.example']) {
    const file = resolve(root, filename);
    if (!existsSync(file)) continue;
    for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue;
      const index = trimmed.indexOf('=');
      const key = trimmed.slice(0, index).trim();
      const value = trimmed.slice(index + 1).trim().replace(/^['"]|['"]$/g, '');
      if (values[key] === undefined) values[key] = value;
    }
  }
  return values;
}

async function loadShopifyProducts() {
  const env = loadBuildEnv();
  const endpoint = env.VITE_SHOPIFY_STOREFRONT_API_URL;
  const token = env.VITE_SHOPIFY_STOREFRONT_TOKEN;
  if (!endpoint || !token) return {};

  const query = `query ProductSeo {
    glass: product(handle: "mdrn-life-ddw") {
      title onlineStoreUrl featuredImage { url altText }
      variants(first: 20) { nodes { id availableForSale price { amount currencyCode } } }
    }
    pet: product(handle: "mdrn-life-ddw-pet-plastic") {
      title onlineStoreUrl featuredImage { url altText }
      variants(first: 20) { nodes { id availableForSale price { amount currencyCode } } }
    }
  }`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      },
      body: JSON.stringify({ query }),
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    if (payload.errors?.length) throw new Error(payload.errors[0]?.message || 'GraphQL error');

    const selectVariant = (product, numericId) => {
      if (!product) return null;
      const variants = product.variants?.nodes || [];
      const variant = variants.find((item) => item.id.endsWith(`/${numericId}`)) || variants[0];
      return variant ? { ...product, variant } : null;
    };

    const products = {
      glass: selectVariant(payload.data?.glass, env.VITE_SHOPIFY_GLASS_VARIANT_ID),
      pet: selectVariant(payload.data?.pet, env.VITE_SHOPIFY_PET_VARIANT_ID),
    };
    console.log('Enriched product structured data from the Shopify Storefront API');
    return products;
  } catch (error) {
    console.warn(`Shopify product schema enrichment skipped: ${error instanceof Error ? error.message : error}`);
    return {};
  }
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function jsonLd(value) {
  return `<script type="application/ld+json">${JSON.stringify(value).replace(/</g, '\\u003c')}</script>`;
}

function absolute(path) {
  return path.startsWith('http') ? path : `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

function breadcrumb(path, title, parentName, parentPath) {
  const items = [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` }];
  if (parentName && parentPath) {
    items.push({ '@type': 'ListItem', position: 2, name: parentName, item: absolute(parentPath) });
  }
  items.push({ '@type': 'ListItem', position: items.length + 1, name: title, item: absolute(path) });
  return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items };
}

function extractBlogContent(slug) {
  const escaped = slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = blogSource.match(new RegExp(`handle:\\s*'${escaped}'[\\s\\S]*?content:\\s*\\\`([\\s\\S]*?)\\\`,`));
  return match?.[1] || '';
}

function decodeTsString(value) {
  return String(value || '').replace(/\\'/g, "'").replace(/\\\\/g, '\\');
}

function extractLearnContent(slug) {
  const marker = `slug: '${slug}'`;
  const start = learnSource.indexOf(marker);
  if (start < 0) return '';
  const next = learnSource.indexOf("\n    slug: '", start + marker.length);
  const block = learnSource.slice(start, next < 0 ? learnSource.indexOf('\n];', start) : next);
  const intro = decodeTsString(block.match(/intro:\s*'((?:\\'|[^'])*)'/)?.[1]);
  const sections = [...block.matchAll(/heading:\s*'((?:\\'|[^'])*)'[\s\S]*?body:\s*'((?:\\'|[^'])*)'/g)];
  return [
    intro ? `<p>${escapeHtml(intro)}</p>` : '',
    ...sections.map((match) => `<section><h2>${escapeHtml(decodeTsString(match[1]))}</h2><p>${escapeHtml(decodeTsString(match[2]))}</p></section>`),
  ].join('');
}

function productShell() {
  return `
    <p>Mdrn-Life DDW is produced to a target deuterium concentration of 5 parts per million and is available in glass and PET packaging. Product details, current pricing, subscription options, inventory, and checkout availability are loaded directly from the official Shopify storefront when the interactive application starts.</p>
    <p>Every purchase option refers to the same independently tested water standard. Before choosing a package, review the <a href="/science">science overview</a> and the <a href="/science/lab-testing">independent lab testing page</a>. Those pages explain what deuterium is, how isotope ratio mass spectrometry is used, and where the current evidence has limits.</p>
    <p>Glass may suit customers who prefer a reusable, rigid container, while PET offers a lighter shipping format. Packaging choice does not change the stated 5 ppm specification. For questions about cases, subscriptions, shipping, returns, or an existing order, use the <a href="/contact">contact page</a> before purchasing.</p>
    <p>Mdrn-Life DDW is sold as a packaged water product, not as a medicine or a replacement for medical care. Educational material on this website discusses research and proposed biological mechanisms; it does not promise that the product will diagnose, treat, cure, or prevent disease.</p>
    <ul><li>5 ppm DDW in glass bottles</li><li>5 ppm DDW in PET bottles</li></ul>`;
}

function productSchemas() {
  const products = [
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'Mdrn-Life DDW 5 ppm - Glass Bottles',
      description: 'USA-made 5 ppm deuterium depleted water in glass bottles.',
      image: `${siteUrl}/products/mdrn-life-ddw-glass.webp`,
      url: `${siteUrl}/products`,
      brand: { '@type': 'Brand', name: 'Mdrn-Life DDW' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'Mdrn-Life DDW 5 ppm - PET Bottles',
      description: 'USA-made 5 ppm deuterium depleted water in PET bottles.',
      image: `${siteUrl}/products/mdrn-life-ddw-pet.webp`,
      url: `${siteUrl}/products`,
      brand: { '@type': 'Brand', name: 'Mdrn-Life DDW' },
    },
  ].map((product, index) => {
    const live = index === 0 ? shopifyProducts.glass : shopifyProducts.pet;
    const price = live?.variant?.price;
    return {
      ...product,
      ...(live?.title ? { name: live.title } : {}),
      ...(live?.featuredImage?.url ? { image: live.featuredImage.url } : {}),
      ...(price?.amount && price?.currencyCode
        ? {
            offers: {
              '@type': 'Offer',
              url: product.url,
              price: price.amount,
              priceCurrency: price.currencyCode,
              availability: live.variant.availableForSale
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
              itemCondition: 'https://schema.org/NewCondition',
            },
          }
        : {}),
    };
  });
  return [
    ...products,
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Mdrn-Life DDW product options',
      itemListElement: products.map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: product,
      })),
    },
  ];
}

function pageData(path) {
  const entry = registry.find((item) => {
    const route = item.contentType === 'blog' ? `/blogs/news/${item.slug}` : `/learn/${item.slug}`;
    return route === path;
  });
  if (!entry) {
    const base = staticSeo[path];
    if (!base) throw new Error(`Missing SEO data for ${path}`);
    const shell = path === '/products'
      ? productShell()
      : `<p>${escapeHtml(base.description)}</p><p><a href="/science/lab-testing">Review independent lab testing</a> or <a href="/contact">contact Mdrn-Life DDW</a> for assistance.</p>`;
    return {
      ...base,
      type: path === '/products' ? 'product' : 'website',
      image: defaultImage,
      shell,
      schemas: path === '/products'
        ? productSchemas()
        : [{
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: base.h1,
            url: absolute(path),
            description: base.description,
          }],
    };
  }

  const isBlog = entry.contentType === 'blog';
  const parentName = isBlog ? 'Articles' : 'Learn';
  const parentPath = isBlog ? '/blogs/news' : '/learn';
  const schema = {
    '@context': 'https://schema.org',
    '@type': isBlog ? 'BlogPosting' : 'Article',
    headline: entry.title,
    description: entry.description,
    url: absolute(path),
    mainEntityOfPage: absolute(path),
    image: absolute(entry.image || '/brand/logo.png'),
    author: { '@type': 'Organization', name: 'Mdrn-Life DDW' },
    publisher: {
      '@type': 'Organization',
      name: 'Mdrn-Life DDW',
      logo: { '@type': 'ImageObject', url: `${siteUrl}/brand/logo.png` },
    },
    ...(entry.publishedAt ? { datePublished: entry.publishedAt } : {}),
  };
  const articleBody = isBlog ? extractBlogContent(entry.slug) : extractLearnContent(entry.slug);
  if (!articleBody) throw new Error(`Could not extract article body for ${path}`);
  return {
    title: `${entry.title} | Mdrn-Life DDW`,
    description: entry.description,
    h1: entry.title,
    type: 'article',
    image: absolute(entry.image || '/brand/logo.png'),
    shell: `<p><a href="${parentPath}">Back to ${parentName}</a></p>${articleBody}`,
    schemas: [schema, breadcrumb(path, entry.title, parentName, parentPath)],
  };
}

function replaceMeta(html, attribute, key, value) {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`<meta\\s+${attribute}=["']${escapedKey}["'][^>]*>`, 'i');
  const replacement = `<meta ${attribute}="${key}" content="${escapeHtml(value)}" />`;
  return pattern.test(html) ? html.replace(pattern, replacement) : html.replace('</head>', `  ${replacement}\n</head>`);
}

function render(path) {
  const data = pageData(path);
  const canonical = absolute(path);
  let html = baseHtml
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(data.title)}</title>`)
    .replace(/<link\s+rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${canonical}" />`)
    .replace(/<script\s+type=["']application\/ld\+json["']>[\s\S]*?<\/script>\s*/gi, '')
    .replace(
      '<div id="root"></div>',
      `<div id="root"><main id="main-content" data-prerendered="true"><div class="prerender-loader" aria-hidden="true"><span class="prerender-loader__mark"><img src="/brand/logo.png" alt="" width="42" height="19" /></span><span class="prerender-loader__line"></span></div><article class="prerender-content"><h1>${escapeHtml(data.h1)}</h1>${data.shell}</article></main></div>`,
    );

  html = replaceMeta(html, 'name', 'description', data.description);
  html = replaceMeta(html, 'property', 'og:title', data.title);
  html = replaceMeta(html, 'property', 'og:description', data.description);
  html = replaceMeta(html, 'property', 'og:url', canonical);
  html = replaceMeta(html, 'property', 'og:type', data.type);
  html = replaceMeta(html, 'property', 'og:image', data.image);
  html = replaceMeta(html, 'name', 'twitter:title', data.title);
  html = replaceMeta(html, 'name', 'twitter:description', data.description);
  html = replaceMeta(html, 'name', 'twitter:image', data.image);
  const schemas = [organizationSchema, ...data.schemas].map(jsonLd).join('\n    ');
  html = html.replace('</head>', `    ${schemas}\n  </head>`);
  return html;
}

for (const route of manifest.indexableRoutes) {
  const output = route === '/' ? resolve(dist, 'index.html') : resolve(dist, route.slice(1), 'index.html');
  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, render(route), 'utf8');
}

// Keep lossless source PNGs in the repository, but do not ship duplicate
// multi-megabyte files once equivalent WebP assets have been produced.
const organAssetDir = resolve(dist, 'organ-panels');
if (existsSync(organAssetDir)) {
  for (const filename of readdirSync(organAssetDir)) {
    if (/\.(?:png|jpe?g)$/i.test(filename)) {
      rmSync(resolve(organAssetDir, filename), { force: true });
    }
  }
}

console.log(`Generated route-specific initial HTML for ${manifest.indexableRoutes.length} indexable routes`);
