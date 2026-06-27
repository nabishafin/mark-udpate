export const SUPPORT_EMAIL = 'support@orisefinance.com';

export type ContactMessageResult = {
  mode: 'endpoint' | 'email';
};

function formValue(data: FormData, key: string) {
  const value = data.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

function buildMailtoUrl(data: FormData) {
  const name = formValue(data, 'name');
  const email = formValue(data, 'email');
  const phone = formValue(data, 'phone');
  const customerId = formValue(data, 'customer_id');
  const subject = formValue(data, 'subject') || 'Mdrn-Life DDW website message';
  const message = formValue(data, 'message');
  const details = [
    name ? `Name: ${name}` : '',
    email ? `Email: ${email}` : '',
    phone ? `Phone: ${phone}` : '',
    customerId ? `Shopify customer ID: ${customerId}` : '',
  ].filter(Boolean);
  const body = [...details, '', message].join('\n');

  return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export async function submitContactMessage(data: FormData): Promise<ContactMessageResult> {
  const endpoint = import.meta.env.VITE_CONTACT_FORM_ENDPOINT;
  if (!endpoint) {
    window.location.href = buildMailtoUrl(data);
    return { mode: 'email' };
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    body: data,
  });

  if (!response.ok) {
    throw new Error('Message could not be sent. Please email support directly.');
  }

  return { mode: 'endpoint' };
}
