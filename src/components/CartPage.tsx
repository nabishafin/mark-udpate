import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Minus, Plus, ShieldCheck, ShoppingCart, Trash2 } from 'lucide-react';
import {
  clearCart,
  formatMoney,
  getCartItems,
  getCartSubtotalCents,
  hydrateCartItems,
  onCartChange,
  removeCartItem,
  updateCartItemQuantity,
} from '../lib/cart';
import { Product } from '../lib/products';
import { buildShopifyCheckoutUrl, hasCheckoutVariants } from '../lib/shopify';
import { trackCommerceEvent } from '../lib/tracking';

const CHECKOUT_STEPS = [
  ['1', 'Cart'],
  ['2', 'Shipping'],
  ['3', 'Payment'],
] as const;

export function CartPage() {
  const [cartItems, setCartItems] = useState(() => getCartItems());

  useEffect(() => onCartChange(() => setCartItems(getCartItems())), []);

  const hydratedItems = useMemo(() => hydrateCartItems(cartItems), [cartItems]);
  const subtotalCents = useMemo(() => getCartSubtotalCents(cartItems), [cartItems]);
  const canCheckout = hasCheckoutVariants(
    hydratedItems.map((item) => ({
      variantId: item.product.variantId,
      quantity: item.quantity,
    })),
  );

  const syncCart = () => setCartItems(getCartItems());

  const handleQuantity = (productId: Product['id'], quantity: number) => {
    updateCartItemQuantity(productId, quantity);
    syncCart();
  };

  const handleRemove = (productId: Product['id']) => {
    removeCartItem(productId);
    syncCart();
  };

  const handleCheckout = () => {
    const checkoutUrl = buildShopifyCheckoutUrl(
      hydratedItems.map((item) => ({
        variantId: item.product.variantId,
        quantity: item.quantity,
      })),
    );

    trackCommerceEvent('started_checkout', {
      value: formatMoney(subtotalCents),
      items: hydratedItems.map((item) => item.product.name).join(', '),
      cartQuantity: hydratedItems.reduce((total, item) => total + item.quantity, 0),
    });

    window.location.href = checkoutUrl;
  };

  return (
    <section className="hpe-section relative min-h-screen overflow-hidden pt-32">
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-end"
        >
          <div>
            <div className="hpe-hud-label mb-3">Secure Shopify Checkout</div>
            <h1 className="text-4xl font-medium tracking-tight text-white sm:text-6xl">
              Your Cart
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/62 sm:text-lg">
              Review your Mdrn-Life DDW order here. Payment, shipping, taxes,
              and order confirmation continue securely through Shopify.
            </p>
          </div>

          <div className="hpe-glass rounded-2xl p-4">
            <div className="grid grid-cols-3 gap-2">
              {CHECKOUT_STEPS.map(([number, label], index) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.08 }}
                  className={`rounded-xl border p-3 text-center ${
                    index === 0
                      ? 'border-cyan-300/45 bg-cyan-300/[0.08] text-cyan-100'
                      : 'border-white/10 bg-white/[0.03] text-white/45'
                  }`}
                >
                  <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-full border border-current font-mono text-xs">
                    {number}
                  </div>
                  <div className="mt-2 text-xs font-medium">{label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {hydratedItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="mt-14 hpe-glass rounded-2xl p-8 text-center"
          >
            <ShoppingCart className="mx-auto text-cyan-200" size={34} />
            <h2 className="mt-5 text-2xl font-medium text-white">Your cart is empty.</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/55">
              Add Mdrn-Life DDW Glass or PET Plastic bottles from the shop page,
              then return here to adjust quantities before Shopify checkout.
            </p>
            <a href="/products" className="hpe-btn-primary mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium">
              Continue shopping
              <ArrowRight size={14} />
            </a>
          </motion.div>
        ) : (
          <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_420px] lg:items-start">
            <div className="space-y-4">
              <div className="hidden grid-cols-[1fr_180px_170px] px-2 pb-3 text-[10px] uppercase tracking-[0.28em] text-white/38 md:grid">
                <div>Product</div>
                <div className="text-center">Quantity</div>
                <div className="text-right">Total</div>
              </div>

              {hydratedItems.map((item, index) => (
                <motion.article
                  key={item.productId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: index * 0.06 }}
                  className="hpe-glass grid gap-5 rounded-2xl p-4 sm:p-5 md:grid-cols-[1fr_180px_170px] md:items-center"
                >
                  <div className="flex gap-4 sm:gap-5">
                    <div className="h-32 w-28 shrink-0 overflow-hidden rounded-xl border border-cyan-200/12 bg-white/[0.03] sm:h-36 sm:w-32">
                      <img
                        src={item.product.image.src}
                        alt={item.product.image.alt}
                        className="h-full w-full object-contain p-2"
                      />
                    </div>
                    <div>
                      <div className="hpe-hud-label" style={{ fontSize: 9 }}>
                        {item.product.badge}
                      </div>
                      <h2 className="mt-2 text-lg font-medium text-white">{item.product.name}</h2>
                      <p className="mt-2 font-mono text-sm text-white/68">{item.product.price}</p>
                      <p className="mt-3 text-sm text-white/55">{item.product.optionLabel}</p>
                      <div className="mt-4 flex items-center gap-2 text-xs text-cyan-100/70">
                        <ShieldCheck size={13} />
                        <span>Shopify checkout ready</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 md:justify-center">
                    <div className="inline-flex h-12 items-center rounded-xl border border-cyan-200/18 bg-cyan-200/[0.04]">
                      <button
                        type="button"
                        aria-label={`Decrease ${item.product.name} quantity`}
                        onClick={() => handleQuantity(item.productId, item.quantity - 1)}
                        className="flex h-full w-12 items-center justify-center text-white/70 transition hover:text-white"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="flex h-full w-12 items-center justify-center font-mono text-sm text-white">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label={`Increase ${item.product.name} quantity`}
                        onClick={() => handleQuantity(item.productId, item.quantity + 1)}
                        className="flex h-full w-12 items-center justify-center text-white/70 transition hover:text-white"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      type="button"
                      aria-label={`Remove ${item.product.name}`}
                      onClick={() => handleRemove(item.productId)}
                      className="flex h-10 w-10 items-center justify-center rounded-lg text-white/55 transition hover:bg-white/[0.05] hover:text-white"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="font-mono text-lg text-white md:text-right">
                    {formatMoney(item.lineTotalCents)}
                  </div>
                </motion.article>
              ))}
            </div>

            <motion.aside
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="hpe-glass sticky top-28 rounded-2xl p-6"
            >
              <div className="hpe-hud-label mb-4">Order Summary</div>
              <div className="space-y-4 border-b border-white/10 pb-5">
                <div className="flex items-center justify-between gap-6 text-sm text-white/62">
                  <span>Subtotal</span>
                  <span className="font-mono text-white">{formatMoney(subtotalCents)}</span>
                </div>
                <div className="flex items-center justify-between gap-6 text-sm text-white/62">
                  <span>Shipping & taxes</span>
                  <span>Shopify checkout</span>
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between gap-6 text-lg text-white">
                <span>Estimated total</span>
                <span className="font-mono">{formatMoney(subtotalCents)} USD</span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-white/50">
                Taxes, discounts, shipping, payment, and customer information are
                calculated securely in Shopify.
              </p>
              <button
                type="button"
                onClick={handleCheckout}
                disabled={!canCheckout}
                className="hpe-btn-primary mt-6 w-full rounded-xl px-5 py-4 text-sm font-medium tracking-wide disabled:cursor-not-allowed disabled:opacity-50"
              >
                Check out
              </button>
              <a href="/products" className="mt-3 inline-flex w-full justify-center px-5 py-3 text-sm text-white/62 underline underline-offset-4 transition hover:text-white">
                Continue shopping
              </a>
              <button
                type="button"
                onClick={() => {
                  clearCart();
                  syncCart();
                }}
                className="mt-1 w-full px-5 py-3 text-sm text-white/42 underline underline-offset-4 transition hover:text-white"
              >
                Clear cart
              </button>
            </motion.aside>
          </div>
        )}
      </div>
    </section>
  );
}
