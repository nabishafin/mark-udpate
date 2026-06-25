# Shopify Integration: Collected Info And Remaining Items

Use this as the current handoff document for connecting the Mdrn-Life DDW website to Shopify.

Last updated: June 25, 2026

## Integration Status

The store identity and several product details are now captured from the Shopify admin screenshots and notes you provided.

The current website can already point users to Shopify product/checkout URLs, but a full, clean Shopify integration still needs the exact sellable variant IDs, subscription selling plan IDs, and checkout/shipping/tax confirmation. Payment provider details are captured, but test mode must be turned off before real customer orders can be accepted.

## Store Details Already Provided

```txt
Shopify admin/store name: Orise
Primary domain: mdrnlifeddw.com
.myshopify.com domain: orise-6796.myshopify.com
Store contact email: support@orisefinance.com
Support email: not provided yet
Phone: 9544105042
Business address: 1830 N University Drive, 275, Plantation Florida 33322, United States
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
Test mode: On
Real transactions currently possible: No
Test orders currently possible: Yes
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

Launch note: Shopify shows the warning "All transactions are simulated and customers can't make real purchases through authorize.net." Before launch, turn test mode off and save the payment settings.

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

Variant: 6 Pack Glass bottle 16oz.
SKU/code shown: 1833
Price: $86.65
Available: -2

Total inventory shown: 48 available
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

Variant: 6 Pack PET plastic bottle 16oz.
SKU/code shown: 1831
Price: $80.65
Available: 0

Total inventory shown: 847 available
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

### 3. Wholesale Mdrn-Life DDW Glass (6 Pack)

```txt
Shopify admin product ID: 7209202941986
Product title: Wholesale Mdrn-Life DDW Glass (6 Pack)
Status: Active
Storefront URL: https://mdrnlifeddw.com/products/wholesale-mdrn-life-ddw-glass-6-pack
Product type: Deuterium depleted water
Vendor: Orise Finance
Collection: Wholesale
Theme template: Default product
Price: $88.65
Inventory tracking: not tracked
```

Visible shipping data:

```txt
Physical product: yes
Package: Store default - default package - 12 x 9 x 9 in, 1.9 lb
Product weight: 7.0 lb
Country of origin: US
HS Code: 2201.10.0000
```

Visible product description headline:

```txt
Modern-Life 5ppm Deuterium-depleted Water, Alkaline 9.5+ PH, 500 mL, 16.9 FL oz. (6 Pack)
```

### 4. Wholesale Mdrn-Life DDW Glass (12 Pack)

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
Glass default variant ID in code: 41077216739362

PET product URL: https://mdrnlifeddw.com/products/mdrn-life-ddw-pet-plastic?variant=41122368749602
PET display price: $152.75
PET default variant ID in code: 41122368749602
```

Important: the screenshots confirm product IDs and SKU/code values such as `1830`, `1831`, `1835`, and `1833`. Those are not enough to replace the numeric Shopify variant IDs. The website checkout needs the long numeric variant ID from the variant URL.

## Still Needed Before Final Integration

Please collect and send these remaining items:

```txt
Support email, if different from support@orisefinance.com:
Business/legal company name:
Launch countries/markets:

Glass 12-pack numeric variant ID:
Glass 6-pack numeric variant ID:
PET 12-pack numeric variant ID:
PET 6-pack numeric variant ID:

Confirm active website products:
- Should the website sell only the retail Glass 12-pack and PET 12-pack?
- Should the website also sell the 6-pack variants?
- Should wholesale products be hidden, linked, password-protected, or public?

Subscription app name:
Glass selling plan ID(s):
PET selling plan ID(s):
Subscription discount:
Subscription frequencies:

Permission for Codex to place a test order: yes/no
Confirm test mode will be turned off before launch: yes/no

Shipping zones configured: yes/no
US shipping rate configured: yes/no
International shipping countries:
Taxes configured: yes/no
Markets configured: yes/no

GA4 Measurement ID:
Google Ads Conversion ID:
Google Ads Conversion Label:
Meta Pixel ID:
TikTok Pixel ID:
Klaviyo public key/site ID:
```

## Where To Get The Missing Values

### Numeric Variant IDs

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
```

Repeat this for every variant the website should sell.

### Subscription Selling Plan IDs

1. In Shopify admin, go to **Apps**.
2. Open the subscription app.
3. Find the Mdrn-Life DDW product plans.
4. Open each plan/frequency.
5. Copy the selling plan ID if the app shows it.
6. If the ID is not visible, send screenshots of the subscription app product settings and plan settings.

Send:

```txt
Subscription app:
Glass selling plan ID:
PET selling plan ID:
Frequency:
Discount:
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
Some retail Glass inventory shows a 6-pack variant with -2 available.
```

Please confirm whether these are intentional before final launch.

## What Codex Will Do After You Provide The Remaining Items

Once the missing IDs and checkout settings are provided, I can:

```txt
1. Update the website Shopify product config.
2. Add all selected variant IDs.
3. Add subscription selling plan IDs.
4. Confirm one-time and subscription checkout links.
5. Verify mobile and desktop product purchase flows.
6. Confirm policy/contact/footer store details match Shopify.
7. Run the project tests and production build.
8. Give you the final launch checklist.
```
