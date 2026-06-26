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

const DEFAULT_STORE_DOMAIN = 'mdrnlifeddw.com';
const BUY_BUTTON_CHANNEL = 'channel=buy_button';
const PRODUCT_VARIANT_GID_PREFIX = 'gid://shopify/ProductVariant/';
const SELLING_PLAN_GID_PREFIX = 'gid://shopify/SellingPlan/';

function getStoreDomain() {
  const domain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || DEFAULT_STORE_DOMAIN;
  return domain.replace(/^https?:\/\//, '').replace(/\/+$/, '');
}

function appendTracking(url: URL, source: string) {
  const [, channelValue] = BUY_BUTTON_CHANNEL.split('=');
  url.searchParams.set('channel', channelValue);
  url.searchParams.set('utm_source', 'mdrn_life_external_site');
  url.searchParams.set('utm_medium', source);
  url.searchParams.set('utm_campaign', 'ddw_product_checkout');
  return url.toString();
}

function normalizeQuantity(quantity: number) {
  return Math.max(1, Math.floor(quantity || 1));
}

function getStorefrontApiUrl() {
  return import.meta.env.VITE_SHOPIFY_STOREFRONT_API_URL;
}

function getStorefrontToken() {
  return import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;
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

  const url = new URL(`https://${getStoreDomain()}/cart/${cartLines.join(',')}`);
  const sellingPlans = [...new Set(items.map((item) => item.sellingPlanId).filter(Boolean))];
  if (sellingPlans.length === 1 && items.every((item) => item.sellingPlanId === sellingPlans[0])) {
    url.searchParams.set('selling_plan', sellingPlans[0] as string);
  }
  return appendTracking(url, source);
}

export function canUseStorefrontCart() {
  return Boolean(getStorefrontApiUrl() && getStorefrontToken());
}

export async function createShopifyCartCheckoutUrl(items: ShopifyCheckoutItem[]) {
  const endpoint = getStorefrontApiUrl();
  const token = getStorefrontToken();
  if (!endpoint || !token) {
    throw new Error('Storefront API is not configured.');
  }

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

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify({
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
    }),
  });

  if (!response.ok) throw new Error(`Shopify cart request failed: ${response.status}`);

  const payload = await response.json();
  const errors = payload?.errors || payload?.data?.cartCreate?.userErrors || [];
  if (errors.length) {
    throw new Error(errors.map((error: { message?: string }) => error.message).filter(Boolean).join(' ') || 'Shopify cart could not be created.');
  }

  const checkoutUrl = payload?.data?.cartCreate?.cart?.checkoutUrl;
  if (!checkoutUrl) throw new Error('Shopify did not return a checkout URL.');

  return checkoutUrl as string;
}

export function hasCheckoutVariants(items: ShopifyCheckoutItem[]) {
  if (!items.length || !items.every((item) => Boolean(item.variantId))) return false;
  if (items.some((item) => item.purchaseOption === 'subscription' && !item.sellingPlanId)) return false;
  if (canUseStorefrontCart()) return true;
  const plans = [...new Set(items.map((item) => item.sellingPlanId || 'one-time'))];
  return plans.length === 1;
}
