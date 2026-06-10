type CommerceEventName =
  | 'product_viewed'
  | 'added_to_cart'
  | 'started_checkout'
  | 'subscription_started_intent';

type CommercePayload = {
  productId: string;
  productName: string;
  value?: string;
  variantId?: string;
  checkoutReady?: boolean;
};

declare global {
  interface Window {
    fbq?: (method: string, eventName: string, payload?: Record<string, unknown>) => void;
    gtag?: (...args: unknown[]) => void;
    ttq?: {
      track?: (eventName: string, payload?: Record<string, unknown>) => void;
    };
    klaviyo?: {
      push?: (event: [string, string, Record<string, unknown>]) => void;
    };
  }
}

const EVENT_LABELS: Record<CommerceEventName, string> = {
  product_viewed: 'Viewed product',
  added_to_cart: 'Added to cart',
  started_checkout: 'Started checkout',
  subscription_started_intent: 'Subscription started',
};

const GA4_EVENTS: Record<CommerceEventName, string> = {
  product_viewed: 'view_item',
  added_to_cart: 'add_to_cart',
  started_checkout: 'begin_checkout',
  subscription_started_intent: 'generate_lead',
};

const META_EVENTS: Record<CommerceEventName, string> = {
  product_viewed: 'ViewContent',
  added_to_cart: 'AddToCart',
  started_checkout: 'InitiateCheckout',
  subscription_started_intent: 'Subscribe',
};

const TIKTOK_EVENTS: Record<CommerceEventName, string> = {
  product_viewed: 'ViewContent',
  added_to_cart: 'AddToCart',
  started_checkout: 'InitiateCheckout',
  subscription_started_intent: 'Subscribe',
};

export function trackCommerceEvent(name: CommerceEventName, payload: CommercePayload) {
  const eventPayload = {
    event: EVENT_LABELS[name],
    content_id: payload.productId,
    content_name: payload.productName,
    value: payload.value,
    variant_id: payload.variantId,
    checkout_ready: payload.checkoutReady,
  };

  try {
    window.dispatchEvent(new CustomEvent('mdrn-life:commerce', { detail: { name, payload: eventPayload } }));
    window.gtag?.('event', GA4_EVENTS[name], eventPayload);
    window.fbq?.('track', META_EVENTS[name], eventPayload); // Meta Pixel
    window.ttq?.track?.(TIKTOK_EVENTS[name], eventPayload); // TikTok Pixel
    window.klaviyo?.push?.(['track', EVENT_LABELS[name], eventPayload]); // Klaviyo
  } catch {
    // Tracking must never block Shopify checkout or crash the brand experience.
  }
}

export const REQUIRED_TRACKING_STACK = [
  'Meta Pixel',
  'Google Analytics 4',
  'Google Ads',
  'TikTok Pixel',
  'Klaviyo',
  'Shopify customer events',
  'UTM tracking',
];
