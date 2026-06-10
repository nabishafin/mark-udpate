export type ShopifyProductConfig = {
  id: string;
  name: string;
  productUrl: string;
  variantId?: string;
  quantity?: number;
  subscriptionCheckoutUrl?: string;
};

export type ShopifyLinks = {
  productUrl: string;
  buyNowUrl: string;
  addToCartUrl: string;
  subscriptionCheckoutUrl: string;
  isCheckoutReady: boolean;
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

export function buildShopifyCartPermalink(variantId: string, quantity = 1, source = 'buy_button') {
  const url = new URL(`https://${getStoreDomain()}/cart/${variantId}:${quantity}`);
  return appendTracking(url, source);
}

export function getShopifyLinks(product: ShopifyProductConfig): ShopifyLinks {
  const quantity = product.quantity ?? 1;
  const checkoutUrl = product.variantId
    ? buildShopifyCartPermalink(product.variantId, quantity, 'product_cta')
    : product.productUrl;

  return {
    productUrl: product.productUrl,
    buyNowUrl: checkoutUrl,
    addToCartUrl: checkoutUrl,
    subscriptionCheckoutUrl: product.subscriptionCheckoutUrl || product.productUrl,
    isCheckoutReady: Boolean(product.variantId),
  };
}
