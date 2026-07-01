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
  const subject = formValue(data, 'subject') || 'Mdrn-Life DDW website message';
  const message = formValue(data, 'message');
  const details = [
    name ? `Name: ${name}` : '',
    email ? `Email: ${email}` : '',
    phone ? `Phone: ${phone}` : '',
  ].filter(Boolean);
  const body = [...details, '', message].join('\n');

  return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function openEmailFallback(data: FormData): ContactMessageResult {
  window.location.href = buildMailtoUrl(data);
  return { mode: 'email' };
}

export async function submitContactMessage(data: FormData): Promise<ContactMessageResult> {
  const endpoint = import.meta.env.VITE_CONTACT_FORM_ENDPOINT || '/api/email-support';

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source: 'Contact form',
        name: formValue(data, 'name'),
        email: formValue(data, 'email'),
        phone: formValue(data, 'phone'),
        subject: formValue(data, 'subject') || 'Mdrn-Life DDW website message',
        issue: formValue(data, 'issue') || 'Contact form',
        message: formValue(data, 'message'),
        website: formValue(data, 'website'),
      }),
    });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      return openEmailFallback(data);
    }

    return { mode: 'endpoint' };
  } catch {
    return openEmailFallback(data);
  }
}
