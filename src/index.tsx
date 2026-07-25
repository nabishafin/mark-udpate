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
  // Build-time SEO markup is useful to crawlers and no-JS clients. React owns
  // the root after startup, so remove the static shell before mounting.
  container.replaceChildren();
  const root = createRoot(container);
  root.render(<App />);

  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener(
      'load',
      () => {
        void navigator.serviceWorker.register('/sw.js', { scope: '/', updateViaCache: 'none' }).catch(() => {
          // The site remains fully functional when private browsing blocks service workers.
        });
      },
      { once: true },
    );
  }
}
