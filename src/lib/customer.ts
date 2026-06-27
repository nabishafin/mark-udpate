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
};

export type ShopifyCustomerOrder = {
  id: string;
  name?: string;
  orderNumber?: number;
  processedAt?: string;
  financialStatus?: string;
  fulfillmentStatus?: string;
  statusUrl?: string;
  totalPrice?: { amount: string; currencyCode: string };
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

type CustomerUserError = {
  field?: string[];
  message?: string;
  code?: string;
};

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
  const payload = await shopifyStorefrontFetch({
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
  const payload = await shopifyStorefrontFetch({
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
  const payload = await shopifyStorefrontFetch({
    query: `query Customer($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        id
        firstName
        lastName
        email
        phone
        acceptsMarketing
        createdAt
      }
    }`,
    variables: { customerAccessToken: accessToken },
  });

  return payload?.data?.customer ?? null;
}

export async function getCustomerOrders(accessToken: string): Promise<ShopifyCustomerOrder[]> {
  const payload = await shopifyStorefrontFetch({
    query: `query CustomerOrders($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        orders(first: 10, sortKey: PROCESSED_AT, reverse: true) {
          nodes {
            id
            name
            orderNumber
            processedAt
            financialStatus
            fulfillmentStatus
            statusUrl
            totalPrice { amount currencyCode }
          }
        }
      }
    }`,
    variables: { customerAccessToken: accessToken },
  });

  return payload?.data?.customer?.orders?.nodes ?? [];
}

export async function recoverCustomerPassword(email: string): Promise<void> {
  const payload = await shopifyStorefrontFetch({
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
