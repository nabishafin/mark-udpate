# Shopify Integration Intake Checklist

Use this document to collect everything needed to fully connect the current Mdrn-Life DDW website to the client's Shopify store.

Current captured values and remaining missing items are tracked in `docs/shopify-collected-info-and-remaining.md`.

The screenshots show access to the Shopify admin for **Orise** with domain `mdrnlifeddw.com`. To integrate perfectly, send the items below in one message or attach files where requested.

## 1. Shopify Access I Need

Please confirm the Shopify staff/collaborator account has these permissions:

- Products: view and edit
- Orders: view, for testing only
- Discounts: view, if launch coupons are used
- Content: view and edit, if blog/policy content should sync from Shopify
- Online Store: view, for domain and store setup checks
- Settings: view
- Apps and sales channels: manage or develop apps, only if Storefront API/live data is required
- Customer events: view/edit, if pixels should be configured through Shopify

Do not send the store owner's password. Staff/collaborator access is the correct route.

## 2. Store Identity

Send:

```txt
Shopify admin/store name:
Primary domain:
.myshopify.com domain:
Store contact email:
Store support email:
Store phone:
Business/legal company name:
Store address:
Launch markets/countries:
Default currency:
```

From your screenshots, some likely values are:

```txt
Primary domain: mdrnlifeddw.com
Store support email: support@orisefinance.com
Phone: 9544105042
Address: 1830 N University Drive, 275, Plantation Florida 33322, United States
Currency: USD
```

Please confirm these before I wire final production settings.

## 3. Product Data Needed

For each sellable product, send:

```txt
Product name:
Shopify product handle:
Product URL:
Variant title:
Numeric variant ID:
Price:
Compare-at price, if any:
Pack size:
Bottle size:
SKU:
Inventory tracking: yes/no
Continue selling when out of stock: yes/no
Product status: active/draft
```

For this project, I specifically need:

```txt
Glass product numeric variant ID:
PET product numeric variant ID:
Glass product handle:
PET product handle:
Glass final price:
PET final price:
```

Important: cart checkout currently needs the **numeric variant ID**, not the product ID and not the GraphQL GID.

## 4. Product Images

Send the final product images for:

- Glass bottle product
- PET bottle product
- Any lifestyle/product bundle images the client wants on the product page

Best format:

```txt
PNG, JPG, WEBP, or original design export
Highest resolution available
Transparent background if available
```

I will place them in:

```txt
public/products/
```

## 5. Subscription Setup

The current website has subscription UI. To make subscription checkout work, send:

```txt
Subscription app used: Shopify Subscriptions / Appstle / Recharge / Skio / other
Glass selling plan ID:
PET selling plan ID:
Any second/third selling plan IDs:
Subscription frequency:
Subscription discount:
Subscription terms:
Cancellation policy:
```

If these are not provided, I can keep one-time purchase checkout active and block subscription checkout until the selling plan IDs are confirmed.

## 6. Checkout, Payments, Shipping, Taxes

Please confirm each item:

```txt
Payments active: yes/no
Payment provider:
Test mode enabled: yes/no
Permission to place a test order: yes/no
Shipping zones configured: yes/no
US shipping rate configured: yes/no
Canada/Mexico shipping configured: yes/no
Taxes configured: yes/no
Markets configured: yes/no
Checkout branding approved: yes/no
```

If checkout is not active, I can still integrate the frontend, but I cannot verify final payment/order creation.

## 7. Discounts And Checkout Rules

Send:

```txt
Launch discount codes:
Free shipping rules:
Subscription discount rules:
Any quantity breaks:
Any products excluded from discounts:
Any required UTM parameters:
```

## 8. Tracking And Marketing Pixels

Send any that apply:

```txt
GA4 Measurement ID:
Google Ads Conversion ID:
Google Ads Conversion Label:
Meta Pixel ID:
TikTok Pixel ID:
Klaviyo public key / site ID:
Klaviyo private key: DO NOT SEND unless we agree on a secure server-only flow
Shopify Customer Events already configured: yes/no
```

Pixel IDs are not secret. Admin/private API keys are secret and should not be pasted into frontend code.

## 9. Storefront API, Only If Live Shopify Data Is Required

The current project can launch using Shopify cart permalinks. Storefront API is only needed if the site should pull live Shopify data such as live prices, inventory, blog articles, and Shopify cart checkout URLs.

If using Storefront API, send:

```txt
Storefront API endpoint:
Storefront public access token:
API version shown in Shopify:
Product handles:
Variant GraphQL GIDs:
Selling plan GraphQL IDs:
Blog handle, usually news:
```

Do not send Admin API tokens for frontend use. Admin API tokens must stay server-side only.

## 10. Policies, Blog, And Content

Confirm:

```txt
Should policy pages use current local copied content: yes/no
Should policy pages sync from Shopify: yes/no
Final Terms URL:
Final Privacy URL:
Final Refund URL:
Final Shipping URL:
Final Subscription Policy URL:
Blog source: local fallback / Shopify blog
Shopify blog handle:
```

The previous "View source policy" links were removed from the frontend, so users will not be sent to the old policy source pages.

## 11. Environment Variables To Provide Or Confirm

For the current project, likely env values are:

```env
VITE_SHOPIFY_STORE_DOMAIN=mdrnlifeddw.com
VITE_SHOPIFY_GLASS_VARIANT_ID=
VITE_SHOPIFY_PET_VARIANT_ID=
VITE_SHOPIFY_GLASS_SELLING_PLAN_ID=
VITE_SHOPIFY_PET_SELLING_PLAN_ID=
VITE_SHOPIFY_GLASS_SELLING_PLAN_ID_2=
VITE_SHOPIFY_PET_SELLING_PLAN_ID_2=
VITE_SHOPIFY_GLASS_SELLING_PLAN_ID_3=
VITE_SHOPIFY_PET_SELLING_PLAN_ID_3=
VITE_SHOPIFY_STOREFRONT_API_URL=
VITE_SHOPIFY_STOREFRONT_TOKEN=
```

Tracking env values, if we add them as environment variables:

```env
VITE_GA4_MEASUREMENT_ID=
VITE_GOOGLE_ADS_CONVERSION_ID=
VITE_GOOGLE_ADS_CONVERSION_LABEL=
VITE_META_PIXEL_ID=
VITE_TIKTOK_PIXEL_ID=
VITE_KLAVIYO_PUBLIC_KEY=
```

## 12. How To Send Everything To Codex

Send a message like this:

```txt
Store:
- Primary domain:
- .myshopify.com domain:

Products:
- Glass variant ID:
- Glass handle:
- Glass price:
- PET variant ID:
- PET handle:
- PET price:

Subscriptions:
- App:
- Glass selling plan IDs:
- PET selling plan IDs:

Checkout:
- Payments active:
- Shipping active:
- Taxes active:
- Test order approved:

Tracking:
- GA4:
- Google Ads:
- Meta:
- TikTok:
- Klaviyo:

Files attached:
- Glass product image
- PET product image
- Any lab reports or policy files
```

## 13. What I Will Do After You Send It

I will:

1. Update product configuration and variant IDs.
2. Add or replace product images.
3. Add subscription selling plan IDs.
4. Add Storefront API integration if requested.
5. Add tracking pixels/events.
6. Confirm cart checkout URL generation.
7. Test `/products` to `/cart` to Shopify checkout.
8. Test product quantities and removal.
9. Confirm Shopify checkout shows correct product, price, subscription, shipping, and taxes.
10. Report any Shopify admin setting that blocks launch.

## 14. Security Rules

- Do not send Shopify Admin API tokens unless we are building a secure server-side API route.
- Do not put Admin API tokens in `VITE_` variables.
- Do not send owner passwords in chat.
- Storefront API public token is okay for frontend use.
- Variant IDs, selling plan IDs, pixel IDs, and product handles are not secrets.
- Payment processing must stay on Shopify checkout.
