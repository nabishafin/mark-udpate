import { FormEvent, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Mail,
  MessageCircle,
  Send,
  X,
} from 'lucide-react';
import { apiBaseUrl } from '../lib/api';

const SESSION_KEY = 'mdrnLifeSupportSessionId';
const WHATSAPP_NUMBER = '19544105042';
const SUPPORT_EMAIL = 'support@orisefinance.com';

const API_BASE = apiBaseUrl();

type ChatView = 'home' | 'email' | 'emailSent';
type ApiPayload = Record<string, unknown>;

function getSessionId() {
  const existing = window.localStorage.getItem(SESSION_KEY);
  if (existing) return existing;

  const sessionId = `web_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
  window.localStorage.setItem(SESSION_KEY, sessionId);
  return sessionId;
}

function whatsappUrl() {
  const text = [
    'Hi Mdrn-Life DDW support, I need help.',
    typeof window !== 'undefined' ? `Page: ${window.location.href}` : '',
  ].filter(Boolean).join('\n');

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

async function postJson(path: string, body: ApiPayload) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const payload = await response.json().catch(() => ({}));
  return { response, payload };
}

function isMissingApiRoute(response: Response, payload: ApiPayload) {
  return response.status === 404 && String(payload?.message || payload?.error || '').toLowerCase().includes('route not found');
}

type Props = {
  hidden?: boolean;
};

export function ShopifyInbox({ hidden = false }: Props) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [view, setView] = useState<ChatView>('home');
  const [supportEmail, setSupportEmail] = useState('');
  const [supportSubject, setSupportSubject] = useState('');
  const [supportIssue, setSupportIssue] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [website, setWebsite] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.documentElement.classList.toggle('shopify-inbox-custom-active', panelOpen);
    return () => document.documentElement.classList.remove('shopify-inbox-custom-active');
  }, [panelOpen]);

  useEffect(() => {
    if (hidden) setPanelOpen(false);
  }, [hidden]);

  if (hidden) return null;

  const openPanel = () => {
    setError('');
    setPanelOpen(true);
    setView('home');
  };

  const closePanel = () => {
    setPanelOpen(false);
    setError('');
  };

  const submitEmailSupport = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEmailLoading(true);
    setError('');

    try {
      if (website) {
        setView('emailSent');
        return;
      }

      const page = window.location.href;
      const sessionId = getSessionId();
      const supportPayload = {
        email: supportEmail,
        subject: supportSubject,
        issue: supportIssue,
        message: supportMessage,
        website,
        page,
        sessionId,
      };

      let { response, payload } = await postJson('/api/email-support', supportPayload);

      if (isMissingApiRoute(response, payload)) {
        ({ response, payload } = await postJson('/api/contact', {
          name: 'Support widget request',
          email: supportEmail,
          phone: '',
          subject: supportSubject || 'Website support request',
          message: [
            supportIssue ? `Issue type: ${supportIssue}` : '',
            supportMessage,
            '',
            `Page: ${page}`,
          ].filter(Boolean).join('\n'),
        }));
      }

      if (!response.ok) throw new Error(payload?.error || 'Support request could not be sent.');

      setSupportSubject('');
      setSupportIssue('');
      setSupportMessage('');
      setWebsite('');
      setView('emailSent');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Support request could not be sent.');
    } finally {
      setEmailLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {panelOpen && (
        <motion.aside
          key="shopify-chat-panel"
          role="dialog"
          aria-label="Mdrn-Life DDW support"
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.96 }}
          transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
          className="fixed bottom-6 right-6 z-[2147483646] flex h-[min(680px,calc(100vh-3rem))] w-[calc(100vw-2rem)] max-w-[390px] flex-col overflow-hidden rounded-2xl border border-cyan-200/20 bg-[#071017]/96 text-white shadow-[0_24px_90px_-24px_rgba(63,184,255,0.85)] backdrop-blur-2xl"
        >
          <div className="border-b border-white/10 bg-[#050608] px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                aria-label="Back"
                onClick={() => setView('home')}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/70 transition hover:bg-white/[0.08] hover:text-white"
              >
                <ArrowLeft size={18} />
              </button>
              <div className="text-center">
                <h2 className="text-sm font-semibold leading-tight text-white">Mdrn-Life DDW</h2>
                <p className="mt-1 text-[11px] leading-none text-cyan-100/55">Support team</p>
              </div>
              <button
                type="button"
                aria-label="Close support"
                onClick={closePanel}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/70 transition hover:bg-white/[0.08] hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto bg-[#071017]/82">
            {view === 'home' && (
              <div className="space-y-4 p-4">
                <div className="rounded-2xl border border-cyan-200/15 bg-cyan-300/[0.08] p-4">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-cyan-300/[0.12] text-cyan-100">
                    <MessageCircle size={22} strokeWidth={1.8} />
                  </div>
                  <h3 className="text-lg font-medium text-white">Support</h3>
                  <p className="mt-2 text-sm leading-6 text-white/68">
                    Choose the fastest way to reach the Mdrn-Life DDW support team.
                  </p>
                </div>

                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center justify-between rounded-xl border border-cyan-200/20 bg-cyan-300/[0.10] px-4 py-3 text-left text-sm font-medium text-cyan-50 transition hover:border-cyan-200/40 hover:bg-cyan-300/[0.14]"
                >
                  WhatsApp support
                  <ExternalLink size={16} />
                </a>

                <button
                  type="button"
                  onClick={() => setView('email')}
                  className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm text-white/72 transition hover:border-cyan-200/30 hover:bg-white/[0.07] hover:text-white"
                >
                  Email support
                  <Mail size={16} />
                </button>
              </div>
            )}

            {view === 'email' && (
              <form className="space-y-4 p-4" onSubmit={submitEmailSupport}>
                <div className="pt-2 text-center">
                  <h3 className="text-lg font-medium text-white">Email support</h3>
                  <p className="mt-2 text-sm leading-6 text-white/62">
                    Send the support team the details they need to help.
                  </p>
                </div>

                <input
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(event) => setWebsite(event.target.value)}
                  name="website"
                />

                <div className="grid gap-3">
                  <input
                    required
                    type="email"
                    value={supportEmail}
                    onChange={(event) => setSupportEmail(event.target.value)}
                    autoComplete="email"
                    className="rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-white/32 focus:border-cyan-300/55"
                    placeholder="Email address"
                  />
                  <input
                    required
                    value={supportSubject}
                    onChange={(event) => setSupportSubject(event.target.value)}
                    className="rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-white/32 focus:border-cyan-300/55"
                    placeholder="Subject"
                  />
                  <select
                    required
                    value={supportIssue}
                    onChange={(event) => setSupportIssue(event.target.value)}
                    className="rounded-xl border border-white/10 bg-[#0a1219] px-3.5 py-3 text-sm text-white outline-none transition focus:border-cyan-300/55"
                  >
                    <option value="">Issue type</option>
                    <option value="Order issue">Order issue</option>
                    <option value="Shipping or tracking">Shipping or tracking</option>
                    <option value="Product question">Product question</option>
                    <option value="Subscription help">Subscription help</option>
                    <option value="Returns or refunds">Returns or refunds</option>
                    <option value="Other">Other</option>
                  </select>
                  <textarea
                    required
                    rows={6}
                    value={supportMessage}
                    onChange={(event) => setSupportMessage(event.target.value)}
                    className="resize-none rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/32 focus:border-cyan-300/55"
                    placeholder="Describe the issue"
                  />
                </div>

                {error && (
                  <div className="rounded-xl border border-red-300/20 bg-red-300/[0.06] p-3 text-sm text-red-100">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={emailLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-200/20 bg-cyan-300/[0.10] px-3.5 py-3 text-sm font-medium text-cyan-50 transition hover:border-cyan-200/40 hover:bg-cyan-300/[0.14] disabled:cursor-wait disabled:opacity-70"
                >
                  {emailLoading ? 'Sending' : 'Send support request'}
                  {emailLoading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                </button>
              </form>
            )}

            {view === 'emailSent' && (
              <div className="space-y-4 p-4">
                <div className="rounded-2xl border border-cyan-200/20 bg-cyan-300/[0.08] p-4">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-200/20 bg-cyan-300/[0.12] text-cyan-100">
                    <CheckCircle2 size={20} />
                  </div>
                  <h3 className="text-lg font-medium text-white">Request sent</h3>
                  <p className="mt-3 text-sm leading-6 text-white/68">
                    Your message was sent to {SUPPORT_EMAIL}. The team can reply directly to your email.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setView('home')}
                  className="flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-3 text-sm text-white/72 transition hover:border-cyan-200/30 hover:bg-white/[0.07] hover:text-white"
                >
                  Back to support
                </button>
              </div>
            )}

          </div>
        </motion.aside>
      )}

      {!panelOpen && (
        <motion.button
          key="shopify-chat-launcher"
          type="button"
          aria-label="Open support"
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.96 }}
          transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
          onClick={openPanel}
          className="group fixed bottom-6 right-6 z-[2147483646] flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-200/30 bg-[#071017]/92 text-cyan-50 shadow-[0_18px_60px_-18px_rgba(63,184,255,0.85)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-cyan-200/55 hover:bg-[#0a1821] sm:h-auto sm:w-auto sm:gap-3 sm:px-4 sm:py-3"
        >
          <span className="absolute inset-0 rounded-2xl bg-cyan-300/10 opacity-0 transition group-hover:opacity-100" />
          <span className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-cyan-300/[0.12] text-cyan-100">
            <MessageCircle size={22} strokeWidth={1.8} />
          </span>
          <span className="relative hidden text-left sm:block">
            <span className="block text-xs font-medium leading-none text-white">Support</span>
            <span className="mt-1 block text-[11px] leading-none text-cyan-100/65">WhatsApp and email</span>
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
