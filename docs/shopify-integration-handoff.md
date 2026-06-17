# Shopify Backend Integration Runbook

This project uses the external Mdrn-Life DDW website as the frontend and Shopify as the ecommerce backend. Shopify must remain responsible for checkout, payments, taxes, shipping, orders, inventory, discounts, customer events, and subscription logic.

## Current Implementation

The current production-safe flow is:

1. Customer visits `/products`.
2. Customer clicks Add to Cart.
3. The frontend stores the cart locally and opens `/products/cart`.
4. Customer adjusts quantity or removes products.
5. Customer clicks Check out.
6. The frontend builds a Shopify cart permalink:
   - `https://{store-domain}/cart/{variant_id}:{quantity},{variant_id}:{quantity}`
7. Shopify receives the customer, preloads the cart, and handles checkout.

This is the fastest reliable launch path because no custom backend handles payment data.

## Live Values Currently Used

- Store domain: `mdrnlifeddw.com`
- Shopify store domain environment value: `VITE_SHOPIFY_STORE_DOMAIN`
- Glass product page: `https://mdrnlifeddw.com/products/mdrn-life-ddw`
- Glass 12-pack variant ID: `41077216739362`
- Glass website price: `$166.90`
- PET product page: `https://mdrnlifeddw.com/products/mdrn-life-ddw-pet-plastic`
- PET 12-pack variant ID: `41122368749602`
- PET website price: `$152.75`

These can be overridden in Vercel:

- `VITE_SHOPIFY_STORE_DOMAIN`
- `VITE_SHOPIFY_GLASS_VARIANT_ID`
- `VITE_SHOPIFY_PET_VARIANT_ID`

## Developer Access Setup: Fast Launch With Cart Permalinks

Use this path first unless the client requires live Shopify cart syncing or subscription selling-plan selection on the external site.

Shopify Buy Button is another simple option, but this frontend currently uses
cart permalinks because the website has its own branded `/products/cart` page.
Use Buy Button only if the client wants Shopify-generated embeds instead of
the custom cart UI.

### Step 1: Confirm Store Domain

In Shopify admin:

1. Go to Settings.
2. Open Domains.
3. Confirm the primary customer-facing domain.
4. Give the developer one final value:
   - Example: `mdrnlifeddw.com`
   - Or: `modern-life-water.myshopify.com`

Put that value in Vercel as:

```env
VITE_SHOPIFY_STORE_DOMAIN=mdrnlifeddw.com
```

### Step 2: Confirm Product Variant IDs

For each product:

1. Open Shopify admin.
2. Go to Products.
3. Open the Glass product.
4. Open the exact sellable variant, for example the 12-pack 16 oz Glass variant.
5. Copy the numeric variant ID.
6. Repeat for the PET product.

Provide:

```env
VITE_SHOPIFY_GLASS_VARIANT_ID=41077216739362
VITE_SHOPIFY_PET_VARIANT_ID=41122368749602
```

Important: cart permalinks need numeric Shopify variant IDs, not product IDs and not GraphQL GIDs.

### Step 3: Confirm Product Truth

Give the developer:

- Final product names.
- Final product handles.
- Final variant titles.
- Final prices.
- Final pack sizes.
- Final product images.
- Inventory policy.
- Out-of-stock behavior.
- Whether prices should be manually displayed or pulled from Shopify later.

### Step 4: Confirm Checkout Settings

In Shopify admin, verify:

- Payments are enabled.
- Shipping zones and rates are set for every launch market.
- Taxes are configured.
- Markets/currencies are configured.
- Checkout branding is correct.
- Discount codes are active if the launch uses them.
- Refund, privacy, shipping, and terms pages are published.

### Step 5: Tracking and Customer Events

In Shopify admin:

1. Go to Settings.
2. Open Customer events.
3. Add or connect required pixels.

Provide:

- Meta Pixel ID.
- Google Analytics 4 measurement ID.
- Google Ads conversion ID and labels.
- TikTok Pixel ID.
- Klaviyo public key or installed integration confirmation.
- Shopify Customer Events confirmation.
- UTM naming rules.

The website already sends frontend events where possible. Shopify must capture checkout and purchase events on its side.

### Step 6: Production Test

Before launch:

1. Add Glass from `/products`.
2. Confirm `/products/cart` opens.
3. Increase and decrease quantity.
4. Remove product.
5. Add both Glass and PET.
6. Click Check out.
7. Confirm the Shopify URL contains the correct variant IDs and quantities.
8. Complete a test order using Shopify test mode or a real low-risk test payment.
9. Confirm order appears in Shopify.
10. Confirm tracking events fire.
11. Confirm Klaviyo receives started checkout and placed order.

## Developer Access Setup: Advanced Storefront API Path

Use this path only if the client wants Shopify product data, prices, inventory, cart lines, discounts, and checkout URL pulled dynamically into the external site.

### Step 1: Create or Configure a Custom App

In Shopify admin:

1. Go to Settings.
2. Open Apps and sales channels.
3. Click Develop apps.
4. Create an app for the external website.
5. Name it something clear, for example `Mdrn-Life External Frontend`.

### Step 2: Configure Storefront API Access

Inside the custom app:

1. Click Configure Storefront API scopes.
2. Enable only the scopes required for the frontend.
3. Recommended baseline scopes:
   - Read products.
   - Read product listings.
   - Read inventory if inventory display is required.
   - Manage Storefront API cart operations where available.
4. Save.
5. Install the app.
6. Copy the Storefront API public access token.

Provide to the developer:

```env
VITE_SHOPIFY_STOREFRONT_DOMAIN=mdrnlifeddw.com
VITE_SHOPIFY_STOREFRONT_TOKEN=public-storefront-token-here
VITE_SHOPIFY_STOREFRONT_API_VERSION=2026-04
```

Do not provide Admin API secrets to the frontend. Admin API tokens must stay server-side only.

### Step 3: Provide Product Identifiers

For Storefront API integration, provide:

- Product handles.
- Variant numeric IDs.
- Storefront API GraphQL variant GIDs.
- Selling plan group IDs if subscriptions are active.
- Selling plan IDs for each subscription option.

### Step 4: Storefront API Cart Flow

The advanced frontend flow should be:

1. Query products from Storefront API.
2. Display live title, images, price, variants, and availability.
3. Create a Shopify cart with Storefront API.
4. Add or update cart lines.
5. Retrieve `checkoutUrl` from the Shopify Cart object.
6. Redirect the customer to Shopify-hosted checkout.

The external site still does not process card data.

## Subscription Setup

If subscriptions are required, confirm which platform is used:

- Recharge.
- Appstle.
- Skio.
- Shopify Subscriptions.

Provide:

- Subscription app name.
- Product selling plan IDs.
- One-time purchase variant IDs.
- Subscribe-and-save selling plan IDs.
- Subscription terms.
- Cancellation policy.
- Whether subscription buttons should appear on `/products`.

Do not enable subscription UI on the frontend until selling plan IDs and checkout compatibility are confirmed.

## Security Rules

- Never expose Admin API access tokens in Vite environment variables.
- Never collect card details on the external website.
- Use Shopify checkout for payment and PCI handling.
- Use serverless API routes for any private Shopify Admin API calls.
- Keep pixel/customer data handling aligned with the privacy policy.
- Use HTTPS only.
- Keep Vercel environment variables restricted to the correct project and environment.

## Scalability Notes

- The current cart permalink flow has no custom backend bottleneck.
- Vercel serves the frontend through CDN/static assets.
- Browser `localStorage` keeps cart state client-side.
- Shopify handles checkout concurrency, payment, shipping, taxes, and order creation.
- Storefront API should be added only when live Shopify data is required.

## Exact Information Needed From You

Send this checklist to finish Shopify integration perfectly:

1. Shopify primary domain.
2. Glass product handle.
3. Glass final variant ID.
4. PET product handle.
5. PET final variant ID.
6. Final product titles.
7. Final product prices.
8. Final pack sizes and variant labels.
9. Final product images.
10. Checkout branding confirmation.
11. Shipping zones and rates confirmation.
12. Tax setup confirmation.
13. Discount/UTM rules.
14. Payment gateway confirmation.
15. Meta Pixel ID.
16. GA4 measurement ID.
17. Google Ads conversion ID and labels.
18. TikTok Pixel ID.
19. Klaviyo public key or integration confirmation.
20. Shopify customer events confirmation.
21. Subscription app name, if any.
22. Selling plan IDs, if subscriptions are needed.
23. Test order permission.
24. Final refund, shipping, privacy, and terms URLs.

## Brand and Social Links

Confirm these social profile URLs before launch:

- Instagram: `https://www.instagram.com/modernlifewater/`
- TikTok: `https://www.tiktok.com/@modernlifeddw`
- YouTube: `https://www.youtube.com/channel/UC19CpjpBOs1SxrAr47eX-xg`

## Source References

- Shopify cart permalinks: https://shopify.dev/docs/apps/build/checkout/create-cart-permalinks
- Shopify Storefront API: https://shopify.dev/docs/api/storefront/latest
- Shopify Storefront API cart management: https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/cart/manage
- Shopify Cart object checkoutUrl: https://shopify.dev/docs/api/storefront/latest/objects/Cart
- Shopify Web Pixels API: https://shopify.dev/docs/api/web-pixels-api
- Shopify Customer Events and pixels: https://help.shopify.com/en/manual/promoting-marketing/pixels
