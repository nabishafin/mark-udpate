import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2, Plus, ShoppingCart, Sparkles } from 'lucide-react';
import { addCartItem, getCartCount, onCartChange } from '../lib/cart';
import { PRODUCTS, Product } from '../lib/products';
import { trackCommerceEvent } from '../lib/tracking';

export function Products() {
  const [cartCount, setCartCount] = useState(() => getCartCount());

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

    return onCartChange(() => setCartCount(getCartCount()));
  }, []);

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
          {PRODUCTS.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              delay={i * 0.1}
              onCartCountChange={() => setCartCount(getCartCount())}
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
  onCartCountChange,
}: {
  product: Product;
  delay: number;
  onCartCountChange: () => void;
}) {
  const [adding, setAdding] = useState(false);
  const isGold = product.accent === 'gold';

  const handleAddToCart = () => {
    if (adding) return;
    setAdding(true);
    addCartItem(product.id, 1);
    onCartCountChange();
    trackCommerceEvent('added_to_cart', {
      productId: product.id,
      productName: product.name,
      value: product.price,
      variantId: product.variantId,
      checkoutReady: Boolean(product.variantId),
    });

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
          className="aspect-[16/11] w-full object-cover"
          style={{ objectPosition: 'center 48%' }}
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

        <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="hpe-hud-label" style={{ fontSize: 9 }}>
              Price
            </div>
            <div className="mt-1 font-mono text-2xl leading-none text-white">
              {product.price}
              <span className="ml-2 text-xs text-white/40">/ {product.volume}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={adding}
          className={`${isGold ? 'hpe-btn-ghost' : 'hpe-btn-primary'} mt-5 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium tracking-wide disabled:cursor-wait disabled:opacity-80`}
        >
          {adding ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Adding
            </>
          ) : (
            <>
              <Plus size={14} />
              Add to Cart
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
