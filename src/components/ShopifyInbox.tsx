import { FormEvent, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, ClipboardList, Loader2, Mail, MessageCircle, PackageSearch, Send, X } from 'lucide-react';

/**
 * Theme-native Shopify-backed chat.
 *
 * Shopify Inbox itself is still attempted in the background, but Shopify does
 * not expose a public API that lets a custom React widget write directly into
 * Inbox conversations. The visible flow below is therefore the reliable chat
 * surface: messages and order lookups post to server routes that use Shopify
 * Admin API credentials when SHOPIFY_ADMIN_ACCESS_TOKEN is configured.
 */

const DEFAULT_LOADER_SRC =
  'https://cdn.shopify.com/extensions/bdb6998f-cc8d-49e0-81e2-e024850275f1/inbox-640/assets/inbox-chat-loader.js';
const DEFAULT_SHOP_ID = '58223198242';
const CHAT_CONTAINER_ID = 'chat-button-container';
const CHAT_LOADER_ID = 'shopify-chat-loader';
const SESSION_KEY = 'mdrnLifeChatSessionId';

type ChatView = 'home' | 'prechat' | 'message' | 'order' | 'orderResult';

type ShopifyWindow = Window & {
  Shopify?: {
    designMode?: boolean;
    theme?: {
      theme_store_id?: number | string;
    };
  };
};

type ChatReply = {
  id: string;
  role: 'team' | 'customer' | 'system';
  text: string;
};

type OrderLookupResult = {
  found?: boolean;
  order?: {
    name?: string;
    processedAt?: string;
    financialStatus?: string;
    fulfillmentStatus?: string;
    total?: string;
    statusUrl?: string;
  };
  message?: string;
};

function loaderSrc() {
  return import.meta.env.VITE_SHOPIFY_INBOX_LOADER_SRC || DEFAULT_LOADER_SRC;
}

function shopDomain() {
  const raw = import.meta.env.VITE_SHOPIFY_CHECKOUT_DOMAIN || 'orise-6796.myshopify.com';
  return raw.replace(/^https?:\/\//, '').replace(/\/+$/, '');
}

function shopIdentifier() {
  return import.meta.env.VITE_SHOPIFY_INBOX_SHOP_ID || DEFAULT_SHOP_ID;
}

function getSessionId() {
  const existing = window.localStorage.getItem(SESSION_KEY);
  if (existing) return existing;

  const sessionId = `web_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
  window.localStorage.setItem(SESSION_KEY, sessionId);
  return sessionId;
}

function customerName(firstName: string, lastName: string) {
  return [firstName.trim(), lastName.trim()].filter(Boolean).join(' ');
}

function orderSummary(result: OrderLookupResult) {
  if (!result.found || !result.order) {
    return result.message || 'We could not find that order. Please check the order number and email address.';
  }

  const order = result.order;
  return [
    `Order ${order.name || ''}`.trim(),
    order.fulfillmentStatus ? `Fulfillment: ${order.fulfillmentStatus}` : '',
    order.financialStatus ? `Payment: ${order.financialStatus}` : '',
    order.total ? `Total: ${order.total}` : '',
  ].filter(Boolean).join('\n');
}

export function ShopifyInbox() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [view, setView] = useState<ChatView>('home');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [draft, setDraft] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [orderEmail, setOrderEmail] = useState('');
  const [orderResult, setOrderResult] = useState<OrderLookupResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [error, setError] = useState('');
  const [replies, setReplies] = useState<ChatReply[]>([
    {
      id: 'welcome',
      role: 'team',
      text: "Hi, message us with any questions. We're happy to help.",
    },
  ]);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const shopifyWindow = window as ShopifyWindow;
    shopifyWindow.Shopify = {
      ...shopifyWindow.Shopify,
      designMode: shopifyWindow.Shopify?.designMode ?? false,
    };

    if (!document.getElementById(CHAT_CONTAINER_ID)) {
      const config = document.createElement('div');
      config.id = CHAT_CONTAINER_ID;
      config.setAttribute('data-domain', shopDomain());
      config.setAttribute('data-horizontal-position', 'bottom_right');
      config.setAttribute('data-vertical-position', 'lowest');
      config.setAttribute('data-icon', 'chat_bubble');
      config.setAttribute('data-text', 'chat_with_us');
      config.setAttribute('data-color', '#3FB8FF');
      config.setAttribute('data-secondary-color', '#050608');
      config.setAttribute('data-ternary-color', '#ffffff');
      config.setAttribute('data-external-identifier', shopIdentifier());
      document.body.appendChild(config);
    }

    if (!document.getElementById(CHAT_LOADER_ID)) {
      const script = document.createElement('script');
      script.id = CHAT_LOADER_ID;
      script.async = true;
      script.src = loaderSrc();
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('shopify-inbox-custom-active', panelOpen);
    return () => document.documentElement.classList.remove('shopify-inbox-custom-active');
  }, [panelOpen]);

  useEffect(() => {
    if (panelOpen && view === 'message') inputRef.current?.focus();
  }, [panelOpen, view]);

  const openPanel = () => {
    setError('');
    setPanelOpen(true);
    setView(email ? 'message' : 'home');
  };

  const closePanel = () => {
    setPanelOpen(false);
    setError('');
  };

  const startChat = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setView('message');
  };

  const submitMessage = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    const message = draft.trim();
    if (!message) return;

    if (!email) {
      setView('prechat');
      return;
    }

    setSubmitting(true);
    setError('');
    setReplies((items) => [
      ...items,
      {
        id: `customer_${Date.now()}`,
        role: 'customer',
        text: message,
      },
    ]);

    try {
      const response = await fetch('/api/shopify-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: customerName(firstName, lastName),
          email,
          message,
          marketingOptIn,
          sessionId: getSessionId(),
          page: window.location.href,
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload?.error || 'Message could not be sent.');

      setDraft('');
      setReplies((items) => [
        ...items,
        {
          id: `system_${Date.now()}`,
          role: 'system',
          text: 'Message sent to store support. We will reply by email if you leave the chat.',
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Message could not be sent.');
    } finally {
      setSubmitting(false);
    }
  };

  const lookupOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setOrderLoading(true);
    setError('');
    setOrderResult(null);

    try {
      const response = await fetch('/api/shopify-order-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber,
          email: orderEmail,
          sessionId: getSessionId(),
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload?.error || 'Order could not be checked.');

      setOrderResult(payload);
      setReplies((items) => [
        ...items,
        { id: `order_question_${Date.now()}`, role: 'customer', text: `Track my order: ${orderNumber}` },
        { id: `order_answer_${Date.now()}`, role: 'team', text: orderSummary(payload) },
      ]);
      setView('orderResult');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Order could not be checked.');
    } finally {
      setOrderLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {panelOpen && (
        <motion.aside
          key="shopify-chat-panel"
          role="dialog"
          aria-label="Chat with us"
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
                onClick={() => setView(view === 'home' ? 'home' : 'home')}
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
                aria-label="Close chat"
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
                  <h3 className="text-lg font-medium text-white">Chat with us</h3>
                  <p className="mt-2 text-sm leading-6 text-white/68">
                    Hi, message us with any questions. We're happy to help.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setView(email ? 'message' : 'prechat')}
                  className="flex w-full items-center justify-between rounded-xl border border-cyan-200/20 bg-cyan-300/[0.10] px-4 py-3 text-left text-sm font-medium text-cyan-50 transition hover:border-cyan-200/40 hover:bg-cyan-300/[0.14]"
                >
                  Write message
                  <Send size={16} />
                </button>

                <div>
                  <div className="mb-2 text-center text-xs font-medium uppercase tracking-[0.18em] text-white/42">Instant answers</div>
                  <button
                    type="button"
                    onClick={() => setView('order')}
                    className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm text-white/78 transition hover:border-cyan-200/30 hover:bg-white/[0.07] hover:text-white"
                  >
                    Track my order
                    <PackageSearch size={16} />
                  </button>
                </div>

                <a
                  href="mailto:Support@orisefinance.com"
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/72 transition hover:border-cyan-200/30 hover:bg-white/[0.07] hover:text-white"
                >
                  Email support
                  <Mail size={16} />
                </a>
              </div>
            )}

            {view === 'prechat' && (
              <form className="space-y-4 p-4" onSubmit={startChat}>
                <div className="pt-2 text-center">
                  <h3 className="text-lg font-medium text-white">Before we get started</h3>
                  <p className="mt-2 text-sm leading-6 text-white/62">
                    Please provide your information so we can reply to you if you leave the chat.
                  </p>
                </div>

                <div className="grid gap-3">
                  <input
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    autoComplete="given-name"
                    className="rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-white/32 focus:border-cyan-300/55"
                    placeholder="First Name"
                  />
                  <input
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    autoComplete="family-name"
                    className="rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-white/32 focus:border-cyan-300/55"
                    placeholder="Last Name"
                  />
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    className="rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-white/32 focus:border-cyan-300/55"
                    placeholder="Email Address"
                  />
                  <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm leading-6 text-white/68">
                    <input
                      type="checkbox"
                      checked={marketingOptIn}
                      onChange={(event) => setMarketingOptIn(event.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-white/20 bg-transparent"
                    />
                    Opt in to get special email promotions and updates. You can opt out anytime.
                  </label>
                </div>

                <p className="rounded-xl border border-white/10 bg-white/[0.035] p-3 text-center text-xs leading-5 text-white/42">
                  By proceeding, you agree that your message may be stored so store support can respond.
                </p>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-200/20 bg-cyan-300/[0.10] px-3.5 py-3 text-sm font-medium text-cyan-50 transition hover:border-cyan-200/40 hover:bg-cyan-300/[0.14]"
                >
                  Start chat
                  <MessageCircle size={15} />
                </button>
              </form>
            )}

            {view === 'message' && (
              <form className="flex h-full flex-col" onSubmit={submitMessage}>
                <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
                  {replies.map((reply) => (
                    <div
                      key={reply.id}
                      className={`max-w-[86%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-6 ${
                        reply.role === 'customer'
                          ? 'ml-auto bg-cyan-300/[0.16] text-cyan-50'
                          : reply.role === 'system'
                            ? 'mx-auto border border-cyan-200/20 bg-cyan-300/[0.07] text-center text-cyan-100'
                            : 'bg-white/[0.06] text-white/72'
                      }`}
                    >
                      {reply.text}
                    </div>
                  ))}
                  {error && (
                    <div className="rounded-xl border border-red-300/20 bg-red-300/[0.06] p-3 text-sm text-red-100">
                      {error}
                    </div>
                  )}
                </div>

                <div className="border-t border-white/10 bg-[#050608]/82 p-3">
                  <div className="flex items-end gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-2">
                    <textarea
                      ref={inputRef}
                      rows={2}
                      value={draft}
                      onChange={(event) => setDraft(event.target.value)}
                      className="min-h-11 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-white/32"
                      placeholder="Write message"
                    />
                    <button
                      type="submit"
                      disabled={submitting || !draft.trim()}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-300/[0.14] text-cyan-50 transition hover:bg-cyan-300/[0.22] disabled:opacity-40"
                    >
                      {submitting ? <Loader2 size={17} className="animate-spin" /> : <Send size={17} />}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {view === 'order' && (
              <form className="space-y-4 p-4" onSubmit={lookupOrder}>
                <div className="pt-2 text-center">
                  <h3 className="text-lg font-medium text-white">Track my order</h3>
                  <p className="mt-2 text-sm leading-6 text-white/62">Please provide your information.</p>
                </div>

                <div className="grid gap-3">
                  <input
                    required
                    value={orderNumber}
                    onChange={(event) => setOrderNumber(event.target.value)}
                    className="rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-white/32 focus:border-cyan-300/55"
                    placeholder="Order number"
                  />
                  <input
                    required
                    type="email"
                    value={orderEmail}
                    onChange={(event) => setOrderEmail(event.target.value)}
                    className="rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-white/32 focus:border-cyan-300/55"
                    placeholder="Email address"
                  />
                </div>

                {error && (
                  <div className="rounded-xl border border-red-300/20 bg-red-300/[0.06] p-3 text-sm text-red-100">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={orderLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-200/20 bg-cyan-300/[0.10] px-3.5 py-3 text-sm font-medium text-cyan-50 transition hover:border-cyan-200/40 hover:bg-cyan-300/[0.14] disabled:cursor-wait disabled:opacity-70"
                >
                  {orderLoading ? 'Checking order' : 'Track my order'}
                  {orderLoading ? <Loader2 size={15} className="animate-spin" /> : <ClipboardList size={15} />}
                </button>
              </form>
            )}

            {view === 'orderResult' && (
              <div className="space-y-4 p-4">
                <div className="rounded-2xl border border-cyan-200/20 bg-cyan-300/[0.08] p-4">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-200/20 bg-cyan-300/[0.12] text-cyan-100">
                    <CheckCircle2 size={20} />
                  </div>
                  <h3 className="text-lg font-medium text-white">
                    {orderResult?.found ? 'Order found' : 'Order not found'}
                  </h3>
                  <p className="mt-3 whitespace-pre-line text-sm leading-6 text-white/68">
                    {orderResult ? orderSummary(orderResult) : ''}
                  </p>
                </div>
                {orderResult?.order?.statusUrl && (
                  <a
                    href={orderResult.order.statusUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center justify-center rounded-xl border border-cyan-200/20 bg-cyan-300/[0.10] px-3.5 py-3 text-sm font-medium text-cyan-50 transition hover:border-cyan-200/40 hover:bg-cyan-300/[0.14]"
                  >
                    View order status
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setView('message')}
                  className="flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-3 text-sm text-white/72 transition hover:border-cyan-200/30 hover:bg-white/[0.07] hover:text-white"
                >
                  Return to chat
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
          aria-label="Chat with us"
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
            <span className="block text-xs font-medium leading-none text-white">Chat with us</span>
            <span className="mt-1 block text-[11px] leading-none text-cyan-100/65">Support team</span>
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
