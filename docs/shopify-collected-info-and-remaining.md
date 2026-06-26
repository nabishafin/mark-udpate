# Shopify Integration: Collected Info And Remaining Items

Use this as the current handoff document for connecting the Mdrn-Life DDW website to Shopify.

Last updated: June 25, 2026

## Integration Status

The store identity and several product details are now captured from the Shopify admin screenshots and notes you provided.

The current website now has the core Shopify values needed for retail 12-pack one-time checkout, subscription checkout handoff, and Storefront API blog reads. Final launch still needs a real checkout test after Shopify test mode is enabled or a low-risk real payment is approved.

## Current Availability Snapshot

Use this section as the fastest read on what is already available and what still needs to be provided.

### Available Now

```txt
Store/admin identity: available
Primary domain: available
.myshopify.com domain: available
Store contact/support email: available
Phone/address/store defaults: available
Retail product titles/prices: available
Retail 12-pack variant IDs: available
Active website product decision: available; sell retail Glass 12-pack and PET 12-pack only
Wholesale access decision: available; only customers with a Shopify wholesale tag should see wholesale options after full Shopify/customer integration
Payment provider: available; authorize.net active
Payment test mode status: available; test mode is off
Shipping profile overview: partially available from screenshots
Markets: available; United States and International are active
Customer Events app pixel connections: available from screenshots
Google account, Merchant Center, Google Ads account, and GA4 Measurement ID: available
Storefront API token: received; not stored in this document
Storefront API endpoint: available
Appstle Subscription selling plan IDs: available
Product images in project: available
Policy page content in project: available
```

### Not Yet Available / Still Needed

```txt
Permission for Codex/developer to place a test order
Confirmation that retail Glass 12-pack and PET 12-pack are assigned to the correct shipping profile
Google Ads purchase conversion label, only if adding frontend Google Ads conversion events outside Shopify
Raw Meta Pixel ID, TikTok Pixel ID, and Klaviyo public key, only if adding direct frontend scripts outside Shopify
Wholesale customer-account flow requirements, if wholesale visibility must be implemented on this external site
```

### Current Launch Risk

```txt
One-time retail checkout can be wired through Shopify cart permalinks with the active 12-pack variant IDs.
Subscription checkout has selling plan IDs implemented, but still needs test checkout verification.
Shipping rates are captured, but product assignment needs confirmation because the 12-pack shipping profile currently shows 0 products.
Taxes are configured for United States collection; final tax behavior should still be verified in test checkout.
Markets are active for United States and International; international checkout should be reviewed because duties/import taxes are not configured.
```

## Store Details Already Provided

```txt
Shopify admin/store name: Orise
Primary domain: mdrnlifeddw.com
.myshopify.com domain: orise-6796.myshopify.com
Store contact email: support@orisefinance.com
Support email: support@orisefinance.com
Phone: 9544105042
Business address: 1830 N University Drive, 275, Plantation Florida 33322, United States
Business/legal entity: Orise, Single member LLC
Currency: US Dollar (USD $)
Backup region: United States
Unit system: Imperial System
Default weight unit: Pound (lb)
Time zone: (GMT-05:00) Eastern Time (US & Canada)
```

## Payment Details Already Provided

```txt
Payment provider: authorize.net
Provider status: Active
Test mode: Off
Real transactions currently possible: Yes
Test orders currently possible: No, unless test mode is turned back on or a real low-risk test payment is used
```

Visible payment methods:

```txt
Visa: enabled
Mastercard: enabled
American Express: enabled
JCB: enabled
Discover: enabled
Diners Club: enabled
Apple Pay: disabled
Google Pay: enabled
```

Launch note: authorize.net is active and test mode appears off in the June 26, 2026 screenshot. A final real checkout should still be tested with client approval.

## Store Operations Details Captured From Screenshots

```txt
Order ID prefix: #
Order ID suffix: none
Example order IDs: #1001, #1002, #1003
After order has been paid: do not fulfill any line items automatically
After order has been fulfilled and paid, or all items refunded: automatically archive the order
Metafields: available in themes and configurable for Storefront API
Brand assets: available under Store assets
```

## Shipping And Tax Details Captured From Screenshots

Shipping screenshots from June 25, 2026 show the store is using multiple shipping profiles.

```txt
Shipping profiles visible: 6 profiles
Store default / General profile: all other products, 0 of 1 locations, 0 zones
Custom profile - Domestic: 0 products, 1 of 1 location, 1 zone
Custom profile - Modern-Life DD Water (12 Pack): 0 products, 1 of 1 location, 1 zone
Custom profile - VIP Product: 2 products, 1 of 1 location, 2 zones
Appstle Subscription profile - free shipping: 4 products, 1 of 1 location, 1 zone
Packages configured: 5 boxes
Estimated delivery dates: Manual dates
Shipping labels: none
Carrier accounts: none
Local delivery: off
Pickup in store: off
Delivery customizations: none shown
Custom fulfillment service: none shown
```

Shipping rate screenshots from June 26, 2026 show these details:

```txt
Profile: Modern-Life DD Water (12 Pack)
Products assigned: 0 products
Fulfillment location: 1830 N University Drive 275, Plantation Florida 33322, United States
Shipping zone: Domestic - United States (53 of 62 states)
Rate: Standard, 3-4 business days, $21.00

Profile: Appstle Subscription / free shipping
Products assigned: 4 products
Fulfillment location: 1830 N University Drive 275, Plantation Florida 33322, United States
Shipping zone: Domestic - United States
Rate: Express, orders $124.50-$171.90, 1-2 business days, $65.80
Rate: Express, orders $173.00-$285.90, 1-2 business days, $130.00
Rate: Standard, 3-4 business days, Free
```

Launch note: shipping rates are captured, but the retail 12-pack profile currently shows **0 products assigned**. Confirm whether the active retail Glass 12-pack and PET 12-pack products are intentionally handled through the Appstle Subscription profile or another profile before launch.

Tax screenshots from June 26, 2026 show these details:

```txt
Tax service: Shopify tax services, Active
Collecting taxes: United States
United States tax service: Shopify Tax
Other tax regions visible but not collecting:
- Australia: Basic Tax
- Canada: Basic Tax
- European Union: Shopify Tax
- Hong Kong SAR: Manual Tax
- Israel: Manual Tax
- Japan: Manual Tax
- Malaysia: Manual Tax
- New Zealand: Basic Tax
- Norway: Basic Tax
- Rest of World: Manual Tax
- Singapore: Manual Tax
- South Korea: Manual Tax
- Switzerland: Basic Tax
- United Arab Emirates: Manual Tax

Duties and import taxes: not set up
Customs country of origin: included in 6 out of 6 variants, no default set
Harmonized System (HS) codes: included in 6 out of 6 variants
Include sales tax in product price and shipping rate: off
Charge sales tax on shipping: on
Charge VAT on digital goods: off
```

Tax launch note: United States tax collection is active and sales tax on shipping is enabled. Duties/import taxes are not configured, so international checkout should be reviewed before opening non-US markets.

## Markets Captured From Screenshots

Markets screenshots from June 26, 2026 show:

```txt
Market: United States
Status: Active
Includes: United States
Catalog: United States, Active, 4 products
Price overrides: none
Overall adjustment: none

Market: International
Status: Active
Includes: 27 regions
Catalog: International, Active, 4 products
Price overrides: none
Overall adjustment: none
```

Markets launch note: International is active, but duties/import taxes are not configured. Review international checkout before launch if non-US customers should be able to buy.

## Tracking And Customer Events Captured From Screenshots

Shopify Customer Events screenshots from June 25, 2026 show the following app pixels are connected.

```txt
Collabs: Connected, Optimized
Facebook & Instagram: Connected, Optimized
Google & YouTube: Connected, Optimized
Judge.me Reviews: Connected, Always on
Klaviyo: Email Marketing & SMS: Connected, Optimized
Microsoft Channel: Connected, Optimized
Pinterest: Connected, Optimized
Taboola Pixel: Connected, Optimized
TikTok: Connected, Optimized
UpPromote Affiliate: Connected, Always on
Vibe: Connected, Optimized
```

Google & YouTube connection details:

```txt
Connected Google account: 566fires@gmail.com
Google Merchant Center: 606547321
Google Ads account: 1546661380 (Orise)
Google Analytics Measurement ID: G-BM519E3DH2
Google Analytics property shown: Orise Finance Property
Google Business Profile: not connected; account shown as 566fires@gmail.com
```

TikTok connection details:

```txt
TikTok Ads Manager account: orise-6796.myshopify.com Shopify0820
TikTok Account ID: 7269459945404383233
TikTok payment method: Visa ending 5933, exp 10/29
```

Launch note: Shopify-side app pixels are connected, so checkout/purchase tracking should flow through Shopify Customer Events if each app is configured correctly. The website frontend still only calls tracking globals if their scripts are loaded; the current `index.html` does not hardcode pixel scripts. Prefer keeping final checkout/purchase pixels in Shopify Customer Events because checkout happens on Shopify.

## Storefront API Details

The Storefront API token has been received and tested successfully against Shopify on June 26, 2026. Do not store the token in this document or commit it to git.

```txt
Storefront API endpoint: https://orise-6796.myshopify.com/api/2026-04/graphql.json
Storefront API token: received; store only in local `.env.local` and Vercel environment variables
```

## Product Details Captured From Screenshots

### 1. Mdrn-Life DDW Glass

```txt
Shopify admin product ID: 7200463224866
Product title: Mdrn-Life DDW Glass
Status: Active
Storefront URL: https://mdrnlifeddw.com/products/mdrn-life-ddw
Product type: Deuterium depleted water
Vendor: Orise
Collection: Mdrn-Life DDW
Theme template: gem-1688163713-template
Main visible price: $166.90 USD
Product metafield - Benefits: More Energy from ATP
```

Visible variant data:

```txt
Option: 16 oz. Glass
Variant: 12 Pack Glass Bottle 16oz.
SKU/code shown: 1835
Price: $166.90
Available: 50
```

Visible shipping data:

```txt
Physical product: yes
Package: Store default - default package - 12 x 9 x 9 in, 1.9 lb
Country of origin: US
HS Code: 2201.10.0000
```

Visible product description themes:

```txt
5 ppm deuterium-depleted drinking water
Natural artesian well source
Low-Temperature Vacuum Rectification
Alkaline 9.5+ pH
Zero additives
Zero chemicals
Subscription section: Subscribe & Commit to Your Cellular Health
Delivery cadence: Therapeutic Protocol every 3 weeks, Daily Optimizer every 4 weeks, Lifestyle Supplement every 6 weeks
```

### 2. Mdrn-Life DDW PET Plastic

```txt
Shopify admin product ID: 7216813408290
Product title: Mdrn-Life DDW PET Plastic
Status: Active
Storefront URL: https://mdrnlifeddw.com/products/mdrn-life-ddw-pet-plastic
Product type: Deuterium depleted water
Vendor: Orise
Collection: Mdrn-Life DDW
Category: Beverages in Food, Beverages & Tobacco
Suggested category shown: Distilled Water in Water
Theme template: gem-1688163713-template
```

Visible variant data:

```txt
Option label shown: 16 oz. Glass
Note: this option label appears inconsistent because the variants are PET bottles. Please confirm whether the option should be renamed in Shopify.

Variant: 12 Pack PET plastic Bottle 16oz.
SKU/code shown: 1830
Price: $152.75
Available: 847
```

Visible product description headline:

```txt
Modern-Life 5ppm Deuterium-depleted Water, Alkaline 9.5+ PH, 500 mL, 16.9 FL oz.
```

Visible purchase options:

```txt
Monthly Subscription Plan - Monthly
PET Plastic bottle - Monthly
Monthly Subscription Plan bata:
- Standard daily hydration habit
- High-dilution, clinical or intensive use
- Travel, occasional or maintenance use
```

## Subscription Selling Plan IDs Captured From Storefront API

These values were queried from Shopify Storefront API on June 26, 2026.

The current active Appstle plan for the website should be **Monthly Subscription Plan bata**.

```txt
Subscription app: Appstle Subscription
Plan name: Monthly Subscription Plan bata
Products attached:
- Mdrn-Life DDW Glass
- Mdrn-Life DDW PET Plastic

Standard daily hydration habit:
- Frequency: Every 1 month
- Discount: Save 10%
- Storefront GID: gid://shopify/SellingPlan/27086716962
- Numeric selling plan ID: 27086716962

High-dilution, clinical or intensive use:
- Frequency: Every 3 weeks
- Discount: Save 10%
- Storefront GID: gid://shopify/SellingPlan/27086749730
- Numeric selling plan ID: 27086749730

Travel, occasional or maintenance use:
- Frequency: Every 6 weeks
- Discount: Save 8%
- Storefront GID: gid://shopify/SellingPlan/27086782498
- Numeric selling plan ID: 27086782498
```

These same selling plan IDs are available on both the Glass and PET products.

### 3. Wholesale Mdrn-Life DDW Glass (12 Pack)

```txt
Shopify admin product ID: 7209202286626
Product title: Wholesale Mdrn-Life DDW Glass (12 Pack)
Status: Active
Storefront URL: https://mdrnlifeddw.com/products/wholesale-mdrn-life-ddw-glass-12-pack
Product type: Deuterium depleted water
Vendor: Orise Finance
Collection: Wholesale
Price: $161.90
Inventory tracking: not tracked
```

Visible shipping data:

```txt
Physical product: yes
Package: Store default - default package - 12 x 9 x 9 in, 1.9 lb
Product weight: 17.0 lb
Country of origin: US
HS Code: 2201.10.0000
```

Visible product description headline:

```txt
Modern-Life 5ppm Deuterium-depleted Water, Alkaline 9.5+ PH, 500 mL, 16.9 FL oz. (12 Pack)
```

## Current Website Values Already Matching Shopify

The current project already contains these frontend product values:

```txt
Glass product URL: https://mdrnlifeddw.com/products/mdrn-life-ddw
Glass display price: $166.90
Glass 12-pack variant ID confirmed and active: 41077216739362

PET product URL: https://mdrnlifeddw.com/products/mdrn-life-ddw-pet-plastic?variant=41122368749602
PET display price: $152.75
PET 12-pack variant ID confirmed and active: 41122368749602
```

Important: the screenshots confirm product IDs and SKU/code values such as `1830` and `1835`. Those are not enough to replace the numeric Shopify variant IDs. The website checkout needs the long numeric variant ID from the variant URL.

## Still Needed Before Final Integration

Please collect and send only these remaining items. Values already captured above do not need to be resent unless they change.

```txt
Permission for Codex to place a test order: yes/no
Confirm test order method: real low-risk payment / temporarily re-enable test mode / no test order

Shipping zones configured: yes; domestic United States zone shown
US shipping rate configured: yes; $21 standard rate on 12-pack profile and free/express rates on Appstle profile
Retail 12-pack product assignment to shipping profile: needs confirmation; 12-pack profile shows 0 products
International shipping countries: not shown
Taxes configured: yes; United States collecting via Shopify Tax
Markets configured: yes; United States and International active

Google Ads Conversion Label, only if adding frontend Google Ads events:
Meta Pixel ID, only if adding direct frontend Meta script:
TikTok Pixel ID, only if adding direct frontend TikTok script:
Klaviyo public key/site ID, only if adding direct frontend Klaviyo script:
```

## Where To Get The Missing Values

### Numeric Variant IDs, Already Collected

These are no longer missing, but this is how to re-check them if needed:

1. In Shopify admin, go to **Products**.
2. Open the product, for example **Mdrn-Life DDW Glass**.
3. Scroll to **Variants**.
4. Click the exact variant, for example **12 Pack Glass Bottle 16oz.**
5. Look at the browser URL.
6. Copy the number after `/variants/`.

Example:

```txt
https://admin.shopify.com/store/orise-6796/products/7200463224866/variants/41077216739362
```

Send:

```txt
Glass 12-pack numeric variant ID: 41077216739362
PET 12-pack numeric variant ID: 41122368749602
```

The current external website should sell only the retail 12-pack products.

### Subscription Selling Plan IDs, Already Collected

These are no longer missing. If they ever need to be rechecked:

1. Use the Storefront API endpoint and token.
2. Query product handles `mdrn-life-ddw` and `mdrn-life-ddw-pet-plastic`.
3. Read `sellingPlanGroups` and `sellingPlans`.

Current values:

```txt
Standard daily hydration habit: 27086716962
High-dilution, clinical or intensive use: 27086749730
Travel, occasional or maintenance use: 27086782498
```

### Payments

1. Go to **Settings**.
2. Click **Payments**.
3. Confirm whether a provider is active.
4. Confirm whether test mode is enabled.

Send:

```txt
Payments active:
Provider:
Test mode enabled:
Can Codex run a test order:
```

### Shipping And Taxes

1. Go to **Settings**.
2. Click **Shipping and delivery**.
3. Open the active shipping profile.
4. Confirm US shipping rates and any international zones.
5. Go back to **Settings**.
6. Click **Taxes and duties**.
7. Confirm tax setup.

Send:

```txt
Shipping zones active:
US shipping rate active:
International shipping:
Taxes configured:
```

### Markets

1. Go to **Settings**.
2. Click **Markets**.
3. Confirm which countries are active for launch.

Send:

```txt
Active markets:
```

### Tracking Pixels

1. Go to **Settings**.
2. Click **Customer events**.
3. Copy the configured pixel IDs.
4. Also check any installed apps such as Google & YouTube, Meta, TikTok, or Klaviyo.

Send only public IDs. Do not send private API keys in chat.

## Things To Verify In Shopify

These items looked inconsistent or unclear in the screenshots:

```txt
PET product option label says "16 oz. Glass" even though variants are PET plastic bottles.
Wholesale 12-pack screenshot shows a main product price of $161.90, but the variant table shows 12 Pack Glass Bottle 16oz. at $166.90.
Wholesale product vendors vary between Orise and Orise Finance.
Some purchase options mention "PET Plastic bottle" even while viewing Glass products.
```

Please confirm whether these are intentional before final launch.

## What Codex Will Do After You Provide The Remaining Items

Once test mode is enabled or a real low-risk test order is approved, I can:

```txt
1. Confirm one-time and subscription checkout links.
2. Verify mobile and desktop product purchase flows.
3. Confirm policy/contact/footer store details match Shopify.
4. Verify shipping, taxes, markets, and payment status from Shopify checkout.
5. Give you the final launch checklist.
```
