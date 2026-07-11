import { ChangeEvent, FormEvent, useState } from 'react';

type ContactValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type ContactErrors = Record<keyof ContactValues, string>;

type AlertState = {
  type: 'success' | 'error';
  message: string;
} | null;

type ServerValidationError = {
  field?: string;
  message?: string;
};

const initialValues = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

const initialErrors: ContactErrors = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

function contactEndpoint() {
  const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
  return `${baseUrl}/api/contact`;
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validate(values: ContactValues) {
  const errors = { ...initialErrors };

  if (!values.name.trim()) {
    errors.name = 'Name is required.';
  }

  if (!values.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!isValidEmail(values.email.trim())) {
    errors.email = 'A valid email is required.';
  }

  if (!values.message.trim()) {
    errors.message = 'Message is required.';
  } else if (values.message.trim().length < 3) {
    errors.message = 'Message must be at least 3 characters.';
  }

  return errors;
}

function hasErrors(errors: ContactErrors) {
  return Object.values(errors).some(Boolean);
}

export function ContactPage() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState(initialErrors);
  const [alert, setAlert] = useState<AlertState>(null);
  const [loading, setLoading] = useState(false);

  const updateField = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  };

  const applyServerValidation = (serverErrors: ServerValidationError[] = []) => {
    const nextErrors = { ...initialErrors };

    for (const item of serverErrors) {
      if (item?.field && Object.prototype.hasOwnProperty.call(nextErrors, item.field)) {
        nextErrors[item.field as keyof ContactErrors] = item.message || 'This field is invalid.';
      }
    }

    setErrors(nextErrors);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAlert(null);

    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;

    setLoading(true);

    try {
      const response = await fetch(contactEndpoint(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          subject: values.subject.trim(),
          message: values.message.trim(),
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (response.status === 400 && Array.isArray(result.errors)) {
        applyServerValidation(result.errors);
        setAlert({ type: 'error', message: result.message || 'Validation failed' });
        return;
      }

      if (!response.ok || result.success !== true) {
        throw new Error(result.message || 'Something went wrong, please try again');
      }

      setAlert({
        type: 'success',
        message: result.message || 'Your message has been sent successfully.',
      });
      setValues(initialValues);
      setErrors(initialErrors);
    } catch (error) {
      setAlert({
        type: 'error',
        message: error instanceof Error ? error.message : 'Something went wrong, please try again',
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-cyan-300/70 focus:bg-white/[0.06]';
  const errorClass = 'mt-1.5 text-xs font-medium text-red-200';

  return (
    <section className="hpe-section relative min-h-screen overflow-hidden px-6 py-28">
      <div className="mx-auto flex min-h-[calc(100vh-14rem)] w-full max-w-3xl items-center justify-center">
        <form
          className="hpe-glass w-full rounded-2xl p-6 shadow-2xl shadow-cyan-950/20 sm:p-8"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="text-center">
            <div className="hpe-hud-label justify-center">Contact</div>
            <h1 className="mt-4 text-4xl font-medium tracking-tight text-white sm:text-5xl">
              Get in touch
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/62 sm:text-base">
              Send the Mdrn-Life DDW team a message about products, wholesale,
              subscriptions, lab reports, or practitioner support.
            </p>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-medium text-white/74">
              Name
              <input
                className={inputClass}
                name="name"
                value={values.name}
                onChange={updateField}
                autoComplete="name"
                placeholder="Your name"
                disabled={loading}
              />
              {errors.name && <span className={errorClass}>{errors.name}</span>}
            </label>

            <label className="block text-sm font-medium text-white/74">
              Email
              <input
                className={inputClass}
                type="email"
                name="email"
                value={values.email}
                onChange={updateField}
                autoComplete="email"
                placeholder="you@example.com"
                disabled={loading}
              />
              {errors.email && <span className={errorClass}>{errors.email}</span>}
            </label>
          </div>

          <label className="mt-5 block text-sm font-medium text-white/74">
            Subject <span className="font-normal text-white/42">(optional)</span>
            <input
              className={inputClass}
              name="subject"
              value={values.subject}
              onChange={updateField}
              placeholder="How can we help?"
              disabled={loading}
            />
            {errors.subject && <span className={errorClass}>{errors.subject}</span>}
          </label>

          <label className="mt-5 block text-sm font-medium text-white/74">
            Message
            <textarea
              className={`${inputClass} min-h-40 resize-none`}
              name="message"
              value={values.message}
              onChange={updateField}
              placeholder="Tell us what you need..."
              disabled={loading}
            />
            {errors.message && <span className={errorClass}>{errors.message}</span>}
          </label>

          {alert && (
            <div
              className={`mt-5 rounded-xl border p-4 text-sm ${
                alert.type === 'success'
                  ? 'border-emerald-300/25 bg-emerald-300/[0.08] text-emerald-100'
                  : 'border-red-300/25 bg-red-300/[0.08] text-red-100'
              }`}
              role="alert"
            >
              {alert.message}
            </div>
          )}

          <button
            className="hpe-btn-primary mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium tracking-wide disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={loading}
          >
            {loading && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
            )}
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </section>
  );
}
