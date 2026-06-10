# Shopify Integration Handoff

This project is now structured so the external Mdrn-Life DDW website can stay as the premium frontend while Shopify remains the ecommerce backend for products, prices, inventory, checkout, payments, orders, taxes, shipping, and subscription order handling.

## Current Implementation

- Product cards use centralized Shopify link helpers in `src/lib/shopify.ts`.
- Buy Now and Add to Cart actions route to Shopify cart permalinks when a Shopify variant ID is available.
- The PET product has the current known variant ID: `41122368749602`.
- The Glass product is ready for activation once the client provides the final Shopify variant ID.
- Subscription CTAs are present, but final subscription checkout URLs or Storefront API selling plan IDs are still required before launch.
- Tracking calls are centralized in `src/lib/tracking.ts` and fail silently if a pixel is not installed yet, so missing marketing scripts cannot crash checkout clicks.

## Required Client Inputs

Give the developer these values before final production launch:

1. Shopify store domain
   - Example: `mdrnlifeddw.com` or `modern-life-water.myshopify.com`.
   - Env variable: `VITE_SHOPIFY_STORE_DOMAIN`.

2. Shopify variant ID for each product
   - Glass 5 ppm DDW variant ID.
   - PET 5 ppm DDW variant ID.
   - Env variables: `VITE_SHOPIFY_GLASS_VARIANT_ID`, `VITE_SHOPIFY_PET_VARIANT_ID`.

3. Buy Button or checkout links
   - If using Shopify Buy Button first, provide the Buy Button embed code or generated checkout/cart links.
   - If using direct checkout links, provide final Shopify cart permalinks for every product and subscription option.

4. Storefront API access if advanced cart is required
   - Storefront API public access token.
   - Storefront API version to use.
   - Product handles or GraphQL product/variant IDs.
   - Selling plan IDs for subscriptions.

5. Subscription app details
   - Confirm whether subscriptions are handled by Recharge, Appstle, Skio, or Shopify Subscriptions.
   - Provide selling plan IDs or subscription checkout URLs for each subscription product.
   - Confirm whether one-time purchase and subscribe-and-save are both available.

6. Tracking IDs and verification access
   - Meta Pixel ID.
   - Google Analytics 4 measurement ID.
   - Google Ads conversion ID and conversion labels.
   - TikTok Pixel ID.
   - Klaviyo public API key or onsite tracking snippet.
   - Shopify customer events setup confirmation.
   - UTM naming rules for campaigns.

7. Social profile URLs
   - Instagram: `https://www.instagram.com/modernlifewater/`
   - TikTok: `https://www.tiktok.com/@modernlifeddw`
   - YouTube: `https://www.youtube.com/channel/UC19CpjpBOs1SxrAr47eX-xg`

## Recommended Production Path

Use Shopify Buy Button or cart permalinks for the first launch because they are fast, stable, and keep checkout inside Shopify. Move to Storefront API only when the client needs custom cart state, product syncing, richer subscription selection, or personalized checkout flows.

## Launch Verification Checklist

- Buy Now opens Shopify checkout for Glass.
- Add to Cart opens Shopify cart or checkout for Glass.
- Buy Now opens Shopify checkout for PET.
- Add to Cart opens Shopify cart or checkout for PET.
- Subscribe opens the correct subscription checkout flow for each subscribed product.
- Shopify inventory, taxes, shipping, and payment methods appear correctly in checkout.
- Meta Pixel records product view, add to cart, and checkout events.
- Google Analytics 4 records product view, add to cart, and begin checkout events.
- Google Ads conversion tracking records completed purchases after Shopify checkout.
- TikTok Pixel records product view, add to cart, and checkout events.
- Klaviyo captures viewed product, added to cart, started checkout, placed order, subscription started, failed payment, and reorder behavior.
- Shopify customer events are enabled and verified.
- UTM parameters survive the external-site-to-Shopify handoff.

## Source References

- Shopify Buy Button: https://help.shopify.com/en/manual/online-sales-channels/buy-button
- Shopify cart permalinks: https://help.shopify.com/en/manual/checkout-settings/cart-permalink
- Shopify Storefront API cartCreate: https://shopify.dev/docs/api/storefront/latest/mutations/cartCreate
- Shopify Storefront API cart checkoutUrl: https://shopify.dev/docs/api/storefront/latest/queries/cart
- Shopify Web Pixels API events: https://shopify.dev/docs/api/web-pixels-api/standard-events
