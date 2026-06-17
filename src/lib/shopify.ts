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
};

const DEFAULT_STORE_DOMAIN = 'mdrnlifeddw.com';
const BUY_BUTTON_CHANNEL = 'channel=buy_button';

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

export function buildShopifyCheckoutUrl(items: ShopifyCheckoutItem[], source = 'cart_checkout') {
  const cartLines = items
    .filter((item) => item.variantId)
    .map((item) => `${item.variantId}:${normalizeQuantity(item.quantity)}`);

  const url = new URL(`https://${getStoreDomain()}/cart/${cartLines.join(',')}`);
  return appendTracking(url, source);
}

export function hasCheckoutVariants(items: ShopifyCheckoutItem[]) {
  return items.length > 0 && items.every((item) => Boolean(item.variantId));
}
