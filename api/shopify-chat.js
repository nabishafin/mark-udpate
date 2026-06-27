const DEFAULT_SHOP_DOMAIN = 'orise-6796.myshopify.com';
const DEFAULT_API_VERSION = '2026-04';
const MAX_MESSAGE_LENGTH = 4000;

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

  const version = process.env.SHOPIFY_ADMIN_API_VERSION || DEFAULT_API_VERSION;
  return {
    endpoint: `https://${normalizeShopDomain()}/admin/api/${version}/graphql.json`,
    token,
  };
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk;
      if (body.length > 64 * 1024) {
        reject(new Error('Message payload is too large.'));
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

function splitName(name) {
  const parts = clean(name, 160).split(' ').filter(Boolean);
  return {
    firstName: parts.shift() || undefined,
    lastName: parts.join(' ') || undefined,
  };
}

function metafieldKey(sessionId) {
  const suffix = `${clean(sessionId, 32)}_${Date.now().toString(36)}`.toLowerCase();
  return `chat_${suffix}`.replace(/[^a-z0-9_]/g, '_').slice(0, 64);
}

async function shopifyGraphql(query, variables) {
  const { endpoint, token } = getAdminConfig();
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.errors?.length) {
    const message = payload.errors?.map((error) => error.message).join(' ') || `Shopify Admin request failed: ${response.status}`;
    throw new Error(message);
  }

  return payload.data;
}

async function getShopId() {
  const data = await shopifyGraphql(`query ShopId { shop { id } }`, {});
  return data.shop.id;
}

async function findCustomer(email) {
  if (!email) return null;
  const data = await shopifyGraphql(
    `query FindCustomer($query: String!) {
      customers(first: 1, query: $query) {
        nodes {
          id
          note
        }
      }
    }`,
    { query: `email:${email}` },
  );
  return data.customers.nodes[0] || null;
}

async function createCustomer(input) {
  const data = await shopifyGraphql(
    `mutation CreateChatCustomer($input: CustomerInput!) {
      customerCreate(input: $input) {
        customer { id note }
        userErrors { message }
      }
    }`,
    { input },
  );
  const errors = data.customerCreate.userErrors || [];
  if (errors.length) throw new Error(errors.map((error) => error.message).join(' '));
  return data.customerCreate.customer;
}

async function updateCustomer(input) {
  const data = await shopifyGraphql(
    `mutation UpdateChatCustomer($input: CustomerInput!) {
      customerUpdate(input: $input) {
        customer { id }
        userErrors { message }
      }
    }`,
    { input },
  );
  const errors = data.customerUpdate.userErrors || [];
  if (errors.length) throw new Error(errors.map((error) => error.message).join(' '));
  return data.customerUpdate.customer;
}

async function storeShopMessage(ownerId, value, sessionId) {
  const data = await shopifyGraphql(
    `mutation StoreChatMessage($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields { id key }
        userErrors { message }
      }
    }`,
    {
      metafields: [
        {
          ownerId,
          namespace: 'website_chat',
          key: metafieldKey(sessionId),
          type: 'json',
          value: JSON.stringify(value),
        },
      ],
    },
  );
  const errors = data.metafieldsSet.userErrors || [];
  if (errors.length) throw new Error(errors.map((error) => error.message).join(' '));
  return data.metafieldsSet.metafields[0];
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    json(response, 405, { error: 'Method not allowed.' });
    return;
  }

  try {
    const body = await readBody(request);
    const name = clean(body.name, 160);
    const email = clean(body.email, 254).toLowerCase();
    const message = clean(body.message, MAX_MESSAGE_LENGTH);
    const sessionId = clean(body.sessionId, 80) || `web_${Date.now().toString(36)}`;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      json(response, 400, { error: 'Please enter a valid email address.' });
      return;
    }

    if (!message) {
      json(response, 400, { error: 'Please enter a message.' });
      return;
    }

    const now = new Date().toISOString();
    const chatRecord = {
      source: 'mdrn-life-storefront-chat',
      sessionId,
      name,
      email,
      message,
      page: clean(body.page, 1000),
      createdAt: now,
    };
    const transcriptLine = `[${now}] Website chat (${sessionId})${name ? ` from ${name}` : ''}: ${message}`;
    const customer = await findCustomer(email);
    const customerInput = {
      email,
      tags: ['website-chat', 'mdrn-life-ddw'],
      note: `${customer?.note ? `${customer.note}\n\n` : ''}${transcriptLine}`.slice(-5000),
      ...splitName(name),
    };

    const savedCustomer = customer
      ? await updateCustomer({ id: customer.id, ...customerInput })
      : await createCustomer(customerInput);
    let shopMetafield = null;
    let storageWarning = null;

    try {
      shopMetafield = await storeShopMessage(await getShopId(), chatRecord, sessionId);
    } catch (error) {
      storageWarning = error instanceof Error ? error.message : 'Shop metafield transcript could not be saved.';
    }

    json(response, 200, {
      ok: true,
      customerId: savedCustomer?.id || customer?.id || null,
      messageId: shopMetafield?.id || null,
      warning: storageWarning,
    });
  } catch (error) {
    json(response, 500, {
      error: error instanceof Error ? error.message : 'Message could not be sent.',
    });
  }
}
