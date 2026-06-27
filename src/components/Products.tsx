import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Check, Droplets, FlaskConical, Loader2, Package, Plus, ShieldCheck, ShoppingCart, Sparkles, Star, Timer, Zap } from 'lucide-react';
import { addCartItem, getCartCount, onCartChange } from '../lib/cart';
import { PRODUCTS, Product, getLiveProducts } from '../lib/products';
import { trackCommerceEvent } from '../lib/tracking';

export function Products() {
  const [cartCount, setCartCount] = useState(() => getCartCount());
  const [products, setProducts] = useState<Product[]>(PRODUCTS);

  useEffect(() => {
    const controller = new AbortController();
    getLiveProducts(controller.signal)
      .then(setProducts)
      .catch(() => setProducts(PRODUCTS));

    return () => controller.abort();
  }, []);

  useEffect(() => {
    products.forEach((product) => {
      trackCommerceEvent('product_viewed', {
        productId: product.id,
        productName: product.name,
        value: product.price,
        variantId: product.variantId,
        checkoutReady: Boolean(product.variantId),
      });
    });

    return onCartChange(() => setCartCount(getCartCount()));
  }, [products]);

  return (
    <section id="products" className="hpe-section relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-3xl">
            <div className="hpe-hud-label mb-3" style={{ color: '#F0D27A' }}>
              Shop
            </div>
            <h2 className="text-3xl sm:text-5xl font-medium text-white tracking-tight leading-[1.05]">
              <span className="hpe-text-chrome">One verified concentration.</span>
              <br />
              <span className="text-white/80">Two packaging options.</span>
            </h2>
            <p className="mt-5 text-white/60 text-base sm:text-lg leading-relaxed">
              Mdrn-Life DDW is offered at 5 ppm in Glass and PET Plastic bottles.
              Every product mention points back to the same{' '}
              <a href="/science/lab-testing" className="text-cyan-200 underline decoration-cyan-300/40 underline-offset-4 hover:text-white">
                independently verified
              </a>{' '}
              DDW standard.
            </p>
          </div>

          <a
            href="/products/cart"
            aria-label={`Open cart with ${cartCount} items`}
            className="hpe-glass relative inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white/80 transition hover:text-white"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full border border-cyan-200/50 bg-cyan-300 px-1.5 text-xs font-semibold text-[#041017]">
                {cartCount}
              </span>
            )}
          </a>
        </motion.div>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {products.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              delay={i * 0.1}
              onCartCountChange={() => setCartCount(getCartCount())}
            />
          ))}
        </div>
        <BottleFormatGuide />
        <UsageGuide />
        <DilutionGuide />
        <SubscriptionPerks />
        <TrustSignals />
        <LabTestingCallout />
      </div>
    </section>
  );
}

function ProductCard({
  product,
  delay,
  onCartCountChange,
}: {
  product: Product;
  delay: number;
  onCartCountChange: () => void;
}) {
  const [adding, setAdding] = useState(false);
  const [purchaseOption, setPurchaseOption] = useState<'subscription' | 'one-time'>('subscription');
  const [selectedPlanId, setSelectedPlanId] = useState<string>(product.subscription.plans[0]?.id ?? '');
  const isGold = product.accent === 'gold';

  const selectedPlan = product.subscription.plans.find((p) => p.id === selectedPlanId) ?? product.subscription.plans[0];
  const displayPrice = purchaseOption === 'subscription' ? (selectedPlan?.price ?? product.subscription.price) : product.price;
  const soldOut = product.availableForSale === false;

  const handleAddToCart = () => {
    if (adding || soldOut) return;
    setAdding(true);
    const planId = purchaseOption === 'subscription' ? selectedPlan?.sellingPlanId : undefined;
    addCartItem(product.id, 1, purchaseOption, planId);
    onCartCountChange();
    trackCommerceEvent('added_to_cart', {
      productId: product.id,
      productName: product.name,
      value: product.price,
      variantId: product.variantId,
      checkoutReady: Boolean(product.variantId),
      purchaseOption,
    });
    if (purchaseOption === 'subscription') {
      trackCommerceEvent('subscription_started_intent', {
        productId: product.id,
        productName: product.name,
        sellingPlanId: planId,
      });
    }

    window.setTimeout(() => {
      window.history.pushState({}, '', '/products/cart');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }, 650);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay }}
      whileHover={{ y: -6 }}
      className="hpe-glass rounded-2xl p-6 sm:p-7 relative overflow-hidden flex flex-col"
      style={
        isGold
          ? {
              borderColor: 'rgba(229,194,90,0.35)',
              boxShadow: '0 30px 80px -30px rgba(229,194,90,0.4)',
            }
          : {
              boxShadow: '0 30px 80px -30px rgba(63,184,255,0.3)',
            }
      }
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isGold
            ? 'radial-gradient(circle at 50% 0%, rgba(229,194,90,0.18), transparent 60%)'
            : 'radial-gradient(circle at 50% 0%, rgba(63,184,255,0.12), transparent 60%)',
        }}
      />

      <div className="relative mb-5 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
        <img
          src={product.image.src}
          alt={product.image.alt}
          loading="lazy"
          decoding="async"
          className="aspect-[16/11] w-full bg-white object-contain p-3 sm:p-4"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050608]/55 via-transparent to-transparent" />
      </div>

      <div className="relative flex flex-1 flex-col">
        <div className="mb-2 flex items-center gap-2">
          {isGold && <Sparkles size={12} className="text-amber-300" />}
          <div className="hpe-hud-label" style={{ color: isGold ? '#F0D27A' : '#3FB8FF' }}>
            {product.badge}
          </div>
        </div>
        <h3 className="text-2xl font-medium tracking-tight text-white">{product.name}</h3>
        <p className="mt-1 text-sm text-white/55">{product.tagline}</p>

        <p className="mt-4 flex-1 text-sm leading-relaxed text-white/65">{product.description}</p>

        <div className="mt-5 space-y-1.5">
          {product.spec.map((s) => (
            <div key={s.k} className="flex items-center justify-between text-xs">
              <span className="text-white/45">{s.k}</span>
              <span className="font-mono text-white/80">{s.v}</span>
            </div>
          ))}
        </div>

        <fieldset className="mt-6 space-y-2">
          <legend className="hpe-hud-label mb-3" style={{ fontSize: 9 }}>Purchase option</legend>
          <label className={`block cursor-pointer rounded-xl border p-4 transition ${purchaseOption === 'subscription' ? 'border-cyan-300/45 bg-cyan-300/[0.08]' : 'border-white/10 bg-white/[0.02] hover:border-white/20'}`}>
            <input
              type="radio"
              name={`purchase-option-${product.id}`}
              value="subscription"
              checked={purchaseOption === 'subscription'}
              onChange={() => setPurchaseOption('subscription')}
              className="sr-only"
            />
            <span className="flex items-start justify-between gap-4">
              <span>
                <span className="block text-sm font-medium text-white">{product.subscription.label}</span>
                <span className="mt-1 block text-xs text-white/52">Skip or cancel anytime</span>
              </span>
              <span className="rounded-full border border-cyan-200/35 bg-cyan-200/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-cyan-100">{product.subscription.discount}</span>
            </span>
          </label>

          {purchaseOption === 'subscription' && (
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
              <div className="hpe-hud-label mb-2.5" style={{ fontSize: 9 }}>Delivery frequency</div>
              <div className="space-y-2">
                {product.subscription.plans.map((plan) => (
                  <label
                    key={plan.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition ${selectedPlanId === plan.id ? 'border-cyan-300/40 bg-cyan-300/[0.07]' : 'border-white/8 hover:border-white/18'}`}
                  >
                    <input
                      type="radio"
                      name={`plan-${product.id}`}
                      value={plan.id}
                      checked={selectedPlanId === plan.id}
                      onChange={() => setSelectedPlanId(plan.id)}
                      className="sr-only"
                    />
                    <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${selectedPlanId === plan.id ? 'border-cyan-300 bg-cyan-300' : 'border-white/30'}`}>
                      {selectedPlanId === plan.id && <span className="h-1.5 w-1.5 rounded-full bg-[#050608]" />}
                    </span>
                    <span className="flex-1">
                      <span className="block text-xs font-medium text-white">{plan.frequency}</span>
                      <span className="mt-0.5 block text-[11px] leading-snug text-white/50">{plan.useCase}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <label className={`block cursor-pointer rounded-xl border p-4 transition ${purchaseOption === 'one-time' ? 'border-cyan-300/45 bg-cyan-300/[0.08]' : 'border-white/10 bg-white/[0.02] hover:border-white/20'}`}>
            <input
              type="radio"
              name={`purchase-option-${product.id}`}
              value="one-time"
              checked={purchaseOption === 'one-time'}
              onChange={() => setPurchaseOption('one-time')}
              className="sr-only"
            />
            <span className="flex items-center justify-between gap-4 text-sm">
              <span className="font-medium text-white">One-time purchase</span>
              <span className="font-mono text-white/70">{product.price}</span>
            </span>
          </label>
        </fieldset>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="hpe-hud-label" style={{ fontSize: 9 }}>
              Price
            </div>
            <div className="mt-1 font-mono text-2xl leading-none text-white">
              {displayPrice}
              <span className="ml-2 text-xs text-white/40">/ {product.volume}</span>
            </div>
            {purchaseOption === 'subscription' && <div className="mt-2 text-xs text-cyan-100/65">Recurring every 4 weeks</div>}
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={adding || soldOut}
          className={`${isGold ? 'hpe-btn-ghost' : 'hpe-btn-primary'} mt-5 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium tracking-wide disabled:cursor-wait disabled:opacity-80`}
        >
          {soldOut ? (
            <>
              <ShoppingCart size={14} />
              Sold out
            </>
          ) : adding ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Adding
            </>
          ) : (
            <>
              <Plus size={14} />
              {purchaseOption === 'subscription' ? 'Subscribe & Add to Cart' : 'Add to Cart'}
            </>
          )}
        </button>

        {adding && (
          <div className="mt-4 flex items-center gap-2 text-xs text-cyan-100/80">
            {[1, 2, 3].map((step) => (
              <span
                key={step}
                className="flex h-6 w-6 items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-300/10 font-mono"
              >
                {step}
              </span>
            ))}
            <span className="inline-flex items-center gap-1">
              <Check size={12} />
              Opening cart
            </span>
          </div>
        )}
      </div>
    </motion.article>
  );
}

function BottleFormatGuide() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7 }}
      className="mt-16"
    >
      <div className="hpe-hud-label mb-4">Bottle Format Guide</div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-amber-300/18 bg-white/[0.03] p-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-300/25 bg-amber-300/[0.08] text-amber-200">
              <FlaskConical size={16} />
            </span>
            <div>
              <div className="hpe-hud-label" style={{ color: '#F0D27A', fontSize: 9 }}>Premium Format</div>
              <h3 className="text-base font-medium text-white">Why Glass Bottles</h3>
            </div>
          </div>
          <ul className="space-y-2">
            {[
              'Zero chemical migration into the water',
              'Preserves molecular integrity over time',
              'No plastic taste or odor interference',
              'Fully recyclable and reusable packaging',
              'Ideal for home, desk, and daily rituals',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs leading-relaxed text-white/62">
                <Check size={11} className="mt-0.5 shrink-0 text-amber-300/70" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/25 bg-cyan-300/[0.07] text-cyan-200">
              <Package size={16} />
            </span>
            <div>
              <div className="hpe-hud-label" style={{ fontSize: 9 }}>Active Format</div>
              <h3 className="text-base font-medium text-white">Why PET Bottles</h3>
            </div>
          </div>
          <ul className="space-y-2">
            {[
              'Lightweight for travel, gym, and commutes',
              'BPA-free food-grade PET construction',
              'Shatter-resistant for active lifestyles',
              'Same independently verified 5 ppm DDW',
              'Ideal for training sessions and on-the-go use',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs leading-relaxed text-white/62">
                <Check size={11} className="mt-0.5 shrink-0 text-cyan-300/70" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

function UsageGuide() {
  const steps = [
    { icon: Timer, time: 'Morning', title: 'Start with DDW', body: 'Begin the day with 500 ml of Mdrn-Life DDW before breakfast. Many incorporate it as part of their morning hydration ritual.' },
    { icon: Zap, time: 'Training', title: 'Pre and intra-workout', body: 'Consume DDW before and during training sessions. Cellular hydration supports the body\'s energy systems during physical activity.' },
    { icon: Droplets, time: 'Throughout', title: 'Consistent intake', body: 'Aim for 1–2 liters per day, adjusted for body weight, activity level, and individual preference.' },
    { icon: Calendar, time: 'Protocol', title: 'Gradual introduction', body: 'Those new to DDW commonly begin with a mixed protocol — blending DDW with filtered water — before transitioning to undiluted 5 ppm.' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7 }}
      className="mt-10"
    >
      <div className="hpe-hud-label mb-4">Daily Usage Guide</div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <motion.div
            key={step.time}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: i * 0.07 }}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
          >
            <div className="mb-3 flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-300/20 bg-cyan-300/[0.07] text-cyan-200">
                <step.icon size={14} />
              </span>
              <div className="hpe-hud-label" style={{ fontSize: 8 }}>{step.time}</div>
            </div>
            <h3 className="text-sm font-medium text-white">{step.title}</h3>
            <p className="mt-2 text-xs leading-relaxed text-white/52">{step.body}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function DilutionGuide() {
  const levels = [
    { label: 'Introductory', ratio: '1:3 DDW to filtered water', ppm: '≈ 37–40 ppm', desc: 'A common starting point for those new to DDW. Allows the body to gradually acclimate to lower deuterium levels.' },
    { label: 'Intermediate', ratio: '1:1 DDW to filtered water', ppm: '≈ 75–80 ppm', desc: 'A transitional protocol often used after several weeks of introductory dilution.' },
    { label: 'Advanced', ratio: 'Undiluted DDW', ppm: '5 ppm verified', desc: 'Full-strength Mdrn-Life DDW. The target for those following a dedicated protocol.' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7 }}
      className="mt-10"
    >
      <div className="hpe-hud-label mb-4">Dilution Guide</div>
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <p className="mb-5 text-sm leading-relaxed text-white/62">
          Many researchers and practitioners introduce DDW gradually. Use filtered water for dilution — not tap water — to maintain water quality.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {levels.map((level, i) => (
            <div key={level.label} className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
              <div className="hpe-hud-label mb-2" style={{ fontSize: 8 }}>Stage {i + 1}</div>
              <div className="text-sm font-medium text-white">{level.label}</div>
              <div className="mt-2 font-mono text-xs text-white/70">{level.ratio}</div>
              <div className="mt-1 font-mono text-xs text-cyan-300/80">{level.ppm}</div>
              <p className="mt-3 text-xs leading-relaxed text-white/48">{level.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function SubscriptionPerks() {
  const perks = [
    { icon: Calendar, title: 'Consistent supply', body: 'Set your delivery frequency and never run out. Choose monthly or bi-monthly based on your protocol.' },
    { icon: ShieldCheck, title: 'Same verified standard', body: 'Every subscription shipment contains independently IRMS-verified 5 ppm DDW — the same standard as one-time orders.' },
    { icon: Zap, title: 'Skip or cancel anytime', body: 'No long-term commitment. Manage, pause, or cancel your subscription at any time without fees or penalties.' },
    { icon: Droplets, title: 'Protocol continuity', body: 'DDW protocols are typically ongoing. A subscription ensures your routine stays uninterrupted.' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7 }}
      className="mt-10"
    >
      <div className="hpe-hud-label mb-4">Subscription Benefits</div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {perks.map((perk, i) => (
          <motion.div
            key={perk.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: i * 0.07 }}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
          >
            <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-300/20 bg-cyan-300/[0.07] text-cyan-200">
              <perk.icon size={14} />
            </span>
            <h3 className="text-sm font-medium text-white">{perk.title}</h3>
            <p className="mt-2 text-xs leading-relaxed text-white/52">{perk.body}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function TrustSignals() {
  const reviews = [
    {
      initials: 'J.M.',
      location: 'Austin, TX',
      body: 'The lab testing transparency was what sold me. Being able to see IRMS verification from independent labs makes a real difference when buying a premium product like this.',
    },
    {
      initials: 'R.T.',
      location: 'New York, NY',
      body: 'I appreciate that Mdrn-Life publishes the actual batch results. The 5 ppm standard is clearly defined and the science is explained without exaggeration.',
    },
    {
      initials: 'S.K.',
      location: 'Los Angeles, CA',
      body: 'Three months on a consistent protocol. The glass bottle format is excellent — premium quality that matches the product inside. Subscription makes it easy to maintain.',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7 }}
      className="mt-10"
    >
      <div className="hpe-hud-label mb-4">Customer Reviews</div>
      <div className="grid gap-4 sm:grid-cols-3">
        {reviews.map((review) => (
          <div key={review.initials} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="mb-3 flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={12} className="fill-amber-300 text-amber-300" />
              ))}
            </div>
            <p className="text-sm leading-relaxed text-white/70">{review.body}</p>
            <div className="mt-4 flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-cyan-300/25 bg-cyan-300/[0.07] text-xs font-medium text-cyan-200">
                {review.initials.charAt(0)}
              </div>
              <div>
                <div className="text-xs font-medium text-white">{review.initials}</div>
                <div className="text-[10px] text-white/40">{review.location} · Verified Customer</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function LabTestingCallout() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7 }}
      className="mt-10 mb-4"
    >
      <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.04] p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-300/25 bg-cyan-300/[0.08] text-cyan-200">
            <ShieldCheck size={18} />
          </span>
          <div>
            <div className="hpe-hud-label mb-1">Independent Verification</div>
            <h3 className="text-base font-medium text-white">Every batch tested. Results available.</h3>
            <p className="mt-1 text-sm text-white/55 max-w-lg">
              IRMS-verified 5 ppm DDW with batch documentation from two independent labs.
            </p>
          </div>
        </div>
        <a
          href="/science/lab-testing"
          className="hpe-btn-ghost inline-flex shrink-0 items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium tracking-wide"
        >
          View Lab Results
          <ArrowRight size={13} />
        </a>
      </div>
    </motion.div>
  );
}
