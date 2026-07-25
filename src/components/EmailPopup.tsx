import { FormEvent, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Loader2, X } from 'lucide-react';
import { subscribeEmailToMarketing } from '../lib/marketing';

const STORAGE_KEY = 'mdrn-life-ddw-email-popup';
const SESSION_KEY = 'mdrn-life-ddw-marketing-session';
// Give first-time visitors time to see and use the hero before interrupting
// them with an optional marketing request.
const SHOW_DELAY_MS = 60000;
const DISMISS_FOR_MS = 30 * 24 * 60 * 60 * 1000;
const SUBSCRIBE_FOR_MS = 365 * 24 * 60 * 60 * 1000;

// Don't interrupt active commerce / account flows with the marketing popup.
const SUPPRESSED_PATHS = [
  /^\/checkout/,
  /^\/cart/,
  /^\/products\/cart/,
  /^\/account/,
  /^\/login/,
  /^\/register/,
  /^\/forgot-password/,
  /^\/reset-password/,
];

const BENEFITS = [
  'Request information about product and wholesale options',
  'Receive product education and company updates',
  'Learn about available training and support',
  'Connect with the Mdrn-Life DDW community',
];

function alreadyHandled() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const stored = JSON.parse(raw) as { expiresAt?: number };
    if (!stored.expiresAt || stored.expiresAt <= Date.now()) {
      window.localStorage.removeItem(STORAGE_KEY);
      return false;
    }
    return true;
  } catch {
    return Boolean(window.localStorage.getItem(STORAGE_KEY));
  }
}

function remember(value: 'dismissed' | 'subscribed', durationMs: number) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
      value,
      expiresAt: Date.now() + durationMs,
    }));
  } catch {
    /* ignore storage failures */
  }
}

function getSessionId() {
  try {
    const existing = window.localStorage.getItem(SESSION_KEY);
    if (existing) return existing;

    const randomId = window.crypto?.randomUUID?.() || `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
    const sessionId = `lead_${randomId}`;
    window.localStorage.setItem(SESSION_KEY, sessionId);
    return sessionId;
  } catch {
    return `lead_${Date.now().toString(36)}`;
  }
}

export function EmailPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (alreadyHandled()) return;
    if (SUPPRESSED_PATHS.some((pattern) => pattern.test(window.location.pathname))) return;

    const timer = window.setTimeout(() => setOpen(true), SHOW_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') dismiss();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const dismiss = () => {
    remember('dismissed', DISMISS_FOR_MS);
    setOpen(false);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await subscribeEmailToMarketing({
        email,
        acceptsMarketing: true,
        website,
        page: window.location.href,
        sessionId: getSessionId(),
      });
      setDone(true);
      remember('subscribed', SUBSCRIBE_FOR_MS);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save your email. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={dismiss}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="email-popup-title"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
            className="hpe-glass-strong relative z-10 w-full max-w-md overflow-hidden rounded-3xl p-7 sm:p-9"
          >
            <button
              type="button"
              aria-label="Close"
              onClick={dismiss}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/60 transition hover:text-white"
            >
              <X size={16} />
            </button>

            {done ? (
              <div className="py-6 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-300/[0.1] text-cyan-200">
                  <Check size={26} />
                </div>
                <h2 className="mt-6 text-2xl font-medium text-white">Request received.</h2>
                <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-white/60">
                  Thanks. We received your email and interest in future Mdrn-Life DDW updates.
                </p>
                <button
                  type="button"
                  onClick={dismiss}
                  className="hpe-btn-primary mt-7 w-full rounded-xl px-5 py-3 text-sm font-medium tracking-wide"
                >
                  Continue browsing
                </button>
              </div>
            ) : (
              <>
                <h2 id="email-popup-title" className="pr-8 text-2xl font-medium leading-tight tracking-tight text-white sm:text-3xl">
                  Learn more about Mdrn-Life DDW.
                </h2>

                <ul className="mt-5 space-y-2.5">
                  {BENEFITS.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2.5 text-sm leading-relaxed text-white/70">
                      <Check size={15} className="mt-0.5 shrink-0 text-cyan-300" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>

                <form onSubmit={submit} className="mt-6">
                  <input
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(event) => setWebsite(event.target.value)}
                    name="website"
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Email address"
                    aria-label="Email address"
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? 'email-popup-error' : 'email-popup-consent'}
                    autoComplete="email"
                    className="w-full rounded-xl border border-white/12 bg-white/[0.05] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-cyan-300/55 focus:ring-1 focus:ring-cyan-300/25"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="hpe-btn-primary mt-3 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-medium tracking-wide disabled:cursor-wait disabled:opacity-70"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={15} className="animate-spin" /> Saving...
                      </>
                    ) : (
                      'Request information'
                    )}
                  </button>

                  {error && (
                    <p id="email-popup-error" role="alert" className="mt-3 rounded-xl border border-red-300/20 bg-red-300/[0.06] p-3 text-xs leading-relaxed text-red-200">
                      {error}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={dismiss}
                    className="mt-4 w-full text-center text-sm text-white/45 transition hover:text-white/70"
                  >
                    No thanks
                  </button>
                  <p id="email-popup-consent" className="mt-3 text-center text-[11px] leading-relaxed text-white/65">
                    By submitting, you request information by email. You can ask us to stop future messages at any time.
                  </p>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
