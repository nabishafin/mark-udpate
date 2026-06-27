import React, { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Lock, ShieldCheck } from 'lucide-react';
import { formatMoney, getCartItems, hydrateCartItemsWithProducts } from '../lib/cart';
import { PRODUCTS } from '../lib/products';
import {
  CheckoutAddress,
  CheckoutCart,
  DeliveryOption,
  createCheckoutCart,
  selectCartDeliveryOption,
  updateCartBuyerIdentity,
} from '../lib/checkout';
import { buildShopifyCheckoutUrl, forceShopifyCheckoutDomain } from '../lib/shopify';

type Step = 'information' | 'shipping' | 'review';

const US_STATES: [string, string][] = [
  ['AL', 'Alabama'], ['AK', 'Alaska'], ['AZ', 'Arizona'], ['AR', 'Arkansas'],
  ['CA', 'California'], ['CO', 'Colorado'], ['CT', 'Connecticut'], ['DE', 'Delaware'],
  ['FL', 'Florida'], ['GA', 'Georgia'], ['HI', 'Hawaii'], ['ID', 'Idaho'],
  ['IL', 'Illinois'], ['IN', 'Indiana'], ['IA', 'Iowa'], ['KS', 'Kansas'],
  ['KY', 'Kentucky'], ['LA', 'Louisiana'], ['ME', 'Maine'], ['MD', 'Maryland'],
  ['MA', 'Massachusetts'], ['MI', 'Michigan'], ['MN', 'Minnesota'], ['MS', 'Mississippi'],
  ['MO', 'Missouri'], ['MT', 'Montana'], ['NE', 'Nebraska'], ['NV', 'Nevada'],
  ['NH', 'New Hampshire'], ['NJ', 'New Jersey'], ['NM', 'New Mexico'], ['NY', 'New York'],
  ['NC', 'North Carolina'], ['ND', 'North Dakota'], ['OH', 'Ohio'], ['OK', 'Oklahoma'],
  ['OR', 'Oregon'], ['PA', 'Pennsylvania'], ['RI', 'Rhode Island'], ['SC', 'South Carolina'],
  ['SD', 'South Dakota'], ['TN', 'Tennessee'], ['TX', 'Texas'], ['UT', 'Utah'],
  ['VT', 'Vermont'], ['VA', 'Virginia'], ['WA', 'Washington'], ['WV', 'West Virginia'],
  ['WI', 'Wisconsin'], ['WY', 'Wyoming'],
];

const COUNTRIES = [
  { code: 'US', label: 'United States' },
  { code: 'CA', label: 'Canada' },
  { code: 'GB', label: 'United Kingdom' },
  { code: 'AU', label: 'Australia' },
];

type FormState = CheckoutAddress & { email: string };

const EMPTY_FORM: FormState = {
  email: '',
  firstName: '',
  lastName: '',
  address1: '',
  address2: '',
  city: '',
  province: '',
  zip: '',
  country: 'US',
  phone: '',
};

export function CheckoutPage() {
  const cartItems = useMemo(() => getCartItems(), []);
  const hydratedItems = useMemo(() => hydrateCartItemsWithProducts(cartItems, PRODUCTS), [cartItems]);
  const subtotalCents = useMemo(() => hydratedItems.reduce((t, i) => t + i.lineTotalCents, 0), [hydratedItems]);

  const [step, setStep] = useState<Step>('information');
  const [shopifyCart, setShopifyCart] = useState<CheckoutCart | null>(null);
  const [cartLoading, setCartLoading] = useState(true);
  const [cartError, setCartError] = useState('');

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [selectedHandle, setSelectedHandle] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [stepError, setStepError] = useState('');

  const hasDeliveryOptions = useRef(false);

  useEffect(() => {
    if (!hydratedItems.length) { setCartLoading(false); return; }

    const lines = hydratedItems
      .filter((i) => i.product.variantId)
      .map((i) => ({
        variantId: i.product.variantId!,
        quantity: i.quantity,
        sellingPlanId: i.purchaseOption === 'subscription' ? i.sellingPlanId : undefined,
        purchaseOption: i.purchaseOption,
      }));

    createCheckoutCart(lines)
      .then((cart) => setShopifyCart(cart))
      .catch((err) => setCartError(err.message))
      .finally(() => setCartLoading(false));
  }, []);

  const allDeliveryOptions: (DeliveryOption & { groupId: string })[] = (shopifyCart?.deliveryGroups ?? []).flatMap(
    (g) => g.deliveryOptions.map((o) => ({ ...o, groupId: g.id })),
  );

  const selectedOption = allDeliveryOptions.find((o) => o.handle === selectedHandle) ?? null;
  const checkoutItems = hydratedItems.map((item) => ({
    variantId: item.product.variantId,
    quantity: item.quantity,
    sellingPlanId: item.purchaseOption === 'subscription' ? item.sellingPlanId : undefined,
    purchaseOption: item.purchaseOption,
  }));
  const canPay = checkoutItems.length > 0 && checkoutItems.every((item) => Boolean(item.variantId));

  const totalFromShopify = shopifyCart?.cost?.totalAmount;
  const totalDisplay = totalFromShopify
    ? `$${parseFloat(totalFromShopify.amount).toFixed(2)} ${totalFromShopify.currencyCode}`
    : formatMoney(subtotalCents);

  const countryLabel = COUNTRIES.find((c) => c.code === form.country)?.label ?? form.country;

  const setField = <K extends keyof FormState>(key: K) =>
    (val: string) => setForm((f) => ({ ...f, [key]: val }));

  const visibleSteps: Step[] = hasDeliveryOptions.current
    ? ['information', 'shipping', 'review']
    : ['information', 'review'];

  const stepIndex = visibleSteps.indexOf(step);

  const handleInfoSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!shopifyCart) return;
    setSubmitting(true);
    setStepError('');

    try {
      const { email, ...address } = form;
      const updated = await updateCartBuyerIdentity(shopifyCart.id, email, address);
      setShopifyCart(updated);

      const opts = (updated.deliveryGroups ?? []).flatMap((g) => g.deliveryOptions);
      if (opts.length > 0) {
        hasDeliveryOptions.current = true;
        const firstGroup = updated.deliveryGroups.find((g) => g.deliveryOptions.length > 0)!;
        setSelectedGroupId(firstGroup.id);
        setSelectedHandle(firstGroup.deliveryOptions[0].handle);
        setStep('shipping');
      } else {
        hasDeliveryOptions.current = false;
        setStep('review');
      }
    } catch (err) {
      setStepError(err instanceof Error ? err.message : 'Failed to save information. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleShippingSubmit = async () => {
    if (!shopifyCart || !selectedHandle || !selectedGroupId) return;
    setSubmitting(true);
    setStepError('');

    try {
      const updated = await selectCartDeliveryOption(shopifyCart.id, selectedGroupId, selectedHandle);
      setShopifyCart(updated);
      setStep('review');
    } catch (err) {
      setStepError(err instanceof Error ? err.message : 'Failed to select shipping. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePayment = () => {
    if (!canPay) return;
    // Hand off to Shopify's hosted checkout on the myshopify domain
    // (e.g. https://orise-6796.myshopify.com/cart/c/TOKEN?key=...). This is the
    // standard, always-works payment page — no domain proxy required.
    let target: string;
    try {
      target = buildShopifyCheckoutUrl(checkoutItems, 'local_checkout_payment');
    } catch {
      if (!shopifyCart?.checkoutUrl) return;
      target = forceShopifyCheckoutDomain(shopifyCart.checkoutUrl);
    }
    window.location.href = target;
  };

  if (!cartLoading && !hydratedItems.length) {
    return (
      <section className="hpe-section min-h-screen pt-32">
        <div className="mx-auto max-w-lg px-6 text-center">
          <h1 className="text-3xl font-medium text-white">Your cart is empty</h1>
          <p className="mt-3 text-sm text-white/55">Add products before checking out.</p>
          <a href="/products" className="hpe-btn-primary mt-8 inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-medium">
            Browse products <ArrowRight size={14} />
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen overflow-hidden pb-24 pt-20">
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">

        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <a
            href="/products/cart"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition hover:border-white/20 hover:text-white"
          >
            <ArrowLeft size={16} />
          </a>
          <div>
            <div className="hpe-hud-label mb-0.5">Secure Checkout</div>
            <h1 className="text-xl font-medium text-white sm:text-2xl">Complete Your Order</h1>
          </div>
          <div className="ml-auto flex items-center gap-1.5 text-xs text-white/35">
            <Lock size={11} />
            <span className="hidden sm:inline">SSL secured</span>
          </div>
        </div>

        {/* Step progress */}
        <nav className="mb-10" aria-label="Checkout steps">
          <ol className="flex items-center">
            {visibleSteps.map((s, i) => {
              const done = i < stepIndex;
              const active = s === step;
              const labels: Record<Step, string> = { information: 'Information', shipping: 'Shipping', review: 'Payment' };
              return (
                <React.Fragment key={s}>
                  <li className={`flex items-center gap-2 transition ${active ? 'text-cyan-300' : done ? 'text-cyan-300/50' : 'text-white/25'}`}>
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-mono transition ${
                      done ? 'border-cyan-300/30 bg-cyan-300/10' :
                      active ? 'border-cyan-300 bg-cyan-300/15 shadow-[0_0_12px_rgba(63,184,255,0.3)]' :
                      'border-white/12 bg-white/[0.04]'
                    }`}>
                      {done ? <Check size={11} /> : i + 1}
                    </span>
                    <span className="hidden text-xs font-medium sm:inline">{labels[s]}</span>
                  </li>
                  {i < visibleSteps.length - 1 && (
                    <li className="mx-3 h-px flex-1 bg-white/10" />
                  )}
                </React.Fragment>
              );
            })}
          </ol>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px]">

          {/* ── Main panel ── */}
          <div className="min-w-0">

            {cartLoading && (
              <div className="hpe-glass flex flex-col items-center justify-center gap-4 rounded-2xl p-12 text-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-cyan-300" />
                <p className="text-sm text-white/50">Initializing secure checkout…</p>
              </div>
            )}

            {cartError && (
              <div className="rounded-xl border border-red-300/25 bg-red-300/[0.06] p-4">
                <p className="text-sm text-red-200">{cartError}</p>
                <a href="/products/cart" className="mt-2 inline-block text-xs text-red-300/70 underline hover:text-red-200">
                  Return to cart
                </a>
              </div>
            )}

            {!cartLoading && !cartError && (
              <AnimatePresence mode="wait">

                {/* ── Step 1: Information ── */}
                {step === 'information' && (
                  <motion.div key="information" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.22 }}>
                    <form onSubmit={handleInfoSubmit} noValidate className="space-y-5">

                      {/* Contact */}
                      <div className="hpe-glass rounded-2xl p-5 sm:p-6">
                        <h2 className="mb-4 text-sm font-medium uppercase tracking-widest text-white/50">Contact</h2>
                        <Field label="Email address" type="email" value={form.email} onChange={setField('email')} placeholder="you@example.com" required />
                        <Field label="Phone (optional)" type="tel" value={form.phone} onChange={setField('phone')} placeholder="+1 (555) 000-0000" className="mt-4" />
                      </div>

                      {/* Shipping address */}
                      <div className="hpe-glass rounded-2xl p-5 sm:p-6">
                        <h2 className="mb-4 text-sm font-medium uppercase tracking-widest text-white/50">Shipping Address</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <Field label="First name" value={form.firstName} onChange={setField('firstName')} required />
                          <Field label="Last name" value={form.lastName} onChange={setField('lastName')} required />
                        </div>
                        <Field label="Address" value={form.address1} onChange={setField('address1')} placeholder="123 Main St" className="mt-4" required />
                        <Field label="Apartment, suite, etc. (optional)" value={form.address2} onChange={setField('address2')} placeholder="Apt 4B" className="mt-4" />
                        <div className="mt-4 grid gap-4 sm:grid-cols-3">
                          <Field label="City" value={form.city} onChange={setField('city')} required />
                          <Select
                            label="State"
                            value={form.province}
                            onChange={setField('province')}
                            options={US_STATES.map(([v, l]) => ({ value: v, label: l }))}
                            placeholder="State"
                            required
                          />
                          <Field label="ZIP code" value={form.zip} onChange={setField('zip')} placeholder="10001" required />
                        </div>
                        <Select
                          label="Country"
                          value={form.country}
                          onChange={setField('country')}
                          options={COUNTRIES.map((c) => ({ value: c.code, label: c.label }))}
                          className="mt-4"
                          required
                        />
                      </div>

                      {stepError && <ErrorBanner message={stepError} />}

                      <button
                        type="submit"
                        disabled={submitting}
                        className="hpe-btn-primary flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-sm font-medium tracking-wide disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {submitting ? <Spinner label="Saving…" /> : <>Continue to {hasDeliveryOptions.current ? 'shipping' : 'payment'} <ArrowRight size={14} /></>}
                      </button>
                    </form>
                  </motion.div>
                )}

                {/* ── Step 2: Shipping ── */}
                {step === 'shipping' && (
                  <motion.div key="shipping" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.22 }}>
                    <div className="hpe-glass rounded-2xl p-5 sm:p-6">
                      <h2 className="mb-5 text-sm font-medium uppercase tracking-widest text-white/50">Shipping Method</h2>

                      {allDeliveryOptions.length === 0 ? (
                        <p className="text-sm text-white/50">No shipping methods available for this address.</p>
                      ) : (
                        <div className="space-y-3">
                          {allDeliveryOptions.map((opt) => {
                            const active = selectedHandle === opt.handle;
                            const free = parseFloat(opt.estimatedCost.amount) === 0;
                            return (
                              <label
                                key={opt.handle}
                                className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition ${
                                  active ? 'border-cyan-300/50 bg-cyan-300/[0.07]' : 'border-white/10 bg-white/[0.03] hover:border-white/18'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="shipping"
                                  value={opt.handle}
                                  checked={active}
                                  onChange={() => { setSelectedHandle(opt.handle); setSelectedGroupId(opt.groupId); }}
                                  className="sr-only"
                                />
                                <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition ${active ? 'border-cyan-300' : 'border-white/30'}`}>
                                  {active && <span className="h-2 w-2 rounded-full bg-cyan-300" />}
                                </span>
                                <span className="flex-1">
                                  <span className="block text-sm font-medium text-white">{opt.title}</span>
                                </span>
                                <span className={`shrink-0 font-mono text-sm ${free ? 'text-cyan-300' : 'text-white/80'}`}>
                                  {free ? 'Free' : `$${parseFloat(opt.estimatedCost.amount).toFixed(2)}`}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {stepError && <ErrorBanner message={stepError} className="mt-4" />}

                    <div className="mt-5 flex gap-3">
                      <BackButton onClick={() => setStep('information')} />
                      <button
                        type="button"
                        onClick={handleShippingSubmit}
                        disabled={!selectedHandle || submitting}
                        className="hpe-btn-primary flex flex-1 items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {submitting ? <Spinner label="Saving…" /> : <>Continue to payment <ArrowRight size={14} /></>}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ── Step 3: Review & Pay ── */}
                {step === 'review' && (
                  <motion.div key="review" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.22 }}>

                    {/* Summary of entered info */}
                    <div className="hpe-glass divide-y divide-white/[0.07] rounded-2xl">
                      <ReviewRow label="Contact" onEdit={() => setStep('information')}>
                        <span className="text-sm text-white/70">{form.email}</span>
                        {form.phone && <span className="mt-0.5 block text-xs text-white/40">{form.phone}</span>}
                      </ReviewRow>

                      <ReviewRow label="Ship to" onEdit={() => setStep('information')}>
                        <span className="text-sm text-white/70">
                          {form.firstName} {form.lastName}<br />
                          {form.address1}{form.address2 ? `, ${form.address2}` : ''}<br />
                          {form.city}, {form.province} {form.zip} · {countryLabel}
                        </span>
                      </ReviewRow>

                      {selectedOption && (
                        <ReviewRow label="Shipping" onEdit={() => setStep('shipping')}>
                          <span className="text-sm text-white/70">
                            {selectedOption.title}
                            <span className="ml-2 font-mono text-white/50">
                              {parseFloat(selectedOption.estimatedCost.amount) === 0
                                ? '(Free)'
                                : `($${parseFloat(selectedOption.estimatedCost.amount).toFixed(2)})`}
                            </span>
                          </span>
                        </ReviewRow>
                      )}
                    </div>

                    {/* Payment trust notice */}
                    <div className="mt-5 rounded-xl border border-cyan-300/12 bg-cyan-300/[0.04] p-4">
                      <div className="flex items-start gap-3">
                        <Lock size={14} className="mt-0.5 shrink-0 text-cyan-300/60" />
                        <div>
                          <p className="text-xs font-medium text-white/80">Payment processed securely by Shopify</p>
                          <p className="mt-1 text-xs leading-relaxed text-white/45">
                            All major credit cards, Shop Pay, PayPal, and Apple Pay accepted. Your card details are never stored on our servers.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Accepted payment icons */}
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      {['Visa', 'MC', 'Amex', 'PayPal', 'Shop Pay'].map((brand) => (
                        <span key={brand} className="rounded border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[10px] font-medium tracking-wide text-white/45">
                          {brand}
                        </span>
                      ))}
                    </div>

                    <div className="mt-6 flex gap-3">
                      <BackButton onClick={() => setStep(hasDeliveryOptions.current ? 'shipping' : 'information')} />
                      <button
                        type="button"
                        onClick={handlePayment}
                        disabled={!canPay}
                        className="hpe-btn-primary flex flex-1 items-center justify-center gap-2 rounded-xl px-6 py-4 text-sm font-semibold tracking-wide disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Lock size={13} />
                        Pay now · {totalDisplay}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>

          {/* ── Order summary sidebar ── */}
          <motion.aside
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="hpe-glass self-start rounded-2xl p-5 sm:sticky sm:top-24 sm:p-6"
          >
            <div className="hpe-hud-label mb-4">Order Summary</div>

            <ul className="space-y-4">
              {hydratedItems.map((item) => (
                <li key={item.productId} className="flex gap-3">
                  <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]">
                    <img
                      src={item.product.image.src}
                      alt={item.product.image.alt}
                      className="h-full w-full object-contain p-1.5"
                    />
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-cyan-300/20 text-[10px] font-medium text-cyan-100">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">{item.product.name}</p>
                    <p className="mt-0.5 text-[11px] text-white/45">
                      {item.purchaseOption === 'subscription' ? 'Subscription' : 'One-time purchase'}
                    </p>
                  </div>
                  <div className="shrink-0 font-mono text-sm text-white/75">
                    {formatMoney(item.lineTotalCents)}
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-5 space-y-2.5 border-t border-white/[0.08] pt-4 text-sm">
              <div className="flex justify-between text-white/55">
                <span>Subtotal</span>
                <span className="font-mono text-white">{formatMoney(subtotalCents)}</span>
              </div>
              {selectedOption && (
                <div className="flex justify-between text-white/55">
                  <span>Shipping</span>
                  <span className="font-mono">
                    {parseFloat(selectedOption.estimatedCost.amount) === 0
                      ? <span className="text-cyan-300">Free</span>
                      : `$${parseFloat(selectedOption.estimatedCost.amount).toFixed(2)}`}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-white/40">
                <span>Taxes</span>
                <span className="font-mono text-white/30 text-xs">Calc. at payment</span>
              </div>
            </div>

            <div className="mt-4 flex justify-between border-t border-white/[0.08] pt-4 text-base font-medium text-white">
              <span>Estimated total</span>
              <span className="font-mono">{totalDisplay}</span>
            </div>

            <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-white/30">
              <ShieldCheck size={11} />
              <span>SSL secured · Powered by Shopify</span>
            </div>
          </motion.aside>

        </div>
      </div>
    </section>
  );
}

/* ── Small shared sub-components ── */

function Field({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
  className = '',
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-[11px] text-white/45">
        {label}{required ? ' *' : ''}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none transition focus:border-cyan-300/45 focus:ring-1 focus:ring-cyan-300/20"
      />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select…',
  required,
  className = '',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-[11px] text-white/45">
        {label}{required ? ' *' : ''}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full rounded-xl border border-white/10 bg-[#07090d] px-4 py-2.5 text-sm text-white outline-none transition focus:border-cyan-300/45 focus:ring-1 focus:ring-cyan-300/20"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

function ReviewRow({
  label,
  onEdit,
  children,
}: {
  label: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 px-5 py-4 sm:px-6">
      <div className="flex-1 min-w-0">
        <p className="mb-1.5 text-[10px] font-medium uppercase tracking-widest text-white/30">{label}</p>
        {children}
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="shrink-0 text-xs text-cyan-300/60 underline underline-offset-4 transition hover:text-cyan-300"
      >
        Edit
      </button>
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3.5 text-sm text-white/60 transition hover:border-white/20 hover:text-white"
    >
      <ArrowLeft size={14} />
      <span className="hidden sm:inline">Back</span>
    </button>
  );
}

function Spinner({ label }: { label: string }) {
  return (
    <span className="flex items-center gap-2">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current/25 border-t-current" />
      {label}
    </span>
  );
}

function ErrorBanner({ message, className = '' }: { message: string; className?: string }) {
  return (
    <div className={`rounded-xl border border-red-300/20 bg-red-300/[0.06] p-3 text-xs leading-relaxed text-red-200 ${className}`}>
      {message}
    </div>
  );
}
