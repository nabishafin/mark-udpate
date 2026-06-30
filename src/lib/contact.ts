export const SUPPORT_EMAIL = 'support@orisefinance.com';

export type ContactMessageResult = {
  mode: 'endpoint';
};

function formValue(data: FormData, key: string) {
  const value = data.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

export async function submitContactMessage(data: FormData): Promise<ContactMessageResult> {
  const endpoint = import.meta.env.VITE_CONTACT_FORM_ENDPOINT || '/api/email-support';

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
    throw new Error(payload?.error || 'Message could not be sent. Please email support directly.');
  }

  return { mode: 'endpoint' };
}
