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

  assert.match(html, /Mdrn-Life DDW — 5 ppm Deuterium-Depleted Water/i);
  assert.match(html, /world's most depleted deuterium water at 5 ppm/i);
  assert.match(html, /https:\/\/mdrnlifeddw\.com\//i);
  assert.match(html, /application\/ld\+json/i);
  assert.match(html, /Mdrn-Life DDW/i);
  assert.match(html, /og:image" content="https:\/\/mdrnlifeddw\.com\/products\/mdrn-life-ddw-glass\.webp/);
});

test('app exposes the lab testing credibility page content from the client SEO brief', () => {
  const appText = projectText();
  const seo = file('src/lib/seo.ts');
  const lab = file('src/components/LabTesting.tsx');

  assert.match(appText, /science\/lab-testing/i);
  assert.match(appText, /Hydroisotop GmbH/i);
  assert.match(appText, /USGS Reston Stable Isotope Lab/i);
  assert.match(appText, /Isotope Ratio Mass Spectrometry/i);
  assert.match(appText, /independently verified/i);
  assert.match(seo, /Independently Lab-Tested DDW \| Mdrn-Life DDW/);
  assert.match(seo, /deuterium depleted water brands/);
  assert.match(seo, /FAQPage/);
  assert.match(seo, /Article/);
  assert.match(seo, /BreadcrumbList/);
  for (const section of [
    'The Problem With Unverified Claims',
    'What Deuterium Testing Actually Measures',
    'Meet the Labs',
    'Batch-by-Batch Transparency',
    'What This Means for You',
    'FAQ Block',
  ]) {
    assert.match(lab, new RegExp(section.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
  assert.match(lab, /ATP Synthase/);
  assert.match(lab, /competitor claims/i);
  assert.match(lab, /LAB_REPORTS/);
  assert.match(lab, /hydroisotop-batch\.pdf/);
  assert.match(lab, /usgs-reston-batch\.pdf/);
  assert.match(lab, /View batch PDF/);
  assert.match(lab, /<LabReportPanel/);
  assert.match(lab, /<iframe/);
  assert.doesNotMatch(lab, /Add the actual Hydroisotop batch PDF here when the client provides the file/);
  assert.doesNotMatch(lab, /Add the actual USGS Reston batch PDF here when the client provides the file/);
  assert.ok(statSync(join(rootPath, 'public/lab-reports/hydroisotop-batch.pdf')).size > 0);
  assert.ok(statSync(join(rootPath, 'public/lab-reports/usgs-reston-batch.pdf')).size > 0);
  assert.match(lab, /ChevronDown/);
  assert.match(lab, /aria-expanded=\{openFaq === index\}/);
  assert.match(lab, /DeuteriumMeasurement/);
  for (const schemaPhrase of [
    'Downloadable lab reports are available on this page.',
    'Ships to the US, Canada, and Mexico with a 30-day guarantee.',
    'reverse osmosis, electrolysis, hydrogen infusion, and ionization',
    'Most DDW brands are produced in Eastern Europe or China at 25–125 ppm',
  ]) {
    assert.match(seo, new RegExp(schemaPhrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
  assert.match(seo, /Buy Deuterium-Depleted Water — 5 ppm Verified/);
});

test('site is routed as a multipage experience instead of one long homepage', () => {
  const app = file('src/App.tsx');
  const nav = file('src/components/Nav.tsx');
  const science = file('src/components/ScienceSection.tsx');
  const vercel = file('vercel.json');

  assert.match(app, /switch \(pathname\)/);
  const appRoutes = [
    '/science',
    '/science/lab-testing',
    '/benefits',
    '/athletes-recovery',
    '/healthy-aging',
    '/products',
    '/products/cart',
    '/research',
    '/contact',
  ];
  const navRoutes = appRoutes.filter((route) => !['/science/lab-testing', '/products/cart'].includes(route));

  for (const route of appRoutes) {
    assert.match(app, new RegExp(route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  for (const route of navRoutes) {
    assert.match(nav, new RegExp(`href:\\s*'${route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'|href="${route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`));
  }

  assert.doesNotMatch(nav, /label:\s*'Lab Testing'/);
  assert.match(science, /href="\/science\/lab-testing"[\s\S]*View Lab Testing/);
  assert.match(app, /case '\/products\/cart':\s*return <CartPage \/>/);
  assert.match(app, /<main>\s*\{page\}\s*<CTAFooter \/>\s*<\/main>/);
  assert.doesNotMatch(app, /pathname !== '\/contact'/);
  assert.doesNotMatch(app, /<main>\s*<Hero[\s\S]*<ScienceSection \/>[\s\S]*<LabTesting \/>[\s\S]*<Benefits \/>/);
  assert.match(vercel, /"source":\s*"\/\(\.\*\)"/);
  assert.match(vercel, /"destination":\s*"\/index\.html"/);
});

test('hero presents the body experience without the removed lower CTA buttons', () => {
  const hero = file('src/components/Hero.tsx');

  assert.match(hero, /Every Cell Needs Energy\./);
  assert.match(hero, /Every System Needs/);
  assert.match(hero, /Hydration\./);
  assert.match(hero, /Explore how advanced Deuterium Depleted Water Hydration supports the brain, joints, gut/);
  assert.doesNotMatch(hero, /Mdrn-Life DDW - 5 ppm/);
  assert.doesNotMatch(hero, /href="\/explore-the-body"[^>]*>\s*Explore the Body/i);
  assert.doesNotMatch(hero, /Discover DDW Science/);
  assert.doesNotMatch(hero, /Start Your Hydration Journey/);
});

test('home and explore body pages remove unwanted section eyebrow labels', () => {
  const app = file('src/App.tsx');
  const organShowcase = file('src/components/OrganShowcase.tsx');

  assert.doesNotMatch(app, />\s*Pages\s*</);
  assert.doesNotMatch(app, /PAGE_LINKS/);
  assert.doesNotMatch(app, /<OrganShowcase/);
  assert.doesNotMatch(organShowcase, />\s*Systems\s*</);
});

test('products reflect the client feedback: one 5 ppm concentration in glass and PET', () => {
  const products = `${file('src/components/Products.tsx')}\n${file('src/lib/products.ts')}`;

  assert.match(products, /5 ppm/i);
  assert.match(products, /Glass/i);
  assert.match(products, /PET/i);
  assert.match(products, /mdrn-life-ddw-glass\.webp/);
  assert.match(products, /mdrn-life-ddw-pet\.webp/);
  assert.match(products, /<img/);
  assert.match(products, /independently verified/);
  assert.doesNotMatch(products, /function BottleViz|<svg viewBox="0 0 200 280"/);
  assert.doesNotMatch(products, /25 ppm|10 ppm|15 ppm|CORE PROTOCOL|ELITE|RESET/i);
});

test('interactive body hotspots are calibrated to visible anatomy regions', () => {
  const body = file('src/components/InteractiveBody.tsx');

  for (const snippet of [
    /brain:\s*\{\s*x:\s*50,\s*y:\s*6\.5/,
    /eyes:\s*\{\s*x:\s*49\.15,\s*y:\s*10\.6/,
    /mouth:\s*\{\s*x:\s*50\.2,\s*y:\s*13\.5/,
    /lungs:\s*\{\s*x:\s*48\.4,\s*y:\s*25\.4/,
    /muscles:\s*\{\s*x:\s*42\.4,\s*y:\s*31\.4/,
    /skin:\s*\{\s*x:\s*57\.8,\s*y:\s*34\.8/,
    /joints:\s*\{\s*x:\s*52\.4,\s*y:\s*72\.2/,
  ]) {
    assert.match(body, snippet);
  }

  assert.match(body, /const PREVIEW_SIDE/);
  assert.match(body, /right:\s*'calc\(100% \+ 10px\)'/);
  assert.match(body, /left:\s*'calc\(100% \+ 10px\)'/);
  assert.match(body, /w-40[\s\S]*sm:w-44/);
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

test('mobile body interaction uses a split view instead of blocking the hotspots', () => {
  const hero = file('src/components/Hero.tsx');
  const body = file('src/components/InteractiveBody.tsx');
  const panel = file('src/components/OrganPanel.tsx');

  assert.match(hero, /activeId \? '-translate-x-\[28vw\] scale-110 sm:-translate-x-\[24vw\] sm:scale-105 lg:-translate-x-\[15vw\] lg:scale-100'/);
  assert.match(body, /hpe-body-stage/);
  assert.match(body, /width:\s*44,\s*height:\s*44/);
  assert.match(body, /\{organ\.name\}/);
  assert.match(body, /aria-label=\{`Inspect \$\{organ\.name\}`\}/);
  assert.match(file('src/index.css'), /\.hpe-body-stage\s*\{\s*flex:\s*0 0 auto;\s*width:\s*clamp\(760px,\s*230vw,\s*860px\);\s*\}/);
  assert.match(panel, /right-2 top-24[\s\S]*w-\[43vw\]/);
  assert.match(panel, /sm:right-3 sm:w-\[78vw\] sm:max-w-\[380px\]/);
  assert.doesNotMatch(panel, /w-\[calc\(100%-2rem\)\]/);
});

test('navigation follows the client supplied IA and keeps shop/contact paths explicit', () => {
  const nav = file('src/components/Nav.tsx');
  const footer = file('src/components/CTAFooter.tsx');
  const contact = file('src/components/ContactPage.tsx');
  const app = file('src/App.tsx');

  assert.match(nav, /aria-label=\{mobileOpen \? 'Close navigation menu' : 'Open navigation menu'\}/);
  assert.match(nav, /lg:hidden/);
  assert.match(nav, /setMobileOpen/);

  for (const label of [
    'Home',
    'The Science',
    'Benefits',
    'Athletes & Recovery',
    'Healthy Aging',
    'Research',
    'Contact',
  ]) {
    assert.match(nav, new RegExp(`label:\\s*'${label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'`));
  }

  assert.match(nav, /href="\/products"/);
  assert.match(nav, /src="\/brand\/logo\.png"/);
  assert.match(nav, /href:\s*'\/contact'/);
  assert.doesNotMatch(footer, /<footer id="contact"/);
  assert.doesNotMatch(footer, /<form[\s\S]*name="name"[\s\S]*name="email"[\s\S]*name="message"/);
  assert.doesNotMatch(footer, /VITE_CONTACT_FORM_ENDPOINT/);
  assert.match(contact, /Contact Mdrn-Life DDW/);
  assert.match(contact, /Questions about 5 ppm DDW, lab reports, wholesale, subscriptions,\s+or practitioner support/);
  assert.match(contact, /\(888\) 391-8023/);
  assert.match(contact, /Support@orisefinance\.com/);
  assert.match(contact, /1436 E Atlantic Blvd Unit C, Pompano Beach, FL 33060/);
  assert.doesNotMatch(contact, /Lab report requests/);
  assert.doesNotMatch(contact, /Hydroisotop GmbH, USGS Reston, and verification questions/);
  assert.doesNotMatch(footer, /Current Store/);
  assert.match(contact, /<motion\.form[\s\S]*name="name"[\s\S]*name="email"[\s\S]*name="message"/);
  assert.match(contact, /VITE_CONTACT_FORM_ENDPOINT/);
  assert.match(app, /case '\/contact':\s*return <ContactPage \/>/);
});

test('athletes and healthy aging pages use the latest client-provided copy', () => {
  const athletes = file('src/components/AthletesRecovery.tsx');
  const healthy = file('src/components/HealthyAging.tsx');
  const app = file('src/App.tsx');

  for (const phrase of [
    'Your body is built to move. To push. To adapt. To recover.',
    'Every sprint, lift, ride, run, match, and training session asks something from your body.',
    'That is why serious athletes do not treat hydration as an afterthought.',
    'Produced to deuterium levels as low as 5 PPM',
    'Advanced Hydration for Athletes, Recovery & Performance-Focused Living.',
    'Live Better. Longer.',
  ]) {
    assert.match(athletes, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  for (const phrase of [
    'Aging is not just about time.',
    'It is about how you live each day.',
    'Modern wellness is changing.',
    'The person who reads labels.',
    'Most water contains naturally occurring deuterium at approximately 150-155 PPM.',
    'Premium Deuterium-Depleted Water for Longevity-Focused Living.',
    'Live Better. Longer.',
  ]) {
    assert.match(healthy, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  assert.match(app, /case '\/athletes-recovery':\s*return <AthletesRecovery \/>/);
  assert.match(app, /case '\/healthy-aging':\s*return <HealthyAging \/>/);
  assert.match(athletes, /TrainingSimulation/);
  assert.match(athletes, /Recovery Simulation/);
  assert.match(healthy, /LongevitySimulation/);
  assert.match(healthy, /Longevity Simulation/);
});

test('visible section labels do not use rejected numeric prefixes', () => {
  const componentText = [
    file('src/components/ScienceSection.tsx'),
    file('src/components/LabTesting.tsx'),
    file('src/components/Benefits.tsx'),
    file('src/components/AthletesRecovery.tsx'),
    file('src/components/HealthyAging.tsx'),
    file('src/components/OrganShowcase.tsx'),
    file('src/components/Products.tsx'),
    file('src/components/Research.tsx'),
    file('src/components/CTAFooter.tsx'),
  ].join('\n');

  assert.doesNotMatch(componentText, /\b\d{2}\s*-\s*(The Science|Lab Testing|Benefits|Athletes|Systems|The DDW Formats|Research|Begin)/);
  assert.doesNotMatch(componentText, /06 - Systems|08 - Begin/);
});

test('site removes unsupported testimonial and invented metric content', () => {
  const app = file('src/App.tsx');
  const appText = projectText();

  assert.match(app, /components\/Benefits/);
  assert.match(app, /components\/AthletesRecovery/);
  assert.match(app, /components\/Research/);
  assert.doesNotMatch(app, /Testimonials|OxidativeStress|CellularHydration/);

  for (const blocked of [
    'Dr. Marcus Rhee',
    'Mount Sinai',
    'Clinical Trials',
    '48,200+',
    'ROS reduction',
    'Glutathione',
    'DNA repair',
    'Aquaporin entry',
    'Cytosol penetration',
    'up to a 14% increase',
    '7-14 days',
    'client brief',
    'client materials',
    'client strategy',
  ]) {
    assert.doesNotMatch(appText, new RegExp(blocked.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
  }
});

test('footer includes the client supplied social channels', () => {
  const footer = file('src/components/CTAFooter.tsx');

  assert.match(footer, /https:\/\/www\.instagram\.com\/modernlifewater\//);
  assert.match(footer, /https:\/\/www\.tiktok\.com\/@modernlifeddw/);
  assert.match(footer, /https:\/\/www\.youtube\.com\/channel\/UC19CpjpBOs1SxrAr47eX-xg/);
  assert.match(footer, /aria-label=\{label\}/);
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

  assert.match(products, /addCartItem/);
  assert.match(products, /trackCommerceEvent\('product_viewed'/);
  assert.match(products, /Add to Cart/);
  assert.match(products, /Adding/);
  assert.match(products, /ShoppingCart/);
  assert.match(products, /\/products\/cart/);
  assert.doesNotMatch(products, />\s*Buy Now\s*</);
  assert.doesNotMatch(products, />\s*Subscribe\s*</);
  assert.doesNotMatch(products, />\s*View\s*</);
  assert.doesNotMatch(products, /getShopifyLinks/);

  assert.match(shopify, /VITE_SHOPIFY_STORE_DOMAIN/);
  assert.match(shopify, /VITE_SHOPIFY_CHECKOUT_DOMAIN/);
  assert.match(shopify, /orise-6796\.myshopify\.com/);
  assert.match(shopify, /forceShopifyCheckoutDomain/);
  assert.match(shopify, /buildShopifyCheckoutUrl/);
  assert.match(shopify, /cartLines\.join\(','\)/);
  assert.doesNotMatch(shopify, /channel=buy_button/);
  assert.match(shopify, /cartCreate/);

  for (const phrase of ['Meta Pixel', 'Google Analytics 4', 'TikTok Pixel', 'Klaviyo']) {
    assert.match(tracking, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('cart page supports local cart quantity controls, removal, and Shopify checkout handoff', () => {
  const app = file('src/App.tsx');
  const cart = file('src/components/CartPage.tsx');
  const cartLib = file('src/lib/cart.ts');
  const products = file('src/lib/products.ts');
  const shopify = file('src/lib/shopify.ts');

  assert.match(app, /import \{ CartPage \} from '\.\/components\/CartPage'/);
  assert.match(cart, /Your Cart/);
  assert.match(cart, /Continue shopping/);
  assert.match(cart, /Estimated total/);
  assert.match(cart, /Secure Shopify Checkout/);
  assert.match(cart, /Order Summary/);
  assert.match(cart, /\/products/);
  assert.match(cart, /handleCheckout/);
  assert.match(cart, /buildShopifyCheckoutUrl/);
  assert.match(cart, /updateCartItemQuantity/);
  assert.match(cart, /removeCartItem/);
  assert.match(cart, /Minus/);
  assert.match(cart, /Plus/);
  assert.match(cart, /Trash2/);
  assert.match(cart, /Check out/);
  assert.match(cartLib, /localStorage/);
  assert.match(cartLib, /addCartItem/);
  assert.match(cartLib, /clearCart/);
  assert.match(products, /glass/);
  assert.match(products, /pet/);
  assert.match(shopify, /variantId/);
});

test('developer handoff documents required Shopify, tracking, subscription, and social inputs', () => {
  const doc = file('docs/shopify-integration-handoff.md');
  const contactDoc = file('docs/contact-form-handoff.md');

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
  assert.match(doc, /\/products\/cart/);
  assert.match(contactDoc, /VITE_CONTACT_FORM_ENDPOINT/);
  assert.match(contactDoc, /Resend|SendGrid|Mailgun|Postmark/);
  assert.match(contactDoc, /Cloudflare Turnstile|Google reCAPTCHA/);
});

test('side panel content matches the client PDF copy and keeps internal labels out of the UI', () => {
  const organData = file('src/components/organData.ts');
  const panel = file('src/components/OrganPanel.tsx');
  const mouthBlock = organData.match(/id: 'mouth',[\s\S]*?color: 'green',/)?.[0] ?? '';
  const lungsBlock = organData.match(/id: 'lungs',[\s\S]*?color: 'blue',/)?.[0] ?? '';

  for (const phrase of [
    'The brain is nearly 75% water and uses enormous amounts of energy every second.',
    'Modern research explores how hydration may support:',
    'Dehydration may increase:',
    'Mdrn-Life DDW is designed to support hydration at the cellular level while supporting mitochondrial efficiency and oxidative balance.',
    'The eyes depend on healthy hydration and circulation to function properly.',
    'Water absorption starts immediately throughout the mouth and digestive tract.',
    'The cardiovascular system delivers oxygen, nutrients, and hydration throughout the body.',
    'Every breath supports the mitochondria — the tiny energy factories inside your cells.',
    'The liver helps process metabolic waste products, including ammonia created during protein metabolism.',
    'Nearly 70% of the immune system is connected to the gut.',
    'The kidneys help regulate fluid balance while filtering waste from the bloodstream.',
    'During intense activity, muscles generate metabolic waste and oxidative stress.',
    'Joints rely on hydration for lubrication, mobility, and shock absorption.',
    'The skin reflects internal hydration and cellular balance.',
    'Mitochondria produce ATP, the energy currency used by every cell in the body.',
  ]) {
    assert.match(organData, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  for (const cta of [
    'Support Cognitive Performance From Within',
    'Hydrate the System Behind Vision',
    'Fuel the Flow of Life',
    'Support Natural Detoxification Pathways',
    'Support the Foundation of Wellness',
    'Support Healthy Filtration and Flow',
    'Hydrate Recovery at the Cellular Level',
    'Support Mobility From Within',
    'Radiance Starts Within',
    'Support Energy at the Source',
  ]) {
    assert.match(organData, new RegExp(cta.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  assert.doesNotMatch(panel, />\s*Side Panel Copy\s*</);
  assert.doesNotMatch(panel, />\s*Micro CTA\s*</);
  assert.doesNotMatch(panel, /title="Side Panel Copy"/);
  assert.doesNotMatch(panel, /organ\.bodySystem/);
  assert.doesNotMatch(panel, /organ\.metrics/);
  assert.doesNotMatch(panel, /figcaption/);
  assert.doesNotMatch(panel, /CNS \/ Neural Network|Cellular Energy|Dermal \/ Aging/);
  assert.match(panel, /<a[\s\S]*\{organ\.microCta\}[\s\S]*<\/a>/);
  assert.doesNotMatch(panel, /<a[\s\S]*\{organ\.tagline\}[\s\S]*<\/a>/);
  assert.match(panel, /organ\.microCta &&/);
  assert.match(panel, /organ\.image &&/);
  assert.doesNotMatch(mouthBlock, /microCta/);
  assert.match(mouthBlock, /mouth-throat-cellular-absorption\.png/);
  assert.doesNotMatch(lungsBlock, /microCta/);
});

test('side panel uses real client-PDF organ images instead of abstract generated artwork', () => {
  const organData = file('src/components/organData.ts');
  const panel = file('src/components/OrganPanel.tsx');

  for (const image of [
    '/organ-panels/brain-nervous-system.png',
    '/organ-panels/eyes-visual-system.png',
    '/organ-panels/mouth-throat-cellular-absorption.png',
    '/organ-panels/heart-circulation.png',
    '/organ-panels/lungs-oxygen-delivery.png',
    '/organ-panels/liver-detox-support.png',
    '/organ-panels/gut-microbiome.png',
    '/organ-panels/kidneys-filtration.png',
    '/organ-panels/muscles-recovery.png',
    '/organ-panels/joints-cartilage.png',
    '/organ-panels/skin-healthy-aging.png',
    '/organ-panels/mitochondria-cellular-energy.png',
  ]) {
    assert.match(organData, new RegExp(`src:\\s*'${image.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'`));
  }

  assert.doesNotMatch(organData, /mouth-absorption\.jpg|brain-neural\.jpg|eyes-moisture\.jpg|mitochondria-atp\.jpg/);
  assert.doesNotMatch(organData, /Support Oxygen Delivery From Within/);
  assert.match(panel, /OrganImage/);
  assert.match(panel, /<img/);
  assert.match(panel, /object-cover/);
  assert.doesNotMatch(panel, /VisualGlyph/);
  assert.doesNotMatch(panel, /viewBox="0 0 420 220"/);
  assert.doesNotMatch(panel, /Live signal/i);
  assert.doesNotMatch(panel, /attributeName="d"/);
});

test('final website CTA matches the client PDF objective', () => {
  const footer = file('src/components/CTAFooter.tsx');

  assert.match(footer, /Explore the Human Body Like Never Before/);
  assert.match(footer, /Every system in the body depends on hydration, energy, circulation, and cellular balance\./);
  assert.match(footer, /Discover how advanced hydration may support performance, recovery, and healthy aging from the inside out\./);
  assert.match(footer, /Explore the Science/);
  assert.match(footer, /Discover Mdrn-Life DDW/);
  assert.doesNotMatch(footer, /Send Message/);
});

test('page sections blend into the site background without divider grids or footer rules', () => {
  const blendedSections = [
    file('src/App.tsx'),
    file('src/components/ScienceSection.tsx'),
    file('src/components/LabTesting.tsx'),
    file('src/components/Benefits.tsx'),
    file('src/components/AthletesRecovery.tsx'),
    file('src/components/HealthyAging.tsx'),
    file('src/components/OrganShowcase.tsx'),
    file('src/components/Products.tsx'),
    file('src/components/Research.tsx'),
    file('src/components/ContactPage.tsx'),
    file('src/components/CTAFooter.tsx'),
  ].join('\n');

  assert.doesNotMatch(blendedSections, /absolute inset-0 hpe-grid/);
  assert.doesNotMatch(blendedSections, /border-t border-white\/5/);
});

test('page sections do not use independent glow or particle background layers', () => {
  const blendedSectionComponents = [
    file('src/components/ScienceSection.tsx'),
    file('src/components/LabTesting.tsx'),
    file('src/components/Benefits.tsx'),
    file('src/components/AthletesRecovery.tsx'),
    file('src/components/HealthyAging.tsx'),
    file('src/components/OrganShowcase.tsx'),
    file('src/components/Products.tsx'),
    file('src/components/Research.tsx'),
    file('src/components/ContactPage.tsx'),
    file('src/components/CTAFooter.tsx'),
  ].join('\n');

  assert.doesNotMatch(blendedSectionComponents, /hpe-glow-(cyan|gold)/);
  assert.doesNotMatch(blendedSectionComponents, /<Particles\b/);
  assert.doesNotMatch(blendedSectionComponents, /<section className="hpe-glass/);
});

test('blog archive is routed, theme-native, and ready for Shopify Storefront articles', () => {
  const app = file('src/App.tsx');
  const nav = file('src/components/Nav.tsx');
  const footer = file('src/components/CTAFooter.tsx');
  const blog = file('src/components/BlogPage.tsx');
  const blogData = file('src/lib/blog.ts');

  assert.match(app, /case '\/blogs\/news':\s*return <BlogPage \/>/);
  assert.match(nav, /label:\s*'Blog',\s*href:\s*'\/blogs\/news'/);
  assert.match(footer, /\['Blog', '\/blogs\/news'\]/);
  assert.match(blog, /Cellular hydration/);
  assert.match(blog, /getBlogArticles/);
  assert.match(blogData, /shopifyStorefrontFetch/);
  assert.match(file('src/lib/shopify.ts'), /X-Shopify-Storefront-Access-Token/);
  assert.match(blogData, /blog\(handle: "news"\)/);
});

test('footer policy routes render the copied Shopify policy content', () => {
  const app = file('src/App.tsx');
  const footer = file('src/components/CTAFooter.tsx');
  const policyPage = file('src/components/PolicyPage.tsx');
  const policies = file('src/data/policies.json');

  for (const path of [
    '/policies/terms-of-service',
    '/policies/shipping-policy',
    '/policies/refund-policy',
    '/policies/privacy-policy',
    '/pages/refund',
    '/policies/subscription-policy',
  ]) {
    assert.match(footer, new RegExp(path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
  assert.match(app, /pathname\.startsWith\('\/policies\/'\)/);
  assert.match(policyPage, /dangerouslySetInnerHTML/);
  assert.match(policies, /SECTION 1 - ONLINE STORE TERMS/);
  assert.match(policies, /Domestic Shipping Rates and Estimates/);
  assert.match(policies, /Cancellation Policy/);
});

test('shop defaults to subscription while preserving one-time purchase checkout', () => {
  const productsPage = file('src/components/Products.tsx');
  const products = file('src/lib/products.ts');
  const cart = file('src/lib/cart.ts');
  const cartPage = file('src/components/CartPage.tsx');
  const shopify = file('src/lib/shopify.ts');

  assert.match(productsPage, /useState<'subscription' \| 'one-time'>\('subscription'\)/);
  assert.match(productsPage, /Subscribe & Add to Cart/);
  assert.match(productsPage, /One-time purchase/);
  assert.match(products, /VITE_SHOPIFY_GLASS_SELLING_PLAN_ID/);
  assert.match(products, /VITE_SHOPIFY_PET_SELLING_PLAN_ID/);
  assert.match(cart, /purchaseOption: 'subscription' \| 'one-time'/);
  assert.match(cartPage, /item\.sellingPlanId/);
  assert.match(shopify, /selling_plan/);
  assert.match(shopify, /item\.purchaseOption === 'subscription' && !item\.sellingPlanId/);
});
