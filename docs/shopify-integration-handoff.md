# Shopify Integration Handoff

This project routes commerce through Shopify while keeping the React storefront on the primary domain.

Required production inputs:

- Shopify store domain: `orise-6796.myshopify.com`
- Public storefront domain: `mdrnlifeddw.com`
- Glass variant ID and PET variant ID for cart checkout
- Glass and PET selling plan IDs for subscription checkout
- Buy Button and Storefront API access for product/blog reads
- Meta Pixel, Google Analytics 4, Google Ads, TikTok Pixel, and Klaviyo IDs
- Subscription app choice: Recharge, Appstle, Skio, or Shopify Subscriptions
- Social links for Instagram, TikTok, and YouTube

Current cart path:

- Product actions add items to the local cart at `/products/cart`.
- Checkout handoff creates or redirects to Shopify checkout using the configured variant ID and selling plan data.
- The floating support widget now uses WhatsApp and SMTP email support only. It does not require a Shopify Admin API token.

Production setup notes:

- Configure every server-only value in Vercel Project Settings, not in client-side `VITE_` variables.
- Keep the Admin API token scoped to the minimum required permissions.
- Confirm checkout redirects for `/products/cart`, `/checkouts`, `/cart/c`, `/orders`, and `/a/checkout` after deployment.
