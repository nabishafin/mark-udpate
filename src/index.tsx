import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './index.css';

const SHOPIFY_CHECKOUT_HOST = 'orise-6796.myshopify.com';

function redirectShopifyCheckoutPath() {
  const isShopifyCheckoutPath = /^\/cart\/c\//.test(window.location.pathname)
    || /^\/cart\/\d/.test(window.location.pathname);

  if (!isShopifyCheckoutPath || window.location.hostname === SHOPIFY_CHECKOUT_HOST) return false;

  const target = new URL(`${window.location.pathname}${window.location.search}${window.location.hash}`, `https://${SHOPIFY_CHECKOUT_HOST}`);
  window.location.replace(target.toString());
  return true;
}

if (!redirectShopifyCheckoutPath()) {
  document.documentElement.classList.add('dark');
  const container = document.getElementById('root');
  if (!container) {
    throw new Error('Root element #root was not found.');
  }
  const root = createRoot(container);
  root.render(<App />);
}
