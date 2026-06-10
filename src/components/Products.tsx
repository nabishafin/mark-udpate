import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Plus, RefreshCw, ShoppingCart, Sparkles } from 'lucide-react';
import { Particles } from './Particles';
import { getShopifyLinks, ShopifyProductConfig } from '../lib/shopify';
import { trackCommerceEvent } from '../lib/tracking';

type Product = ShopifyProductConfig & {
  id: string;
  badge: string;
  name: string;
  tagline: string;
  description: string;
  price: string;
  volume: string;
  spec: {
    k: string;
    v: string;
  }[];
  accent: 'blue' | 'gold';
};

const PRODUCTS: Product[] = [
  {
    id: 'glass',
    badge: '5 PPM - GLASS',
    name: 'Mdrn-Life DDW Glass',
    tagline: 'Premium glass bottles - verified 5 ppm',
    description:
      'The client-approved 5 ppm deuterium-depleted water format for buyers who prefer glass packaging and the most premium shelf presentation.',
    price: 'From $86.65',
    volume: 'Glass bottles',
    productUrl: 'https://mdrnlifeddw.com/products/mdrn-life-ddw',
    variantId: import.meta.env.VITE_SHOPIFY_GLASS_VARIANT_ID,
    subscriptionCheckoutUrl: import.meta.env.VITE_SHOPIFY_GLASS_SUBSCRIPTION_CHECKOUT_URL,
    spec: [
      { k: 'Deuterium', v: '5 ppm' },
      { k: 'Packaging', v: 'Glass' },
      { k: 'Verification', v: 'Independent labs' },
    ],
    accent: 'gold',
  },
  {
    id: 'pet',
    badge: '5 PPM - PET',
    name: 'Mdrn-Life DDW PET Plastic',
    tagline: 'Portable PET plastic bottles - verified 5 ppm',
    description:
      'The same single-concentration Mdrn-Life DDW in PET plastic bottles for convenience, shipping efficiency, and everyday protocol use.',
    price: 'From $80.65',
    volume: 'PET plastic bottles',
    productUrl: 'https://mdrnlifeddw.com/products/mdrn-life-ddw-pet-plastic?variant=41122368749602',
    variantId: import.meta.env.VITE_SHOPIFY_PET_VARIANT_ID || '41122368749602',
    subscriptionCheckoutUrl: import.meta.env.VITE_SHOPIFY_PET_SUBSCRIPTION_CHECKOUT_URL,
    spec: [
      { k: 'Deuterium', v: '5 ppm' },
      { k: 'Packaging', v: 'PET Plastic' },
      { k: 'Origin', v: 'Fort Lauderdale, FL' },
    ],
    accent: 'blue',
  },
];

export function Products() {
  useEffect(() => {
    PRODUCTS.forEach((product) => {
      trackCommerceEvent('product_viewed', {
        productId: product.id,
        productName: product.name,
        value: product.price,
        variantId: product.variantId,
        checkoutReady: Boolean(product.variantId),
      });
    });
  }, []);

  return (
    <section id="products" className="hpe-section relative overflow-hidden">
      <div className="absolute inset-0 hpe-grid opacity-30" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] hpe-glow-gold opacity-25" />
      <Particles count={20} color="rgba(240,210,122,0.4)" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <div className="hpe-hud-label mb-3" style={{ color: '#F0D27A' }}>
            07 - The DDW Formats
          </div>
          <h2 className="text-3xl sm:text-5xl font-medium text-white tracking-tight leading-[1.05]">
            <span className="hpe-text-chrome">One verified concentration.</span>
            <br />
            <span className="text-white/80">Two packaging options.</span>
          </h2>
          <p className="mt-5 text-white/60 text-base sm:text-lg leading-relaxed">
            Mdrn-Life DDW is offered at 5 ppm in Glass and PET Plastic bottles,
            with product links routed to the current store. Every product mention
            points back to the same independently verified DDW standard.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {PRODUCTS.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              delay={i * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({
  product,
  delay,
}: {
  product: Product;
  delay: number;
}) {
  const isGold = product.accent === 'gold';
  const links = getShopifyLinks(product);
  const trackAction = (eventName: 'added_to_cart' | 'started_checkout' | 'subscription_started_intent') => {
    trackCommerceEvent(eventName, {
      productId: product.id,
      productName: product.name,
      value: product.price,
      variantId: product.variantId,
      checkoutReady: links.isCheckoutReady,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay }}
      whileHover={{ y: -6 }}
      className="hpe-glass rounded-2xl p-7 relative overflow-hidden flex flex-col"
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

      <div className="relative h-56 flex items-center justify-center mb-4">
        <BottleViz accent={product.accent} label={product.id === 'glass' ? 'GLASS' : 'PET'} />
      </div>

      <div className="relative flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          {isGold && <Sparkles size={12} className="text-amber-300" />}
          <div className="hpe-hud-label" style={{ color: isGold ? '#F0D27A' : '#3FB8FF' }}>
            {product.badge}
          </div>
        </div>
        <h3 className="text-white text-2xl font-medium tracking-tight">{product.name}</h3>
        <p className="text-white/55 text-sm mt-1">{product.tagline}</p>

        <p className="text-white/65 text-sm leading-relaxed mt-4 flex-1">{product.description}</p>

        <div className="mt-5 space-y-1.5">
          {product.spec.map((s) => (
            <div key={s.k} className="flex items-center justify-between text-xs">
              <span className="text-white/45">{s.k}</span>
              <span className="font-mono text-white/80">{s.v}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="hpe-hud-label" style={{ fontSize: 9 }}>
              Current site
            </div>
            <div className="text-white font-mono text-2xl leading-none mt-1">
              {product.price}
              <span className="text-white/40 text-xs ml-2">/ {product.volume}</span>
            </div>
          </div>
          <a
            href={links.productUrl}
            target="_blank"
            rel="noreferrer"
            className="hpe-btn-ghost rounded-xl px-4 py-3 text-sm font-medium tracking-wide inline-flex items-center justify-center gap-2"
          >
            View
            <ExternalLink size={14} />
          </a>
        </div>

        <div className="mt-5 grid sm:grid-cols-2 gap-3">
          <a
            href={links.buyNowUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackAction('started_checkout')}
            className={`${isGold ? 'hpe-btn-ghost' : 'hpe-btn-primary'} rounded-xl px-4 py-3 text-sm font-medium tracking-wide inline-flex items-center justify-center gap-2`}
          >
            <ShoppingCart size={14} />
            Buy Now
          </a>
          <a
            href={links.addToCartUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackAction('added_to_cart')}
            className="hpe-btn-ghost rounded-xl px-4 py-3 text-sm font-medium tracking-wide inline-flex items-center justify-center gap-2"
          >
            <Plus size={14} />
            Add to Cart
          </a>
        </div>

        <a
          href={links.subscriptionCheckoutUrl}
          target="_blank"
          rel="noreferrer"
          onClick={() => trackAction('subscription_started_intent')}
          className="mt-3 rounded-xl px-4 py-3 text-sm font-medium tracking-wide inline-flex items-center justify-center gap-2 border border-white/10 bg-white/[0.03] text-white/75 hover:text-white hover:border-cyan-300/40 transition"
        >
          <RefreshCw size={14} />
          Subscribe
          <span className="sr-only">
            {links.subscriptionCheckoutUrl === product.productUrl
              ? ' - subscription checkout URL required from Shopify'
              : ''}
          </span>
        </a>

        {!links.isCheckoutReady && (
          <p className="mt-3 text-[11px] leading-relaxed text-white/40">
            Shopify checkout link is ready to activate when the final variant ID is provided.
          </p>
        )}
      </div>
    </motion.div>
  );
}

function BottleViz({ accent, label }: { accent: 'blue' | 'gold'; label: string }) {
  const isGold = accent === 'gold';
  const main = isGold ? '#F0D27A' : '#3FB8FF';
  const soft = isGold ? 'rgba(229,194,90,0.4)' : 'rgba(63,184,255,0.4)';

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div
        className="absolute w-44 h-44 rounded-full"
        style={{ background: `radial-gradient(circle at 50% 50%, ${soft}, transparent 70%)` }}
      />
      <svg viewBox="0 0 200 280" className="relative h-full w-auto hpe-float" style={{ animationDuration: '8s' }}>
        <defs>
          <linearGradient id={`bottle-${accent}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={main} stopOpacity="0.05" />
            <stop offset="50%" stopColor={main} stopOpacity="0.4" />
            <stop offset="100%" stopColor={main} stopOpacity="0.05" />
          </linearGradient>
          <filter id={`bottleGlow-${accent}`}>
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>
        <ellipse cx="100" cy="160" rx="60" ry="100" fill={main} opacity="0.12" filter={`url(#bottleGlow-${accent})`} />
        <rect x="80" y="14" width="40" height="22" rx="3" fill="rgba(15,20,28,0.95)" stroke={main} strokeWidth="1" />
        <rect x="76" y="32" width="48" height="6" rx="2" fill="rgba(15,20,28,0.95)" stroke={main} strokeWidth="1" />
        <path
          d="M70 44 L130 44 L138 70 L138 240 Q138 256 122 256 L78 256 Q62 256 62 240 L62 70 Z"
          fill={`url(#bottle-${accent})`}
          stroke={main}
          strokeWidth="1.2"
        />
        <path
          d="M68 82 L132 82 L132 240 Q132 250 122 250 L78 250 Q68 250 68 240 Z"
          fill={main}
          opacity="0.18"
        />
        <rect x="74" y="138" width="52" height="66" rx="3" fill="rgba(7,9,13,0.66)" stroke={main} strokeWidth="0.6" />
        <text x="100" y="158" textAnchor="middle" fill={main} fontSize="9" fontFamily="Geist Mono" letterSpacing="2">
          MDRN
        </text>
        <text x="100" y="176" textAnchor="middle" fill="#fff" fontSize="7" fontFamily="Geist Mono" letterSpacing="1.5">
          5 PPM
        </text>
        <line x1="80" y1="186" x2="120" y2="186" stroke={main} strokeWidth="0.4" opacity="0.5" />
        <text x="100" y="197" textAnchor="middle" fill="#fff" fontSize="6" fontFamily="Geist Mono" opacity="0.7">
          {label}
        </text>
      </svg>
    </div>
  );
}
