import React, { FormEvent, useState } from 'react';
import { motion } from 'framer-motion';
import { Beaker, Briefcase, Mail, MapPin, Phone, Send, ShieldCheck, Users } from 'lucide-react';
import { submitContactMessage } from '../lib/contact';

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

export function ContactPage() {
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setSubmitting(true);
    setStatus('');
    setError('');

    try {
      const result = await submitContactMessage(new FormData(form));
      setStatus(result.mode === 'email' ? 'Opening your email app with the message ready to send.' : 'Message sent to store support.');
      if (result.mode === 'endpoint') form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Message could not be sent. Please email support directly.');
    } finally {
      setSubmitting(false);
    }
  };

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
          className="hpe-glass rounded-2xl p-6 sm:p-8 grid gap-4"
          data-contact-endpoint={import.meta.env.VITE_CONTACT_FORM_ENDPOINT ? 'configured' : 'default'}
          onSubmit={submit}
        >
          <input type="hidden" name="subject" value="Mdrn-Life DDW website message" />
          <input type="hidden" name="issue" value="Contact form" />
          <input className="hidden" tabIndex={-1} autoComplete="off" name="website" />
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm text-white/70">
              Name
              <input
                required
                name="name"
                autoComplete="name"
                className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-cyan-300/60"
                placeholder="Your name"
              />
            </label>
            <label className="grid gap-2 text-sm text-white/70">
              Email
              <input
                required
                type="email"
                name="email"
                autoComplete="email"
                className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-cyan-300/60"
                placeholder="you@example.com"
              />
            </label>
          </div>
          <label className="grid gap-2 text-sm text-white/70">
            Phone number
            <input
              type="tel"
              name="phone"
              autoComplete="tel"
              className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-cyan-300/60"
              placeholder="+1 555 000 0000"
            />
          </label>
          <label className="grid gap-2 text-sm text-white/70">
            Message
            <textarea
              required
              name="message"
              rows={7}
              className="resize-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-cyan-300/60"
              placeholder="How can we help?"
            />
          </label>
          <button
            type="submit"
            disabled={submitting}
            className="hpe-btn-primary w-full rounded-xl px-5 py-3 text-sm font-medium tracking-wide inline-flex items-center justify-center gap-2 disabled:opacity-50 sm:w-auto"
          >
            {submitting ? 'Sending...' : 'Send Message'}
            <Send size={14} />
          </button>
          {(status || error) && (
            <div className={`rounded-xl border p-3 text-sm ${error ? 'border-red-300/20 bg-red-300/[0.06] text-red-100' : 'border-cyan-300/20 bg-cyan-300/[0.06] text-cyan-100'}`}>
              {error || status}
            </div>
          )}
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
            {[
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
            ].map(({ icon: Icon, title, body }) => (
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
