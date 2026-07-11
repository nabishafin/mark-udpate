import { createRoot } from 'react-dom/client';
import { App } from './App';
import './index.css';

const SHOPIFY_CHECKOUT_HOST = 'orise-6796.myshopify.com';
const SHOPIFY_CHECKOUT_PATHS = [
  /^\/cart\/c\//,
  /^\/cart\/\d/,
  /^\/checkouts\//,
  /^\/checkout\/.+/,
  /^\/wallets\/checkouts\//,
  /^\/orders\//,
  /^\/\d+\/orders\//,
];

function redirectShopifyCheckoutPath() {
  const isShopifyCheckoutPath = SHOPIFY_CHECKOUT_PATHS.some((pattern) => pattern.test(window.location.pathname));

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
