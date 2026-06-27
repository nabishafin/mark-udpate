import { shopifyStorefrontFetch } from './shopify';

export type SubscribeInput = {
  email: string;
  firstName?: string;
  lastName?: string;
  acceptsMarketing?: boolean;
};

export type SubscribeResult = {
  // 'subscribed' = a new Shopify customer record was created.
  // 'already'    = the email already exists as a Shopify customer (still a success for the shopper).
  status: 'subscribed' | 'already';
};

type CustomerUserError = { field?: string[]; message?: string; code?: string };

const ALREADY_TAKEN = /already been taken|already exists|taken/i;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string) {
  return EMAIL_PATTERN.test(email.trim());
}

// Shopify's customerCreate mutation requires a password. For a marketing/email
// capture there is no shopper-chosen password, so we generate a strong random
// one. The shopper never needs it (they can use "forgot password" later if they
// ever want to log in), but it satisfies Shopify and creates the customer record
// the merchant sees in Admin -> Customers.
function generatePassword() {
  const chunk = () => Math.random().toString(36).slice(2);
  return `Ddw!${chunk()}${chunk()}${Date.now().toString(36)}A9`;
}

/**
 * Captures an email (and optional name) as a Shopify customer with marketing
 * consent via the Storefront API. The record appears in Shopify Admin ->
 * Customers immediately. Re-submitting an existing email resolves as 'already'
 * instead of throwing, so the shopper always sees a success state.
 */
export async function subscribeEmailToMarketing(input: SubscribeInput): Promise<SubscribeResult> {
  const email = input.email.trim();
  if (!isValidEmail(email)) {
    throw new Error('Please enter a valid email address.');
  }

  const payload = await shopifyStorefrontFetch<{
    data?: {
      customerCreate?: {
        customer?: { id: string; email: string } | null;
        customerUserErrors?: CustomerUserError[];
      };
    };
  }>({
    query: `mutation NewsletterSignup($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer { id email }
        customerUserErrors { field message code }
      }
    }`,
    variables: {
      input: {
        email,
        password: generatePassword(),
        firstName: input.firstName?.trim() || undefined,
        lastName: input.lastName?.trim() || undefined,
        acceptsMarketing: input.acceptsMarketing ?? true,
      },
    },
  });

  const errors = payload?.data?.customerCreate?.customerUserErrors ?? [];
  if (errors.length) {
    const taken = errors.some(
      (error) => error.code === 'TAKEN' || ALREADY_TAKEN.test(error.message || ''),
    );
    if (taken) return { status: 'already' };
    throw new Error(
      errors.map((error) => error.message).filter(Boolean).join(' ') ||
        'Could not save your email. Please try again.',
    );
  }

  if (!payload?.data?.customerCreate?.customer) {
    throw new Error('Could not save your email. Please try again.');
  }

  return { status: 'subscribed' };
}
