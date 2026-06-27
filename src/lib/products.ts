import { ShopifyProductConfig, shopifyStorefrontFetch } from './shopify';

const SELLING_PLAN_STANDARD = '27086716962';
const SELLING_PLAN_INTENSIVE = '27086749730';
const SELLING_PLAN_TRAVEL = '27086782498';

export type SubscriptionPlan = {
  id: string;
  frequency: string;
  useCase: string;
  discount: string;
  price: string;
  priceCents: number;
  sellingPlanId?: string;
};

export type Product = ShopifyProductConfig & {
  id: 'glass' | 'pet';
  availableForSale?: boolean;
  badge: string;
  name: string;
  tagline: string;
  description: string;
  price: string;
  priceCents: number;
  volume: string;
  optionLabel: string;
  image: {
    src: string;
    alt: string;
  };
  spec: {
    k: string;
    v: string;
  }[];
  accent: 'blue' | 'gold';
  subscription: {
    label: string;
    frequency: string;
    discount: string;
    price: string;
    priceCents: number;
    sellingPlanId?: string;
    plans: SubscriptionPlan[];
  };
};

export const PRODUCTS: Product[] = [
  {
    id: 'glass',
    badge: '5 PPM - GLASS',
    name: 'Mdrn-Life DDW Glass',
    tagline: 'Premium glass bottles - verified 5 ppm',
    description:
      'The 5 ppm deuterium-depleted water format for buyers who prefer premium glass packaging and a refined shelf presentation.',
    price: '$166.90',
    priceCents: 16690,
    volume: '12 pack',
    optionLabel: '16 oz. Glass: 12 Pack Glass Bottle 16oz.',
    image: {
      src: '/products/mdrn-life-ddw-glass.webp',
      alt: 'Mdrn-Life deuterium-depleted water glass bottle product artwork',
    },
    productUrl: 'https://mdrnlifeddw.com/products/mdrn-life-ddw',
    variantId: import.meta.env.VITE_SHOPIFY_GLASS_VARIANT_ID || '41077216739362',
    subscription: {
      label: 'Subscribe & save',
      frequency: 'Every 1 month',
      discount: 'Save 10%',
      price: '$150.21',
      priceCents: 15021,
      sellingPlanId: import.meta.env.VITE_SHOPIFY_GLASS_SELLING_PLAN_ID || SELLING_PLAN_STANDARD,
      plans: [
        {
          id: 'glass-standard',
          frequency: 'Every 1 month',
          useCase: 'Standard daily hydration habit',
          discount: 'Save 10%',
          price: '$150.21',
          priceCents: 15021,
          sellingPlanId: import.meta.env.VITE_SHOPIFY_GLASS_SELLING_PLAN_ID || SELLING_PLAN_STANDARD,
        },
        {
          id: 'glass-intensive',
          frequency: 'Every 3 weeks',
          useCase: 'High-dilution, clinical or intensive use',
          discount: 'Save 10%',
          price: '$150.21',
          priceCents: 15021,
          sellingPlanId: import.meta.env.VITE_SHOPIFY_GLASS_SELLING_PLAN_ID_2 || SELLING_PLAN_INTENSIVE,
        },
        {
          id: 'glass-travel',
          frequency: 'Every 6 weeks',
          useCase: 'Travel, occasional or maintenance use',
          discount: 'Save 8%',
          price: '$153.55',
          priceCents: 15355,
          sellingPlanId: import.meta.env.VITE_SHOPIFY_GLASS_SELLING_PLAN_ID_3 || SELLING_PLAN_TRAVEL,
        },
      ],
    },
    spec: [
      { k: 'Deuterium', v: '5 ppm' },
      { k: 'Packaging', v: 'Glass' },
      { k: 'Verification', v: 'Independent labs' },
    ],
    accent: 'gold',
  },
  {
    id: 'pet',
    badge: '5 PPM - PET',
    name: 'Mdrn-Life DDW PET Plastic',
    tagline: 'Portable PET plastic bottles - verified 5 ppm',
    description:
      'The same single-concentration Mdrn-Life DDW in PET plastic bottles for convenience, shipping efficiency, and everyday protocol use.',
    price: '$152.75',
    priceCents: 15275,
    volume: '12 pack',
    optionLabel: '16 oz. PET: 12 Pack PET plastic Bottle 16oz.',
    image: {
      src: '/products/mdrn-life-ddw-pet.webp',
      alt: 'Mdrn-Life deuterium-depleted water PET bottle product artwork',
    },
    productUrl: 'https://mdrnlifeddw.com/products/mdrn-life-ddw-pet-plastic?variant=41122368749602',
    variantId: import.meta.env.VITE_SHOPIFY_PET_VARIANT_ID || '41122368749602',
    subscription: {
      label: 'Subscribe & save',
      frequency: 'Every 1 month',
      discount: 'Save 10%',
      price: '$137.48',
      priceCents: 13748,
      sellingPlanId: import.meta.env.VITE_SHOPIFY_PET_SELLING_PLAN_ID || SELLING_PLAN_STANDARD,
      plans: [
        {
          id: 'pet-standard',
          frequency: 'Every 1 month',
          useCase: 'Standard daily hydration habit',
          discount: 'Save 10%',
          price: '$137.48',
          priceCents: 13748,
          sellingPlanId: import.meta.env.VITE_SHOPIFY_PET_SELLING_PLAN_ID || SELLING_PLAN_STANDARD,
        },
        {
          id: 'pet-intensive',
          frequency: 'Every 3 weeks',
          useCase: 'High-dilution, clinical or intensive use',
          discount: 'Save 10%',
          price: '$137.48',
          priceCents: 13748,
          sellingPlanId: import.meta.env.VITE_SHOPIFY_PET_SELLING_PLAN_ID_2 || SELLING_PLAN_INTENSIVE,
        },
        {
          id: 'pet-travel',
          frequency: 'Every 6 weeks',
          useCase: 'Travel, occasional or maintenance use',
          discount: 'Save 8%',
          price: '$140.53',
          priceCents: 14053,
          sellingPlanId: import.meta.env.VITE_SHOPIFY_PET_SELLING_PLAN_ID_3 || SELLING_PLAN_TRAVEL,
        },
      ],
    },
    spec: [
      { k: 'Deuterium', v: '5 ppm' },
      { k: 'Packaging', v: 'PET Plastic' },
      { k: 'Origin', v: 'Fort Lauderdale, FL' },
    ],
    accent: 'blue',
  },
];

export function getProduct(productId: Product['id']) {
  return PRODUCTS.find((product) => product.id === productId);
}

type ShopifyProductNode = {
  title?: string;
  onlineStoreUrl?: string;
  availableForSale?: boolean;
  featuredImage?: { url: string; altText?: string };
  variants?: {
    nodes?: {
      id: string;
      title?: string;
      availableForSale?: boolean;
      image?: { url: string; altText?: string };
      price?: { amount: string; currencyCode: string };
      sellingPlanAllocations?: {
        nodes?: {
          sellingPlan: { id: string; name?: string };
          priceAdjustments?: { price?: { amount: string; currencyCode: string } }[];
        }[];
      };
    }[];
  };
};

type ShopifyProductsPayload = {
  data?: {
    glass?: ShopifyProductNode | null;
    pet?: ShopifyProductNode | null;
  };
};

function gidToNumericId(value?: string) {
  return value?.match(/\/(\d+)$/)?.[1] || value;
}

function formatShopifyPrice(price?: { amount: string; currencyCode: string }) {
  if (!price?.amount) return null;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: price.currencyCode || 'USD',
  }).format(Number(price.amount));
}

function mergeSubscriptionPlans(product: Product, variant?: NonNullable<ShopifyProductNode['variants']>['nodes'][number]) {
  const allocations = variant?.sellingPlanAllocations?.nodes || [];
  if (!allocations.length) return product.subscription;

  const plans = product.subscription.plans.map((plan) => {
    const allocation = allocations.find((node) => gidToNumericId(node.sellingPlan?.id) === plan.sellingPlanId);
    const livePrice = allocation?.priceAdjustments?.[0]?.price;
    const price = formatShopifyPrice(livePrice);
    const priceCents = livePrice?.amount ? Math.round(Number(livePrice.amount) * 100) : plan.priceCents;

    return {
      ...plan,
      useCase: allocation?.sellingPlan?.name || plan.useCase,
      price: price || plan.price,
      priceCents,
    };
  });

  const primaryPlan = plans[0] || product.subscription.plans[0];
  return {
    ...product.subscription,
    price: primaryPlan?.price || product.subscription.price,
    priceCents: primaryPlan?.priceCents || product.subscription.priceCents,
    plans,
  };
}

function mergeShopifyProduct(product: Product, shopifyProduct?: ShopifyProductNode | null): Product {
  if (!shopifyProduct) return product;

  const variants = shopifyProduct.variants?.nodes || [];
  const variant = variants.find((node) => gidToNumericId(node.id) === product.variantId) || variants[0];
  const image = variant?.image || shopifyProduct.featuredImage;
  const imageAlt = image?.altText && !/6\s*pack/i.test(image.altText) ? image.altText : product.image.alt;
  const price = formatShopifyPrice(variant?.price);
  const priceCents = variant?.price?.amount ? Math.round(Number(variant.price.amount) * 100) : product.priceCents;

  return {
    ...product,
    availableForSale: variant?.availableForSale ?? shopifyProduct.availableForSale ?? product.availableForSale,
    name: shopifyProduct.title || product.name,
    productUrl: shopifyProduct.onlineStoreUrl || product.productUrl,
    variantId: gidToNumericId(variant?.id) || product.variantId,
    price: price || product.price,
    priceCents,
    subscription: mergeSubscriptionPlans(product, variant),
    image: {
      src: image?.url || product.image.src,
      alt: imageAlt,
    },
  };
}

export async function getLiveProducts(signal?: AbortSignal): Promise<Product[]> {
  const payload = await shopifyStorefrontFetch<ShopifyProductsPayload>({
    query: `query ProductCards {
      glass: product(handle: "mdrn-life-ddw") {
        ...ProductCardFields
      }
      pet: product(handle: "mdrn-life-ddw-pet-plastic") {
        ...ProductCardFields
      }
    }

    fragment ProductCardFields on Product {
      title
      onlineStoreUrl
      availableForSale
      featuredImage { url altText }
      variants(first: 20) {
        nodes {
          id
          title
          availableForSale
          image { url altText }
          price { amount currencyCode }
          sellingPlanAllocations(first: 20) {
            nodes {
              sellingPlan { id name }
              priceAdjustments { price { amount currencyCode } }
            }
          }
        }
      }
    }`,
  }, signal);

  return PRODUCTS.map((product) => mergeShopifyProduct(product, payload.data?.[product.id]));
}
