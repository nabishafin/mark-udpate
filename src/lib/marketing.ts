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
  status: 'subscribed';
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string) {
  return EMAIL_PATTERN.test(email.trim());
}

/**
 * Captures an opportunity-popup email through the server-side SMTP endpoint.
 * The backend emails the lead to the client mailbox and keeps SMTP credentials
 * out of the browser bundle.
 */
export async function subscribeEmailToMarketing(input: SubscribeInput): Promise<SubscribeResult> {
  const email = input.email.trim();
  if (!isValidEmail(email)) {
    throw new Error('Please enter a valid email address.');
  }

  const response = await fetch('/api/marketing-signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      acceptsMarketing: input.acceptsMarketing ?? true,
      website: input.website || '',
      page: input.page || window.location.href,
      sessionId: input.sessionId || '',
    }),
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload?.error || 'Could not save your email. Please try again.');
  }

  return { status: 'subscribed' };
}
