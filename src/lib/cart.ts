import { Product, getProduct } from './products';

export type CartItem = {
  productId: Product['id'];
  quantity: number;
  purchaseOption: 'subscription' | 'one-time';
  sellingPlanId?: string;
};

export type HydratedCartItem = CartItem & {
  product: Product;
  lineTotalCents: number;
};

const CART_KEY = 'mdrn-life-ddw-cart';
const CART_EVENT = 'mdrn-life-ddw-cart-updated';

function normalizeQuantity(quantity: number) {
  return Math.max(1, Math.min(99, Math.floor(quantity || 1)));
}

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

function emitCartUpdate() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(CART_EVENT));
  }
}

export function getCartItems(): CartItem[] {
  if (!canUseStorage()) return [];

  try {
    const parsed = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item) => ({
        productId: item.productId,
        quantity: normalizeQuantity(Number(item.quantity)),
        purchaseOption: item.purchaseOption === 'subscription' ? 'subscription' as const : 'one-time' as const,
        sellingPlanId: typeof item.sellingPlanId === 'string' ? item.sellingPlanId : undefined,
      }))
      .filter((item) => getProduct(item.productId));
  } catch {
    return [];
  }
}

export function saveCartItems(items: CartItem[]) {
  if (!canUseStorage()) return;

  const normalized = items
    .filter((item) => getProduct(item.productId))
    .map((item) => ({
      productId: item.productId,
      quantity: normalizeQuantity(item.quantity),
      purchaseOption: item.purchaseOption,
      sellingPlanId: item.sellingPlanId,
    }));

  localStorage.setItem(CART_KEY, JSON.stringify(normalized));
  emitCartUpdate();
}

export function hydrateCartItems(items = getCartItems()): HydratedCartItem[] {
  return items.flatMap((item) => {
    const product = getProduct(item.productId);
    if (!product) return [];
    const quantity = normalizeQuantity(item.quantity);

    let priceCents = product.priceCents;
    if (item.purchaseOption === 'subscription') {
      const plan = product.subscription.plans.find((p) => p.sellingPlanId === item.sellingPlanId)
        ?? product.subscription.plans[0];
      priceCents = plan ? plan.priceCents : product.subscription.priceCents;
    }

    return [
      {
        productId: item.productId,
        quantity,
        purchaseOption: item.purchaseOption,
        sellingPlanId: item.sellingPlanId,
        product,
        lineTotalCents: priceCents * quantity,
      },
    ];
  });
}

export function getCartCount(items = getCartItems()) {
  return items.reduce((total, item) => total + normalizeQuantity(item.quantity), 0);
}

export function getCartSubtotalCents(items = getCartItems()) {
  return hydrateCartItems(items).reduce((total, item) => total + item.lineTotalCents, 0);
}

export function addCartItem(
  productId: Product['id'],
  quantity = 1,
  purchaseOption: CartItem['purchaseOption'] = 'one-time',
  sellingPlanId?: string,
) {
  const current = getCartItems();
  const existing = current.find((item) => item.productId === productId);

  if (existing) {
    existing.quantity = normalizeQuantity(existing.quantity + quantity);
    existing.purchaseOption = purchaseOption;
    existing.sellingPlanId = sellingPlanId;
    saveCartItems(current);
    return;
  }

  saveCartItems([...current, { productId, quantity: normalizeQuantity(quantity), purchaseOption, sellingPlanId }]);
}

export function updateCartItemQuantity(productId: Product['id'], quantity: number) {
  const normalized = normalizeQuantity(quantity);
  saveCartItems(
    getCartItems().map((item) =>
      item.productId === productId ? { ...item, quantity: normalized } : item,
    ),
  );
}

export function removeCartItem(productId: Product['id']) {
  saveCartItems(getCartItems().filter((item) => item.productId !== productId));
}

export function clearCart() {
  if (!canUseStorage()) return;
  localStorage.removeItem(CART_KEY);
  emitCartUpdate();
}

export function onCartChange(callback: () => void) {
  if (typeof window === 'undefined') {
    return () => undefined;
  }
  window.addEventListener(CART_EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(CART_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}

export function formatMoney(cents: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}
