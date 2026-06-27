import { shopifyStorefrontFetch } from './shopify';

export type CheckoutAddress = {
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  province: string;
  zip: string;
  country: string;
  phone: string;
};

export type DeliveryOption = {
  handle: string;
  title: string;
  estimatedCost: { amount: string; currencyCode: string };
};

export type DeliveryGroup = {
  id: string;
  deliveryOptions: DeliveryOption[];
  selectedDeliveryOption: DeliveryOption | null;
};

export type CheckoutCart = {
  id: string;
  checkoutUrl: string;
  cost: {
    subtotalAmount: { amount: string; currencyCode: string };
    totalAmount: { amount: string; currencyCode: string };
    totalTaxAmount: { amount: string; currencyCode: string } | null;
  };
  deliveryGroups: DeliveryGroup[];
};

export type CheckoutLineItem = {
  variantId: string;
  quantity: number;
  sellingPlanId?: string;
  purchaseOption?: 'subscription' | 'one-time';
};

const VARIANT_GID = 'gid://shopify/ProductVariant/';
const PLAN_GID = 'gid://shopify/SellingPlan/';

function toVariantGid(id: string) {
  return id.startsWith('gid://') ? id : `${VARIANT_GID}${id}`;
}
function toPlanGid(id: string) {
  return id.startsWith('gid://') ? id : `${PLAN_GID}${id}`;
}

const CART_FIELDS = `
  id
  checkoutUrl
  cost {
    subtotalAmount { amount currencyCode }
    totalAmount { amount currencyCode }
    totalTaxAmount { amount currencyCode }
  }
  deliveryGroups(first: 10) {
    nodes {
      id
      deliveryOptions {
        handle
        title
        estimatedCost { amount currencyCode }
      }
      selectedDeliveryOption {
        handle
        title
        estimatedCost { amount currencyCode }
      }
    }
  }
`;

type RawCart = Omit<CheckoutCart, 'deliveryGroups'> & {
  deliveryGroups: { nodes: DeliveryGroup[] };
};

function normalizeCart(raw: RawCart): CheckoutCart {
  return {
    ...raw,
    deliveryGroups: raw?.deliveryGroups?.nodes ?? [],
  };
}

export async function createCheckoutCart(items: CheckoutLineItem[]): Promise<CheckoutCart> {
  const lines = items
    .filter((item) => item.variantId)
    .map((item) => ({
      merchandiseId: toVariantGid(item.variantId),
      quantity: Math.max(1, Math.floor(item.quantity || 1)),
      ...(item.purchaseOption === 'subscription' && item.sellingPlanId
        ? { sellingPlanId: toPlanGid(item.sellingPlanId) }
        : {}),
    }));

  if (!lines.length) throw new Error('No items to checkout.');

  const payload = await shopifyStorefrontFetch({
    query: `mutation CartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart { ${CART_FIELDS} }
        userErrors { field message }
      }
    }`,
    variables: { input: { lines } },
  });

  const errors = payload?.data?.cartCreate?.userErrors ?? [];
  if (errors.length) throw new Error(errors.map((e: any) => e.message).join(' ') || 'Cart creation failed.');

  const cart = payload?.data?.cartCreate?.cart;
  if (!cart) throw new Error('Failed to create checkout session.');
  return normalizeCart(cart);
}

export async function updateCartBuyerIdentity(
  cartId: string,
  email: string,
  address: CheckoutAddress,
): Promise<CheckoutCart> {
  const payload = await shopifyStorefrontFetch({
    query: `mutation CartBuyerIdentityUpdate($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
      cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
        cart { ${CART_FIELDS} }
        userErrors { field message }
      }
    }`,
    variables: {
      cartId,
      buyerIdentity: {
        email,
        countryCode: address.country,
        deliveryAddressPreferences: [
          {
            deliveryAddress: {
              firstName: address.firstName,
              lastName: address.lastName,
              address1: address.address1,
              address2: address.address2 || undefined,
              city: address.city,
              province: address.province,
              zip: address.zip,
              country: address.country,
              phone: address.phone || undefined,
            },
          },
        ],
      },
    },
  });

  const errors = payload?.data?.cartBuyerIdentityUpdate?.userErrors ?? [];
  if (errors.length) throw new Error(errors.map((e: any) => e.message).join(' ') || 'Failed to save your information.');

  const cart = payload?.data?.cartBuyerIdentityUpdate?.cart;
  if (!cart) throw new Error('Failed to update checkout session.');
  return normalizeCart(cart);
}

export async function selectCartDeliveryOption(
  cartId: string,
  deliveryGroupId: string,
  deliveryOptionHandle: string,
): Promise<CheckoutCart> {
  const payload = await shopifyStorefrontFetch({
    query: `mutation CartSelectedDeliveryOptionsUpdate($cartId: ID!, $selectedDeliveryOptions: [CartSelectedDeliveryOptionInput!]!) {
      cartSelectedDeliveryOptionsUpdate(cartId: $cartId, selectedDeliveryOptions: $selectedDeliveryOptions) {
        cart { ${CART_FIELDS} }
        userErrors { field message }
      }
    }`,
    variables: {
      cartId,
      selectedDeliveryOptions: [{ deliveryGroupId, deliveryOptionHandle }],
    },
  });

  const errors = payload?.data?.cartSelectedDeliveryOptionsUpdate?.userErrors ?? [];
  if (errors.length) throw new Error(errors.map((e: any) => e.message).join(' ') || 'Failed to select shipping method.');

  const cart = payload?.data?.cartSelectedDeliveryOptionsUpdate?.cart;
  if (!cart) throw new Error('Failed to update shipping selection.');
  return normalizeCart(cart);
}
