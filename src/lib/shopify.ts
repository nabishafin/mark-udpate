export type ShopifyProductConfig = {
  id: string;
  name: string;
  productUrl: string;
  variantId?: string;
  quantity?: number;
};

export type ShopifyCheckoutItem = {
  variantId?: string;
  quantity: number;
  sellingPlanId?: string;
  purchaseOption?: 'subscription' | 'one-time';
};

type ShopifyGraphQlError = {
  message?: string;
};

type CartCreateCheckoutPayload = {
  errors?: ShopifyGraphQlError[];
  data?: {
    cartCreate?: {
      cart?: { checkoutUrl?: string | null } | null;
      userErrors?: ShopifyGraphQlError[];
    };
  };
};

const DEFAULT_STORE_DOMAIN = 'mdrnlifeddw.com';
const DEFAULT_CHECKOUT_DOMAIN = 'orise-6796.myshopify.com';
const DEFAULT_STOREFRONT_API_URL = 'https://orise-6796.myshopify.com/api/2026-04/graphql.json';
const DEFAULT_STOREFRONT_TOKEN = 'ea7c67f92e797d20ab1abd406684703f';
const PRODUCT_VARIANT_GID_PREFIX = 'gid://shopify/ProductVariant/';
const SELLING_PLAN_GID_PREFIX = 'gid://shopify/SellingPlan/';
const PUBLIC_SITE_DOMAINS = new Set(['mdrnlifeddw.com', 'www.mdrnlifeddw.com']);

export function getStoreDomain() {
  const domain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || DEFAULT_STORE_DOMAIN;
  return domain.replace(/^https?:\/\//, '').replace(/\/+$/, '');
}

function getCheckoutDomain() {
  const domain = import.meta.env.VITE_SHOPIFY_CHECKOUT_DOMAIN || DEFAULT_CHECKOUT_DOMAIN;
  const normalized = domain.replace(/^https?:\/\//, '').replace(/\/+$/, '').toLowerCase();
  return PUBLIC_SITE_DOMAINS.has(normalized) ? DEFAULT_CHECKOUT_DOMAIN : normalized;
}

function appendTracking(url: URL, source: string) {
  url.searchParams.set('_fd', '0');
  url.searchParams.set('_sc', '1');
  url.searchParams.set('utm_source', 'mdrn_life_external_site');
  url.searchParams.set('utm_medium', source);
  url.searchParams.set('utm_campaign', 'ddw_product_checkout');
  return url.toString();
}

export function forceShopifyCheckoutDomain(value: string, source = 'storefront_cart_checkout') {
  const url = new URL(value);
  url.protocol = 'https:';
  url.host = getCheckoutDomain();
  return appendTracking(url, source);
}

function normalizeQuantity(quantity: number) {
  return Math.max(1, Math.floor(quantity || 1));
}

function getStorefrontApiUrl() {
  return import.meta.env.VITE_SHOPIFY_STOREFRONT_API_URL || DEFAULT_STOREFRONT_API_URL;
}

function getStorefrontToken() {
  return import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN || DEFAULT_STOREFRONT_TOKEN;
}

export async function shopifyStorefrontFetch<T = unknown>(body: object, signal?: AbortSignal): Promise<T> {
  const endpoint = getStorefrontApiUrl();
  const token = getStorefrontToken();
  if (!endpoint || !token) {
    throw new Error('Storefront API is not configured.');
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    signal,
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) throw new Error(`Store request failed: ${response.status}`);

  const payload = await response.json();
  if (payload?.errors?.length) {
    throw new Error(payload.errors.map((error: { message?: string }) => error.message).filter(Boolean).join(' ') || 'Store request failed.');
  }

  return payload as T;
}

function toProductVariantGid(variantId: string) {
  return variantId.startsWith('gid://') ? variantId : `${PRODUCT_VARIANT_GID_PREFIX}${variantId}`;
}

function toSellingPlanGid(sellingPlanId: string) {
  return sellingPlanId.startsWith('gid://') ? sellingPlanId : `${SELLING_PLAN_GID_PREFIX}${sellingPlanId}`;
}

export function buildShopifyCheckoutUrl(items: ShopifyCheckoutItem[], source = 'cart_checkout') {
  const cartLines = items
    .filter((item) => item.variantId)
    .map((item) => `${item.variantId}:${normalizeQuantity(item.quantity)}`);

  const url = new URL(`https://${getCheckoutDomain()}/cart/${cartLines.join(',')}`);
  const sellingPlanItems = items.filter((item) => item.purchaseOption === 'subscription');
  const sellingPlans = [...new Set(sellingPlanItems.map((item) => item.sellingPlanId).filter(Boolean))];
  if (sellingPlans.length === 1 && items.every((item) => item.purchaseOption === 'subscription' && item.sellingPlanId === sellingPlans[0])) {
    url.searchParams.set('selling_plan', sellingPlans[0] as string);
  } else if (sellingPlanItems.length > 0) {
    throw new Error('Subscription checkout requires a secure cart URL.');
  }
  return appendTracking(url, source);
}

export function canUseStorefrontCart() {
  return Boolean(getStorefrontApiUrl() && getStorefrontToken());
}

export async function createShopifyCartCheckoutUrl(items: ShopifyCheckoutItem[]) {
  const lines = items
    .filter((item) => item.variantId)
    .map((item) => ({
      merchandiseId: toProductVariantGid(item.variantId as string),
      quantity: normalizeQuantity(item.quantity),
      ...(item.purchaseOption === 'subscription' && item.sellingPlanId
        ? { sellingPlanId: toSellingPlanGid(item.sellingPlanId) }
        : {}),
    }));

  if (!lines.length) throw new Error('Cart has no checkout-ready items.');

  const payload = await shopifyStorefrontFetch<CartCreateCheckoutPayload>({
    query: `mutation CartCreate($input: CartInput!) {
        cartCreate(input: $input) {
          cart {
            checkoutUrl
          }
          userErrors {
            field
            message
          }
        }
      }`,
    variables: { input: { lines } },
  });
  const errors = payload?.errors || payload?.data?.cartCreate?.userErrors || [];
  if (errors.length) {
    throw new Error(errors.map((error: { message?: string }) => error.message).filter(Boolean).join(' ') || 'Cart could not be created.');
  }

  const checkoutUrl = payload?.data?.cartCreate?.cart?.checkoutUrl;
  if (!checkoutUrl) throw new Error('Could not start checkout.');

  return forceShopifyCheckoutDomain(checkoutUrl as string);
}

export function hasCheckoutVariants(items: ShopifyCheckoutItem[]) {
  if (!items.length || !items.every((item) => Boolean(item.variantId))) return false;
  if (items.some((item) => item.purchaseOption === 'subscription' && !item.sellingPlanId)) return false;
  if (canUseStorefrontCart()) return true;
  const plans = [...new Set(items.map((item) => item.sellingPlanId || 'one-time'))];
  return plans.length === 1;
}
