import { useEffect } from 'react';

/**
 * Embeds the official Shopify Inbox chat widget.
 *
 * This is real, two-way Shopify Inbox chat: the shopper's messages land in the
 * merchant's Shopify Inbox (app/web), and the merchant's replies appear back to
 * the shopper in this widget. Shopify exposes NO public API to send/receive Inbox
 * messages from custom code, so the official loader script is the only way to get
 * genuine bidirectional Inbox chat — including on a custom/headless storefront.
 *
 * The widget renders Shopify's own UI (the "Chat with us / Instant answers /
 * Track my order" panel). Its appearance — colour, icon, position, greeting,
 * instant answers — is configured in the Shopify admin under Shopify Inbox, not
 * here.
 *
 * Requirements for it to appear:
 *  1. Shopify Inbox is installed and the "Online Store" chat channel is enabled
 *     in the Shopify admin.
 *  2. The site is served from a real deployed domain. Shopify's bot protection
 *     blocks the widget on localhost, so it will NOT show during `vite dev`.
 *  3. If the bubble still doesn't appear, open your Shopify theme preview, copy
 *     the exact `inbox-chat-loader.js` <script src> Shopify injects, and set it as
 *     VITE_SHOPIFY_INBOX_LOADER_SRC (the asset path can be store/version-specific).
 */

const DEFAULT_LOADER_SRC =
  'https://cdn.shopify.com/extensions/bdb6998f-cc8d-49e0-81e2-e024850275f1/inbox-640/assets/inbox-chat-loader.js';

function loaderSrc() {
  return import.meta.env.VITE_SHOPIFY_INBOX_LOADER_SRC || DEFAULT_LOADER_SRC;
}

function shopDomain() {
  const raw = import.meta.env.VITE_SHOPIFY_CHECKOUT_DOMAIN || 'orise-6796.myshopify.com';
  return raw.replace(/^https?:\/\//, '').replace(/\/+$/, '');
}

export function ShopifyInbox() {
  useEffect(() => {
    if (document.getElementById('shopify-chat')) return;

    const config = document.createElement('div');
    config.id = 'shopify-chat';
    config.setAttribute('data-domain', shopDomain());
    config.setAttribute('data-horizontal-position', 'bottom_right');
    config.setAttribute('data-vertical-position', 'lowest');
    config.setAttribute('data-icon', 'chat_bubble');
    config.setAttribute('data-text', 'chat_with_us');
    document.body.appendChild(config);

    const script = document.createElement('script');
    script.id = 'shopify-chat-loader';
    script.async = true;
    script.src = loaderSrc();
    document.body.appendChild(script);
  }, []);

  return null;
}
