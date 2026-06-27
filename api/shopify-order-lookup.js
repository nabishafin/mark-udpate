const DEFAULT_SHOP_DOMAIN = 'orise-6796.myshopify.com';
const DEFAULT_API_VERSION = '2026-04';

function json(response, status, payload) {
  response.statusCode = status;
  response.setHeader('Content-Type', 'application/json');
  response.end(JSON.stringify(payload));
}

function normalizeShopDomain() {
  const raw = process.env.SHOPIFY_ADMIN_SHOP_DOMAIN || process.env.VITE_SHOPIFY_CHECKOUT_DOMAIN || DEFAULT_SHOP_DOMAIN;
  return raw.replace(/^https?:\/\//, '').replace(/\/+$/, '');
}

function getAdminConfig() {
  const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  if (!token) {
    throw new Error('SHOPIFY_ADMIN_ACCESS_TOKEN is not configured.');
  }

  return {
    shopDomain: normalizeShopDomain(),
    token,
    version: process.env.SHOPIFY_ADMIN_API_VERSION || DEFAULT_API_VERSION,
  };
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk;
      if (body.length > 32 * 1024) {
        reject(new Error('Order lookup payload is too large.'));
        request.destroy();
      }
    });
    request.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error('Invalid JSON payload.'));
      }
    });
    request.on('error', reject);
  });
}

function clean(value, max = 500) {
  return String(value || '').replace(/\s+/g, ' ').trim().slice(0, max);
}

function normalizeOrderName(value) {
  const cleaned = clean(value, 80);
  if (!cleaned) return '';
  return cleaned.startsWith('#') ? cleaned : `#${cleaned}`;
}

function formatMoney(amount, currency) {
  if (!amount || !currency) return '';
  const numeric = Number(amount);
  if (!Number.isFinite(numeric)) return `${amount} ${currency}`;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(numeric);
}

async function findOrder(orderNumber, email) {
  const { shopDomain, token, version } = getAdminConfig();
  const url = new URL(`https://${shopDomain}/admin/api/${version}/orders.json`);
  url.searchParams.set('status', 'any');
  url.searchParams.set('limit', '5');
  url.searchParams.set('name', normalizeOrderName(orderNumber));
  url.searchParams.set('email', email);
  url.searchParams.set(
    'fields',
    'id,name,email,processed_at,financial_status,fulfillment_status,total_price,currency,order_status_url',
  );

  const response = await fetch(url, {
    headers: {
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json',
    },
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload?.errors || `Shopify order lookup failed: ${response.status}`);
  }

  return (payload.orders || [])[0] || null;
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    json(response, 405, { error: 'Method not allowed.' });
    return;
  }

  try {
    const body = await readBody(request);
    const orderNumber = clean(body.orderNumber, 80);
    const email = clean(body.email, 254).toLowerCase();

    if (!orderNumber) {
      json(response, 400, { error: 'Please enter an order number.' });
      return;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      json(response, 400, { error: 'Please enter a valid email address.' });
      return;
    }

    const order = await findOrder(orderNumber, email);
    if (!order) {
      json(response, 200, {
        found: false,
        message: 'We could not find an order with that number and email address.',
      });
      return;
    }

    json(response, 200, {
      found: true,
      order: {
        name: order.name,
        processedAt: order.processed_at,
        financialStatus: order.financial_status,
        fulfillmentStatus: order.fulfillment_status || 'unfulfilled',
        total: formatMoney(order.total_price, order.currency),
        statusUrl: order.order_status_url || '',
      },
    });
  } catch (error) {
    json(response, 500, {
      error: error instanceof Error ? error.message : 'Order could not be checked.',
    });
  }
}
