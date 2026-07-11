import { shopifyStorefrontFetch } from './shopify';

const CUSTOMER_SESSION_KEY = 'mdrn_life_shopify_customer_session';
const AUTH_EVENT = 'mdrn-life-auth-change';

export type ShopifyCustomer = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  phone?: string | null;
  acceptsMarketing?: boolean;
  createdAt?: string;
  updatedAt?: string;
  numberOfOrders?: string;
  defaultAddress?: ShopifyMailingAddress | null;
};

export type ShopifyMoney = { amount: string; currencyCode: string };

export type ShopifyMailingAddress = {
  id?: string;
  firstName?: string | null;
  lastName?: string | null;
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  province?: string | null;
  zip?: string | null;
  country?: string | null;
  phone?: string | null;
};

export type ShopifyOrderLineItem = {
  title: string;
  quantity: number;
  currentQuantity: number;
  originalTotalPrice: ShopifyMoney;
  discountedTotalPrice: ShopifyMoney;
  variant?: {
    id: string;
    title?: string;
    image?: { url: string; altText?: string | null } | null;
    product?: { title: string; handle: string } | null;
  } | null;
};

export type ShopifyFulfillment = {
  trackingCompany?: string | null;
  trackingInfo: { number?: string | null; url?: string | null }[];
  fulfillmentLineItems?: {
    nodes: {
      quantity: number;
      lineItem: { title: string };
    }[];
  };
};

export type ShopifyCustomerOrder = {
  id: string;
  name: string;
  orderNumber: number;
  processedAt: string;
  financialStatus?: string;
  fulfillmentStatus?: string;
  canceledAt?: string | null;
  cancelReason?: string | null;
  statusUrl?: string;
  customerUrl?: string | null;
  email?: string | null;
  phone?: string | null;
  currencyCode?: string;
  currentSubtotalPrice?: ShopifyMoney;
  currentTotalPrice?: ShopifyMoney;
  currentTotalShippingPrice?: ShopifyMoney;
  currentTotalTax?: ShopifyMoney;
  totalPrice?: ShopifyMoney;
  totalRefunded?: ShopifyMoney;
  totalShippingPrice?: ShopifyMoney;
  totalTax?: ShopifyMoney | null;
  shippingAddress?: ShopifyMailingAddress | null;
  billingAddress?: ShopifyMailingAddress | null;
  lineItems?: { nodes: ShopifyOrderLineItem[] };
  successfulFulfillments?: ShopifyFulfillment[] | null;
};

export type CustomerSession = {
  accessToken: string;
  expiresAt: string;
  customer?: ShopifyCustomer | null;
};

export type RegisterInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  acceptsMarketing?: boolean;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type CustomerProfileInput = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  acceptsMarketing?: boolean;
};

type CustomerUserError = {
  field?: string[];
  message?: string;
  code?: string;
};

type CustomerAccessToken = {
  accessToken: string;
  expiresAt: string;
};

type CustomerCreatePayload = {
  data?: {
    customerCreate?: {
      customer?: ShopifyCustomer | null;
      customerUserErrors?: CustomerUserError[];
    };
  };
};

type CustomerAccessTokenCreatePayload = {
  data?: {
    customerAccessTokenCreate?: {
      customerAccessToken?: CustomerAccessToken | null;
      customerUserErrors?: CustomerUserError[];
    };
  };
};

type CustomerPayload = {
  data?: {
    customer?: ShopifyCustomer | null;
  };
};

type CustomerOrdersPayload = {
  data?: {
    customer?: {
      orders?: { nodes?: ShopifyCustomerOrder[] };
    } | null;
  };
};

type OrderDetailPayload = {
  data?: {
    node?: ShopifyCustomerOrder | null;
  };
};

type CustomerUpdatePayload = {
  data?: {
    customerUpdate?: {
      customer?: ShopifyCustomer | null;
      customerAccessToken?: CustomerAccessToken | null;
      customerUserErrors?: CustomerUserError[];
    };
  };
};

type CustomerResetByUrlPayload = {
  data?: {
    customerResetByUrl?: {
      customer?: Pick<ShopifyCustomer, 'id' | 'email'> | null;
      customerAccessToken?: CustomerAccessToken | null;
      customerUserErrors?: CustomerUserError[];
    };
  };
};

type CustomerRecoverPayload = {
  data?: {
    customerRecover?: {
      customerUserErrors?: CustomerUserError[];
    };
  };
};

const CUSTOMER_FIELDS = `
  id
  firstName
  lastName
  email
  phone
  acceptsMarketing
  createdAt
  updatedAt
  numberOfOrders
  defaultAddress {
    id
    firstName
    lastName
    address1
    address2
    city
    province
    zip
    country
    phone
  }
`;

const ORDER_SUMMARY_FIELDS = `
  id
  name
  orderNumber
  processedAt
  financialStatus
  fulfillmentStatus
  canceledAt
  cancelReason
  statusUrl
  currentTotalPrice { amount currencyCode }
  totalPrice { amount currencyCode }
`;

const ORDER_DETAIL_FIELDS = `
  id
  name
  orderNumber
  processedAt
  financialStatus
  fulfillmentStatus
  canceledAt
  cancelReason
  statusUrl
  customerUrl
  email
  phone
  currencyCode
  currentSubtotalPrice { amount currencyCode }
  currentTotalPrice { amount currencyCode }
  currentTotalShippingPrice { amount currencyCode }
  currentTotalTax { amount currencyCode }
  totalPrice { amount currencyCode }
  totalRefunded { amount currencyCode }
  totalShippingPrice { amount currencyCode }
  totalTax { amount currencyCode }
  shippingAddress {
    firstName
    lastName
    address1
    address2
    city
    province
    zip
    country
    phone
  }
  billingAddress {
    firstName
    lastName
    address1
    address2
    city
    province
    zip
    country
    phone
  }
  lineItems(first: 50) {
    nodes {
      title
      quantity
      currentQuantity
      originalTotalPrice { amount currencyCode }
      discountedTotalPrice { amount currencyCode }
      variant {
        id
        title
        image { url altText }
        product { title handle }
      }
    }
  }
  successfulFulfillments(first: 10) {
    trackingCompany
    trackingInfo(first: 10) { number url }
    fulfillmentLineItems(first: 10) {
      nodes {
        quantity
        lineItem { title }
      }
    }
  }
`;

function getCustomerErrors(errors: CustomerUserError[] = []) {
  return errors.map((error) => error.message).filter(Boolean).join(' ') || 'Shopify customer account request failed.';
}

function emitAuthChange() {
  window.dispatchEvent(new CustomEvent(AUTH_EVENT));
}

export function onCustomerSessionChange(callback: () => void) {
  const handler = () => callback();
  window.addEventListener('storage', handler);
  window.addEventListener(AUTH_EVENT, handler);
  return () => {
    window.removeEventListener('storage', handler);
    window.removeEventListener(AUTH_EVENT, handler);
  };
}

export function getStoredCustomerSession(): CustomerSession | null {
  try {
    const raw = window.localStorage.getItem(CUSTOMER_SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as CustomerSession;
    if (!session.accessToken || new Date(session.expiresAt).getTime() <= Date.now()) {
      clearCustomerSession();
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function saveCustomerSession(session: CustomerSession) {
  window.localStorage.setItem(CUSTOMER_SESSION_KEY, JSON.stringify(session));
  emitAuthChange();
}

export function clearCustomerSession() {
  window.localStorage.removeItem(CUSTOMER_SESSION_KEY);
  emitAuthChange();
}

export async function registerCustomer(input: RegisterInput): Promise<ShopifyCustomer> {
  const payload = await shopifyStorefrontFetch<CustomerCreatePayload>({
    query: `mutation CustomerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer { id firstName lastName email phone acceptsMarketing createdAt }
        customerUserErrors { field message code }
      }
    }`,
    variables: {
      input: {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        password: input.password,
        phone: input.phone || undefined,
        acceptsMarketing: input.acceptsMarketing ?? false,
      },
    },
  });

  const errors = payload?.data?.customerCreate?.customerUserErrors ?? [];
  if (errors.length) throw new Error(getCustomerErrors(errors));

  const customer = payload?.data?.customerCreate?.customer;
  if (!customer) throw new Error('Shopify did not return the new customer account.');
  return customer;
}

export async function loginCustomer(input: LoginInput): Promise<CustomerSession> {
  const payload = await shopifyStorefrontFetch<CustomerAccessTokenCreatePayload>({
    query: `mutation CustomerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken { accessToken expiresAt }
        customerUserErrors { field message code }
      }
    }`,
    variables: { input },
  });

  const errors = payload?.data?.customerAccessTokenCreate?.customerUserErrors ?? [];
  if (errors.length) throw new Error(getCustomerErrors(errors));

  const token = payload?.data?.customerAccessTokenCreate?.customerAccessToken;
  if (!token?.accessToken) throw new Error('Shopify did not return a customer access token.');

  const customer = await getCustomer(token.accessToken);
  const session = { accessToken: token.accessToken, expiresAt: token.expiresAt, customer };
  saveCustomerSession(session);
  return session;
}

export async function getCustomer(accessToken: string): Promise<ShopifyCustomer | null> {
  const payload = await shopifyStorefrontFetch<CustomerPayload>({
    query: `query Customer($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        ${CUSTOMER_FIELDS}
      }
    }`,
    variables: { customerAccessToken: accessToken },
  });

  return payload?.data?.customer ?? null;
}

export async function getCustomerOrders(accessToken: string, first = 50): Promise<ShopifyCustomerOrder[]> {
  const payload = await shopifyStorefrontFetch<CustomerOrdersPayload>({
    query: `query CustomerOrders($customerAccessToken: String!, $first: Int!) {
      customer(customerAccessToken: $customerAccessToken) {
        orders(first: $first, sortKey: PROCESSED_AT, reverse: true) {
          nodes {
            ${ORDER_SUMMARY_FIELDS}
          }
        }
      }
    }`,
    variables: { customerAccessToken: accessToken, first },
  });

  return payload?.data?.customer?.orders?.nodes ?? [];
}

export async function getCustomerOrder(accessToken: string, orderId: string): Promise<ShopifyCustomerOrder | null> {
  const orders = await getCustomerOrders(accessToken, 50);
  const orderBelongsToCustomer = orders.some((order) => order.id === orderId);
  if (!orderBelongsToCustomer) return null;

  const payload = await shopifyStorefrontFetch<OrderDetailPayload>({
    query: `query OrderDetail($id: ID!) {
      node(id: $id) {
        ... on Order {
          ${ORDER_DETAIL_FIELDS}
        }
      }
    }`,
    variables: { id: orderId },
  });

  return payload?.data?.node ?? orders.find((order) => order.id === orderId) ?? null;
}

export async function updateCustomerProfile(accessToken: string, input: CustomerProfileInput, expiresAt: string): Promise<CustomerSession> {
  const payload = await shopifyStorefrontFetch<CustomerUpdatePayload>({
    query: `mutation CustomerProfileUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
      customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
        customer { ${CUSTOMER_FIELDS} }
        customerAccessToken { accessToken expiresAt }
        customerUserErrors { field message code }
      }
    }`,
    variables: {
      customerAccessToken: accessToken,
      customer: input,
    },
  });

  const errors = payload?.data?.customerUpdate?.customerUserErrors ?? [];
  if (errors.length) throw new Error(getCustomerErrors(errors));

  const customer = payload?.data?.customerUpdate?.customer;
  if (!customer) throw new Error('Shopify did not return the updated customer account.');

  const token = payload?.data?.customerUpdate?.customerAccessToken;
  const session = {
    accessToken: token?.accessToken || accessToken,
    expiresAt: token?.expiresAt || expiresAt,
    customer,
  };
  saveCustomerSession(session);
  return session;
}

export async function updateCustomerPassword(accessToken: string, password: string): Promise<CustomerSession> {
  const payload = await shopifyStorefrontFetch<CustomerUpdatePayload>({
    query: `mutation CustomerPasswordUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
      customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
        customer { ${CUSTOMER_FIELDS} }
        customerAccessToken { accessToken expiresAt }
        customerUserErrors { field message code }
      }
    }`,
    variables: {
      customerAccessToken: accessToken,
      customer: { password },
    },
  });

  const errors = payload?.data?.customerUpdate?.customerUserErrors ?? [];
  if (errors.length) throw new Error(getCustomerErrors(errors));

  const token = payload?.data?.customerUpdate?.customerAccessToken;
  const customer = payload?.data?.customerUpdate?.customer;
  if (!token?.accessToken || !customer) throw new Error('Shopify did not return a refreshed customer session.');

  const session = { accessToken: token.accessToken, expiresAt: token.expiresAt, customer };
  saveCustomerSession(session);
  return session;
}

export async function resetCustomerPasswordByUrl(resetUrl: string, password: string): Promise<void> {
  const payload = await shopifyStorefrontFetch<CustomerResetByUrlPayload>({
    query: `mutation CustomerResetByUrl($resetUrl: URL!, $password: String!) {
      customerResetByUrl(resetUrl: $resetUrl, password: $password) {
        customer { id email }
        customerAccessToken { accessToken expiresAt }
        customerUserErrors { field message code }
      }
    }`,
    variables: {
      resetUrl,
      password,
    },
  });

  const errors = payload?.data?.customerResetByUrl?.customerUserErrors ?? [];
  if (errors.length) throw new Error(getCustomerErrors(errors));

  const customer = payload?.data?.customerResetByUrl?.customer;
  if (!customer) throw new Error('Shopify could not reset the password with this reset link.');
}

export async function recoverCustomerPassword(email: string): Promise<void> {
  const payload = await shopifyStorefrontFetch<CustomerRecoverPayload>({
    query: `mutation CustomerRecover($email: String!) {
      customerRecover(email: $email) {
        customerUserErrors { field message code }
      }
    }`,
    variables: { email },
  });

  const errors = payload?.data?.customerRecover?.customerUserErrors ?? [];
  if (errors.length) throw new Error(getCustomerErrors(errors));
}

export function getCustomerDisplayName(customer?: ShopifyCustomer | null) {
  const name = [customer?.firstName, customer?.lastName].filter(Boolean).join(' ').trim();
  return name || customer?.email || 'Customer';
}
