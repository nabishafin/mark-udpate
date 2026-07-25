import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const env = { ...process.env };

for (const filename of ['.env', '.env.local', '.env.example']) {
  const file = resolve(root, filename);
  if (!existsSync(file)) continue;
  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue;
    const index = trimmed.indexOf('=');
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^['"]|['"]$/g, '');
    if (env[key] === undefined) env[key] = value;
  }
}

const required = [
  'VITE_SHOPIFY_STOREFRONT_API_URL',
  'VITE_SHOPIFY_STOREFRONT_TOKEN',
  'VITE_SHOPIFY_GLASS_VARIANT_ID',
  'VITE_SHOPIFY_PET_VARIANT_ID',
  'VITE_SHOPIFY_GLASS_SELLING_PLAN_ID',
  'VITE_SHOPIFY_GLASS_SELLING_PLAN_ID_2',
  'VITE_SHOPIFY_GLASS_SELLING_PLAN_ID_3',
  'VITE_SHOPIFY_PET_SELLING_PLAN_ID',
  'VITE_SHOPIFY_PET_SELLING_PLAN_ID_2',
  'VITE_SHOPIFY_PET_SELLING_PLAN_ID_3',
];
const missing = required.filter((key) => !env[key]);
if (missing.length) throw new Error(`Missing Shopify configuration: ${missing.join(', ')}`);

const query = `query ValidateStorefrontConfiguration {
  glass: product(handle: "mdrn-life-ddw") {
    variants(first: 20) {
      nodes {
        id availableForSale price { amount currencyCode }
        sellingPlanAllocations(first: 20) { nodes { sellingPlan { id } } }
      }
    }
  }
  pet: product(handle: "mdrn-life-ddw-pet-plastic") {
    variants(first: 20) {
      nodes {
        id availableForSale price { amount currencyCode }
        sellingPlanAllocations(first: 20) { nodes { sellingPlan { id } } }
      }
    }
  }
}`;

const response = await fetch(env.VITE_SHOPIFY_STOREFRONT_API_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': env.VITE_SHOPIFY_STOREFRONT_TOKEN,
  },
  body: JSON.stringify({ query }),
  signal: AbortSignal.timeout(10_000),
});
const payload = await response.json().catch(() => ({}));
if (!response.ok || payload.errors?.length) {
  throw new Error(`Shopify Storefront validation failed with HTTP ${response.status}`);
}

const configurations = {
  glass: {
    variant: env.VITE_SHOPIFY_GLASS_VARIANT_ID,
    plans: [
      env.VITE_SHOPIFY_GLASS_SELLING_PLAN_ID,
      env.VITE_SHOPIFY_GLASS_SELLING_PLAN_ID_2,
      env.VITE_SHOPIFY_GLASS_SELLING_PLAN_ID_3,
    ],
  },
  pet: {
    variant: env.VITE_SHOPIFY_PET_VARIANT_ID,
    plans: [
      env.VITE_SHOPIFY_PET_SELLING_PLAN_ID,
      env.VITE_SHOPIFY_PET_SELLING_PLAN_ID_2,
      env.VITE_SHOPIFY_PET_SELLING_PLAN_ID_3,
    ],
  },
};

for (const [name, configuration] of Object.entries(configurations)) {
  const variants = payload.data?.[name]?.variants?.nodes || [];
  const variant = variants.find((item) => item.id.endsWith(`/${configuration.variant}`));
  if (!variant) throw new Error(`${name}: configured variant does not exist`);
  if (!variant.price?.amount || !variant.price?.currencyCode) {
    throw new Error(`${name}: configured variant has no usable price`);
  }
  const livePlans = new Set(
    (variant.sellingPlanAllocations?.nodes || [])
      .map((item) => item.sellingPlan?.id?.split('/').pop())
      .filter(Boolean),
  );
  const missingPlans = configuration.plans.filter((id) => !livePlans.has(id));
  if (missingPlans.length) throw new Error(`${name}: ${missingPlans.length} configured selling plans do not exist`);

  console.log(
    `${name}: variant and ${configuration.plans.length} selling plans verified; availability=${variant.availableForSale}`,
  );
}
