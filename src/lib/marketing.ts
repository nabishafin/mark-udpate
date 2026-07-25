import { apiBaseUrl } from './api';

export type SubscribeInput = {
  email: string;
  firstName?: string;
  lastName?: string;
  acceptsMarketing?: boolean;
  website?: string;
  page?: string;
  sessionId?: string;
};

export type SubscribeResult = {
  status: 'received';
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const API_BASE = apiBaseUrl();

export function isValidEmail(email: string) {
  return EMAIL_PATTERN.test(email.trim());
}

/**
 * Captures an information-request popup email through the server-side SMTP endpoint.
 * The backend emails the lead to the client mailbox and keeps SMTP credentials
 * out of the browser bundle.
 */
export async function subscribeEmailToMarketing(input: SubscribeInput): Promise<SubscribeResult> {
  const email = input.email.trim();
  if (!isValidEmail(email)) {
    throw new Error('Please enter a valid email address.');
  }

  if (input.website) {
    return { status: 'received' };
  }

  const page = input.page || window.location.href;
  const sessionId = input.sessionId || '';
  const response = await fetch(`${API_BASE}/api/marketing-signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      acceptsMarketing: input.acceptsMarketing === true,
      website: '',
      page,
      sessionId,
    }),
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload?.error || 'Could not save your email. Please try again.');
  }

  return { status: 'received' };
}
