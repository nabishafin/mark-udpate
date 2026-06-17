import { ShopifyProductConfig } from './shopify';

export type Product = ShopifyProductConfig & {
  id: 'glass' | 'pet';
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
