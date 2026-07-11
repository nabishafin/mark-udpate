import { ChangeEvent, FormEvent, useState } from 'react';
import { motion } from 'framer-motion';
import { Beaker, Briefcase, Mail, MapPin, Phone, Send, ShieldCheck, Users } from 'lucide-react';

type ContactValues = {
  name: string;
  email: string;
  phone: string;
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
  phone: '',
  subject: '',
  message: '',
};

const initialErrors: ContactErrors = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
};

const CONTACT_DETAILS = [
  {
    icon: Phone,
    title: 'Phone',
    value: '(888) 391-8023',
    href: 'tel:+18883918023',
  },
  {
    icon: Mail,
    title: 'Email',
    value: 'Support@orisefinance.com',
    href: 'mailto:Support@orisefinance.com',
  },
  {
    icon: MapPin,
    title: 'Address',
    value: '1436 E Atlantic Blvd Unit C, Pompano Beach, FL 33060',
    href: 'https://www.google.com/maps/search/?api=1&query=1436%20E%20Atlantic%20Blvd%20Unit%20C%2C%20Pompano%20Beach%2C%20FL%2033060',
  },
];

const INQUIRY_TYPES = [
  {
    icon: Briefcase,
    title: 'Wholesale',
    body: 'Bulk orders and wholesale pricing for retailers, distributors, and commercial buyers.',
  },
  {
    icon: ShieldCheck,
    title: 'Practitioner Program',
    body: 'DDW for clinical, therapeutic, or practitioner-recommended protocols.',
  },
  {
    icon: Users,
    title: 'Retail Partnerships',
    body: 'Stocking Mdrn-Life DDW in your store, dispensary, or online marketplace.',
  },
  {
    icon: Beaker,
    title: 'Testing & Verification',
    body: 'Questions about our IRMS testing process, batch documentation, or lab reports.',
  },
];

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
          phone: values.phone.trim(),
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
    <section className="hpe-section relative min-h-screen overflow-hidden pt-32">
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <div className="hpe-hud-label">Contact</div>
          <h1 className="mt-4 text-4xl font-medium tracking-tight text-white sm:text-6xl">
            Contact Mdrn-Life DDW
          </h1>
          <p className="mt-5 text-base leading-relaxed text-white/62 sm:text-lg">
            Questions about 5 ppm DDW, lab reports, wholesale, subscriptions,
            or practitioner support? Send the team a message below.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.06 }}
            className="hpe-glass rounded-2xl p-6 sm:p-8"
          >
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-cyan-300" />
              <div className="hpe-hud-label">Support</div>
            </div>
            <h2 className="mt-4 text-2xl font-medium tracking-tight text-white sm:text-3xl">
              Send the Mdrn-Life team a message.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-white/62">
              Use the form for product questions, wholesale inquiries,
              subscription support, or practitioner conversations.
            </p>
            <div className="mt-8 grid gap-3">
              {CONTACT_DETAILS.map(({ icon: Icon, title, value, href }) => (
                <a
                  key={title}
                  href={href}
                  target={title === 'Address' ? '_blank' : undefined}
                  rel={title === 'Address' ? 'noreferrer' : undefined}
                  className="group rounded-xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-cyan-300/35 hover:bg-cyan-300/[0.055]"
                >
                  <div className="flex gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/[0.07] text-cyan-200 transition group-hover:text-white">
                      <Icon size={17} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-white">{title}</span>
                      <span className="mt-1.5 block text-sm leading-relaxed text-white/58 transition group-hover:text-white/78">
                        {value}
                      </span>
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="hpe-glass rounded-2xl p-6 shadow-2xl shadow-cyan-950/20 sm:p-8"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="grid gap-5 sm:grid-cols-2">
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
              Phone number <span className="font-normal text-white/42">(optional)</span>
              <input
                className={inputClass}
                type="tel"
                name="phone"
                value={values.phone}
                onChange={updateField}
                autoComplete="tel"
                placeholder="+1 555 000 0000"
                disabled={loading}
              />
              {errors.phone && <span className={errorClass}>{errors.phone}</span>}
            </label>

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
              className="hpe-btn-primary mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium tracking-wide disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              type="submit"
              disabled={loading}
            >
              {loading && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
              )}
              {loading ? 'Sending...' : 'Send Message'}
              {!loading && <Send size={14} />}
            </button>
          </motion.form>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.14 }}
          className="mt-10"
        >
          <div className="hpe-hud-label mb-4">Inquiry Types</div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {INQUIRY_TYPES.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >
                <div className="mb-3 flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-300/20 bg-cyan-300/[0.07] text-cyan-200">
                    <Icon size={15} />
                  </span>
                  <span className="text-sm font-medium text-white">{title}</span>
                </div>
                <p className="text-xs leading-relaxed text-white/52">{body}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
