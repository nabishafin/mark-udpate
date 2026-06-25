# Shopify Admin: Where To Find Everything For Codex

Use this while you are inside the client's Shopify admin. It tells you exactly where to click, what value to copy, and what to send back to Codex so the current website can be fully integrated with Shopify.

Current captured values and remaining missing items are tracked in `docs/shopify-collected-info-and-remaining.md`.

Do not send Shopify owner passwords or Admin API tokens in chat. Staff/collaborator access and public Storefront API tokens are the safe path.

## Quick Collection Template

Copy this and fill it as you go:

```txt
Store
- Primary domain:
- .myshopify.com domain:
- Store contact email:
- Support email:
- Phone:
- Business address:
- Currency:

Products
- Glass product handle:
- Glass numeric variant ID:
- Glass price:
- PET product handle:
- PET numeric variant ID:
- PET price:

Subscriptions
- Subscription app:
- Glass selling plan ID(s):
- PET selling plan ID(s):

Checkout readiness
- Payments active:
- Shipping zones active:
- Taxes active:
- Markets active:
- Test order approved:

Tracking
- GA4 Measurement ID:
- Google Ads Conversion ID:
- Google Ads Conversion Label:
- Meta Pixel ID:
- TikTok Pixel ID:
- Klaviyo public key:

Storefront API, if needed
- Storefront API endpoint:
- Storefront public token:
- API version:
```

## 1. Store Domain

Why Codex needs it: checkout links use the domain to send customers to Shopify checkout.

Where to go:

1. Shopify admin left sidebar.
2. Click **Settings** at the bottom-left.
3. Click **Domains**.
4. Find the domain marked **Primary**.
5. Copy it exactly.

Send:

```txt
Primary domain: mdrnlifeddw.com
.myshopify.com domain: [copy if shown]
```

## 2. Store Contact Details

Why Codex needs it: contact forms, policy pages, footer info, and legal/store metadata should match Shopify.

Where to go:

1. Shopify admin left sidebar.
2. Click **Settings**.
3. Click **General**.
4. Open **Store contact details**.
5. Copy:
   - Store name
   - Store contact email
   - Sender/support email
   - Phone number
   - Store address

From your screenshot, I can see likely values, but please confirm:

```txt
Store name: Orise
Store contact email: support@orisefinance.com
Phone: 9544105042
Address: 1830 N University Drive, 275, Plantation Florida 33322, United States
```

## 3. Currency, Region, Unit System, Time Zone

Why Codex needs it: prices and checkout expectations should match Shopify.

Where to go:

1. Shopify admin left sidebar.
2. Click **Settings**.
3. Click **General**.
4. Scroll to **Store defaults**.
5. Copy:
   - Currency display
   - Backup region
   - Unit system
   - Default weight unit
   - Time zone

Send:

```txt
Currency: US Dollar (USD $)
Backup region:
Unit system:
Default weight unit:
Time zone:
```

## 4. Product Handles And Variant IDs

Why Codex needs it: the website checkout currently uses Shopify cart permalinks, and those require numeric variant IDs.

Where to go:

1. Shopify admin left sidebar.
2. Click **Products**.
3. Open the Glass product.
4. Copy the product handle:
   - Look at the product URL or the **Search engine listing** section.
   - Example handle: `mdrn-life-ddw`
5. Scroll to **Variants**.
6. Click the exact sellable variant, such as `12 Pack Glass Bottle 16oz`.
7. Look at the browser URL.
8. Copy the last number in the URL.

Example URL:

```txt
https://admin.shopify.com/store/orise/products/123456789/variants/41077216739362
```

The numeric variant ID is:

```txt
41077216739362
```

Repeat for the PET product.

Send:

```txt
Glass product handle:
Glass numeric variant ID:
Glass price:
PET product handle:
PET numeric variant ID:
PET price:
```

Important:

- Do not send product ID instead of variant ID.
- Do not send only the product URL.
- Do not send GraphQL GID unless I ask for Storefront API IDs too.

## 5. Product Images

Why Codex needs it: the website product cards should use final Shopify-approved assets.

Where to go:

1. Shopify admin left sidebar.
2. Click **Products**.
3. Open the Glass product.
4. Find the **Media** section.
5. Download or save the best image.
6. Repeat for PET.

Send the image files in chat or put them in the project and tell me the paths.

Preferred names:

```txt
mdrn-life-ddw-glass.webp
mdrn-life-ddw-pet.webp
```

## 6. Subscription Selling Plan IDs

Why Codex needs it: subscription checkout will not work correctly without selling plan IDs.

First, find which subscription app is used:

1. Shopify admin left sidebar.
2. Click **Apps**.
3. Look for:
   - Shopify Subscriptions
   - Appstle
   - Recharge
   - Skio
   - another subscription app

Then collect selling plan IDs:

1. Open the subscription app.
2. Find the product subscription plan.
3. Copy the selling plan ID for each product/frequency.

If you cannot find selling plan IDs in the UI, send me screenshots of:

- The subscription app name
- The product subscription settings
- The plan/frequency settings

Send:

```txt
Subscription app:
Glass selling plan ID:
PET selling plan ID:
Frequency:
Discount:
```

## 7. Payments

Why Codex needs it: checkout cannot be fully tested unless payments are active or test mode is enabled.

Where to go:

1. Shopify admin left sidebar.
2. Click **Settings**.
3. Click **Payments**.
4. Check if a provider is active.
5. Check if test mode is on/off.

Send:

```txt
Payments active: yes/no
Provider:
Test mode enabled: yes/no
Can Codex run a test order: yes/no
```

## 8. Shipping

Why Codex needs it: Shopify checkout must show shipping rates for the launch countries.

Where to go:

1. Shopify admin left sidebar.
2. Click **Settings**.
3. Click **Shipping and delivery**.
4. Open the active shipping profile.
5. Check shipping zones and rates.

Send:

```txt
US shipping zone active: yes/no
US shipping rates:
Canada shipping zone active: yes/no
Mexico shipping zone active: yes/no
Free shipping rule, if any:
```

## 9. Taxes And Duties

Why Codex needs it: checkout test must confirm taxes behave correctly.

Where to go:

1. Shopify admin left sidebar.
2. Click **Settings**.
3. Click **Taxes and duties**.
4. Check United States tax settings.

Send:

```txt
US taxes configured: yes/no
Any special tax notes:
```

## 10. Markets

Why Codex needs it: markets control where customers can buy, currencies, and domains.

Where to go:

1. Shopify admin left sidebar.
2. Click **Settings**.
3. Click **Markets**.
4. Copy active markets.

Send:

```txt
Active markets:
Primary market:
Countries allowed to buy:
```

## 11. Discounts

Why Codex needs it: launch codes and free shipping need checkout testing.

Where to go:

1. Shopify admin left sidebar.
2. Click **Discounts**.
3. Open each launch discount.
4. Copy code, type, value, and limits.

Send:

```txt
Discount code:
Discount type:
Discount amount:
Applies to:
Start/end date:
Usage limits:
```

## 12. Policies

Why Codex needs it: the website has local policy pages, but we need to know if Shopify is the source of truth.

Where to go:

1. Shopify admin left sidebar.
2. Click **Settings**.
3. Click **Policies**.
4. Open each policy.

Send:

```txt
Use Shopify policy text on website: yes/no
Terms complete: yes/no
Privacy complete: yes/no
Refund complete: yes/no
Shipping complete: yes/no
Subscription policy complete: yes/no
```

## 13. Customer Events And Pixels

Why Codex needs it: purchase tracking usually needs Shopify Customer Events because the final checkout happens on Shopify.

Where to go:

1. Shopify admin left sidebar.
2. Click **Settings**.
3. Click **Customer events**.
4. Check which pixels are connected.

Send:

```txt
Shopify Customer Events configured: yes/no
Meta connected: yes/no
Google connected: yes/no
TikTok connected: yes/no
Klaviyo connected: yes/no
```

If pixels are not inside Shopify, collect IDs from the ad platforms below.

## 14. GA4 Measurement ID

Where to go:

1. Go to `analytics.google.com`.
2. Open the client's GA4 property.
3. Click **Admin**.
4. Click **Data streams**.
5. Open the web stream.
6. Copy the **Measurement ID**.

Send:

```txt
GA4 Measurement ID: G-XXXXXXXXXX
```

## 15. Google Ads Conversion ID And Label

Where to go:

1. Go to `ads.google.com`.
2. Open the client's Google Ads account.
3. Click **Goals**.
4. Click **Conversions**.
5. Open the purchase conversion action.
6. Open tag setup/details.
7. Copy:
   - Conversion ID
   - Conversion label

Send:

```txt
Google Ads Conversion ID: AW-XXXXXXXXX
Google Ads Conversion Label:
```

## 16. Meta Pixel ID

Where to go:

1. Go to `business.facebook.com`.
2. Open **Events Manager**.
3. Select the client's pixel.
4. Copy the Pixel ID.

Send:

```txt
Meta Pixel ID:
```

## 17. TikTok Pixel ID

Where to go:

1. Go to `ads.tiktok.com`.
2. Open the client's ad account.
3. Go to **Assets**.
4. Click **Events**.
5. Open the website pixel.
6. Copy the Pixel ID.

Send:

```txt
TikTok Pixel ID:
```

## 18. Klaviyo Public Key

Where to go:

1. Go to `klaviyo.com`.
2. Open the client's account.
3. Click account name.
4. Click **Settings**.
5. Click **API Keys**.
6. Copy the **Public API Key** / **Site ID** only.

Send:

```txt
Klaviyo public key:
```

Do not send the Klaviyo private key unless we agree on a secure server-side flow.

## 19. Storefront API Token

Only do this if we need live prices, live products, Shopify blog sync, live inventory, or Shopify cart API.

Where to go:

1. Shopify admin left sidebar.
2. Click **Settings**.
3. Click **Apps and sales channels**.
4. Click **Develop apps**.
5. If prompted, allow custom app development.
6. Create an app named `Mdrn-Life External Website`.
7. Click **Configure Storefront API scopes**.
8. Enable only required public read scopes.
9. Install the app.
10. Open **API credentials**.
11. Copy the **Storefront API access token**.

Send:

```txt
Storefront API endpoint:
Storefront public token:
API version:
```

Never send the Admin API token for frontend integration.

## 20. What To Send Me First

If you want the fastest path, send these first:

```txt
Primary domain:
Glass numeric variant ID:
PET numeric variant ID:
Glass price:
PET price:
Payments active:
Shipping active:
Taxes active:
Subscription app:
Glass selling plan ID:
PET selling plan ID:
Test order approved:
```

With just those values, I can make the current cart/checkout flow production-accurate and test it end-to-end.
