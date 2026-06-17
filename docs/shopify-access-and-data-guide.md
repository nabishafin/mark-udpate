# Shopify Access & Integration Data Guide
**For: Developer (you) — Mdrn-Life DDW Project**
**Purpose: Log into the client's Shopify, collect every value needed, and hand it to Claude to finish the integration.**

---

## PART 1 — Message to Send Your Client RIGHT NOW

Copy and send this to your client before you do anything else.
Replace the bracketed parts with your name/email.

---

> **Subject: Shopify Developer Access — Action Needed Before I Can Start**
>
> Hi,
>
> Thank you for adding me as a developer on your Shopify store. To complete the website integration I need you to confirm or set up the following things on your end. This should take you about 10–15 minutes.
>
> **1. Confirm my staff account has the right permissions.**
> Please go to: Shopify Admin → Settings → Users and permissions → Staff
> Find my account ([YOUR EMAIL]) and make sure these are enabled:
> - Products — View and Edit
> - Orders — View
> - Settings — View
> - Apps and sales channels — Develop apps (this one is critical)
>
> **2. Make sure payments are enabled.**
> Go to: Settings → Payments
> Confirm a payment provider is active (Shopify Payments or another gateway).
> If it says "Set up required" — please complete that before launch.
>
> **3. Make sure shipping is configured.**
> Go to: Settings → Shipping and delivery
> Confirm at least one shipping zone covers the United States with at least one rate.
>
> **4. Make sure taxes are configured.**
> Go to: Settings → Taxes and duties
> Confirm tax collection is active for the United States.
>
> **5. Confirm the store's primary domain.**
> Go to: Settings → Domains
> Tell me the primary domain (example: mdrnlifeddw.com).
>
> **6. Tracking pixels — I need these IDs from you or your marketing team:**
> - Meta Pixel ID (from Meta Business Suite)
> - Google Analytics 4 Measurement ID (starts with G-)
> - Google Ads Conversion ID (starts with AW-)
> - Google Ads Conversion Label
> - TikTok Pixel ID
> - Klaviyo Public API Key
>
> If you don't have any of these yet, just skip them for now and I'll leave placeholders.
>
> **7. Product images.**
> Please send me the final product photos for:
> - Glass bottle (12-pack) — highest resolution you have, any format
> - PET plastic bottle (12-pack) — same
>
> Once I have the above I can finish the integration and test checkout end-to-end.
>
> Thank you,
> [YOUR NAME]

---

## PART 2 — How to Log Into Shopify as a Developer (Using the PIN)

Your client added you as a **staff member** or **collaborator**. Here is exactly how to log in.

### Step 1: Check your email

When your client adds you as a staff member, Shopify sends you an invitation email from `noreply@shopify.com` with the subject:
> "You've been invited to work on [store name]"

Open that email and click **"Accept invitation"**.

If you already accepted the invitation and have a Shopify account, skip to Step 3.

---

### Step 2: Create your Shopify account (first time only)

After clicking the link in the email, Shopify will ask you to create a password for your Shopify partner/staff account. Fill in:
- Your name
- A password you choose

You now have a Shopify login tied to your email address.

---

### Step 3: Log in to the store

Go to: **https://accounts.shopify.com/store-login**

Or go directly to: **https://[storename].myshopify.com/admin**
(Your client should give you the `.myshopify.com` domain, for example `modern-life-water.myshopify.com`)

Enter:
- Email: your email address
- Password: the password you created

---

### Step 4: The PIN your client gave you

The PIN is used if your client enabled **two-step verification** on their account, OR if they are using **collaborator access** through Shopify Partners.

There are two scenarios:

**Scenario A — Your client sent you a 6-digit PIN:**
This is the collaborator request PIN. You use it like this:
1. Go to: **https://www.shopify.com/partners** and log in with your own Shopify Partner account (create one free at partners.shopify.com if you don't have one)
2. In your Partner Dashboard, click **Stores**
3. Click **Add store → Request access to an existing store**
4. Enter the client's `.myshopify.com` URL
5. Enter the 6-digit PIN when prompted
6. Select which permissions you need (select all for now)
7. Submit — your client will get a notification and can approve
8. Once approved, the store appears in your Partner Dashboard under Stores and you click it to enter

**Scenario B — Your client shared their login + a 2FA code:**
This means they gave you their own email/password and the 2FA PIN generator. Log in with their credentials then enter the 2FA PIN when prompted.
**Note:** Ask your client to create a separate staff account for you instead — sharing login credentials is a security risk and Shopify recommends against it.

---

### Step 5: You are now inside Shopify Admin

The URL will look like: `https://admin.shopify.com/store/[storename]/`

You will see the main Shopify dashboard. Everything below tells you exactly where to click to collect each value.

---

## PART 3 — Step-by-Step: Getting Every Value You Need

Work through this list one by one. Each item tells you exactly where to click and what to copy.

---

### Item 1: Confirm the Store Domain

**Why:** The checkout URL is built as `https://[domain]/cart/[variant]:[qty]`. If the domain is wrong, checkout breaks.

**How:**
1. In Shopify Admin, click **Settings** (bottom-left gear icon)
2. Click **Domains**
3. Look at the domain marked **Primary**
4. Copy that domain exactly — for example: `mdrnlifeddw.com`

**What to give Claude:**
```
Store domain: mdrnlifeddw.com
```

---

### Item 2: Glass Bottle Variant ID

**Why:** This is the number that goes into the checkout URL for the Glass product.

**How:**
1. In Shopify Admin, click **Products** (left sidebar)
2. Find the Glass bottle product — it may be called "Mdrn-Life DDW" or "Mdrn-Life DDW Glass"
3. Click on it to open it
4. Scroll down to the **Variants** section
5. Click on the specific variant you sell (e.g. "12 Pack — Glass 16oz")
6. Look at the browser URL bar — it will show something like:
   `https://admin.shopify.com/store/yourstore/products/7654321/variants/41077216739362`
7. The last number in the URL is the **Variant ID** — copy it

**Alternative method (if URL doesn't show it):**
1. On the variant edit page, scroll down to **Inventory**
2. Look for "Shopify variant ID" — it may be listed there

**What to give Claude:**
```
Glass variant ID: 41077216739362
```

---

### Item 3: PET Plastic Bottle Variant ID

**Same steps as Item 2**, but open the PET Plastic product instead.

The product may be called "Mdrn-Life DDW PET Plastic" or similar.

**What to give Claude:**
```
PET variant ID: 41122368749602
```

---

### Item 4: Product Images

**Why:** The website's `/products` page shows product photos. The images folder is currently empty.

**How:**
1. In Shopify Admin, click **Products**
2. Open the Glass product
3. On the right side under **Media**, right-click the main product image → **Save image as** (or download the highest resolution version)
4. Repeat for the PET product
5. Name them:
   - `mdrn-life-ddw-glass.webp` (or .jpg/.png — any format is fine)
   - `mdrn-life-ddw-pet.webp`

**What to give Claude:**
Send the two image files directly in the chat.

---

### Item 5: Meta Pixel ID

**Why:** Tracks Facebook/Instagram ad conversions — Add to Cart, Checkout, Purchase events.

**How:**
1. Go to: **https://business.facebook.com**
2. Log in with the client's Facebook Business account (ask client for access)
3. In the left menu, click **Events Manager**
4. You will see a list of pixels — click the one for this store
5. The Pixel ID is a 15–16 digit number shown at the top, for example: `1234567890123456`

**Alternative — if pixel is already in Shopify:**
1. Shopify Admin → **Settings** → **Customer events**
2. If you see "Meta Pixel" listed there, click it — the Pixel ID is shown

**What to give Claude:**
```
Meta Pixel ID: 1234567890123456
```

---

### Item 6: Google Analytics 4 Measurement ID

**Why:** Tracks all user behavior, product views, and checkout steps in Google Analytics.

**How:**
1. Go to: **https://analytics.google.com**
2. Log in (ask client for Google Analytics access)
3. In the top-left, make sure you are in the correct **Account** and **Property**
4. Click **Admin** (gear icon, bottom-left)
5. Under the **Property** column, click **Data Streams**
6. Click on the web stream for this site
7. The Measurement ID starts with `G-` — for example: `G-XXXXXXXXXX`
8. Copy the full ID including the `G-` prefix

**What to give Claude:**
```
GA4 Measurement ID: G-XXXXXXXXXX
```

---

### Item 7: Google Ads Conversion ID and Label

**Why:** Tracks purchase conversions back to Google Ads campaigns.

**How:**
1. Go to: **https://ads.google.com**
2. Log in (ask client for Google Ads access)
3. In the top menu, click **Goals** → **Conversions** → **Summary**
4. Click on the **Purchase** conversion action (or the main one you want to track)
5. Click **Tag setup** → **Use Google Tag Manager** or **Install the tag yourself**
6. You will see two values:
   - **Conversion ID:** starts with `AW-` — for example `AW-123456789`
   - **Conversion label:** a short string — for example `AbCdEfGhIjK`

**What to give Claude:**
```
Google Ads Conversion ID: AW-123456789
Google Ads Conversion Label: AbCdEfGhIjK
```

---

### Item 8: TikTok Pixel ID

**Why:** Tracks TikTok ad conversions.

**How:**
1. Go to: **https://ads.tiktok.com**
2. Log in (ask client for TikTok Ads access)
3. In the left menu, click **Assets** → **Events**
4. Under **Web Events**, click your pixel
5. The Pixel ID is shown at the top — for example: `CXXXXXXXXXXXXXXXXXX`

**If no TikTok pixel exists yet:** Skip this — leave it blank and add it later.

**What to give Claude:**
```
TikTok Pixel ID: CXXXXXXXXXXXXXXXXXX
```

---

### Item 9: Klaviyo Public API Key

**Why:** Tracks email marketing events — started checkout, placed order.

**How:**
1. Go to: **https://www.klaviyo.com**
2. Log in (ask client for Klaviyo access)
3. In the bottom-left, click your account name → **Settings**
4. Click **API Keys**
5. You will see **Public API Key** (also called Site ID) — it is a 6-character code, for example: `AbCdEf`
6. Copy the Public API Key (NOT the Private API Key — never share or use the private one)

**What to give Claude:**
```
Klaviyo Public Key: AbCdEf
```

---

### Item 10: Confirm Checkout Is Operational

Before I can run the end-to-end test, your client must have these set up.

**Payments:**
1. Shopify Admin → **Settings** → **Payments**
2. Confirm it does NOT say "Setup required" under the payment provider
3. If it does, the client must complete payment setup before launch

**Shipping:**
1. Shopify Admin → **Settings** → **Shipping and delivery**
2. Click **Manage** next to the shipping profile
3. Confirm at least one **Shipping zone** exists covering **United States**
4. Confirm at least one **Rate** is set inside that zone (flat rate, free, carrier-calculated)

**Taxes:**
1. Shopify Admin → **Settings** → **Taxes and duties**
2. Confirm **United States** is listed and enabled

**What to give Claude:**
```
Payments: active / not yet set up
Shipping zones: US covered / not set up
Taxes: configured / not set up
```

---

### Item 11: Storefront API Token (Optional — for live prices)

**Only needed if you want prices and inventory to pull live from Shopify instead of being hardcoded.**

**How:**
1. Shopify Admin → **Settings** → **Apps and sales channels**
2. Click **Develop apps**
3. If you see a warning about enabling development, click **Allow custom app development**
4. Click **Create an app**
5. Name it: `Mdrn-Life External Frontend`
6. Click **Configure Storefront API scopes**
7. Enable these scopes:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_read_selling_plans`
8. Click **Save**
9. Click **Install app**
10. Go to the **API credentials** tab
11. Under **Storefront API access token**, click **Copy**

**What to give Claude:**
```
Storefront API token: shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
API version: 2026-04
```

**Security note:** This token is safe to use in the frontend. It is read-only and public-facing by design. Never copy or share the **Admin API** token — that one must stay server-side only.

---

## PART 4 — Complete Checklist: Everything to Collect

Use this as your collection checklist. Tick each one off as you gather it.

```
REQUIRED FOR LAUNCH
-------------------
[ ] Store domain (confirm: mdrnlifeddw.com)
[ ] Glass bottle variant ID (confirm: 41077216739362 or get the real one)
[ ] PET bottle variant ID (confirm: 41122368749602 or get the real one)
[ ] Glass product image file (any format)
[ ] PET product image file (any format)
[ ] Payments: confirmed active in Shopify
[ ] Shipping zones: US covered with at least one rate
[ ] Taxes: US configured

TRACKING (get from client or their marketing team)
-------------------
[ ] Meta Pixel ID
[ ] GA4 Measurement ID
[ ] Google Ads Conversion ID
[ ] Google Ads Conversion Label
[ ] TikTok Pixel ID
[ ] Klaviyo Public API Key

OPTIONAL (only if client wants live Shopify data)
-------------------
[ ] Storefront API token
[ ] Selling plan IDs (if subscriptions are used)
```

---

## PART 5 — What Happens After You Send Each Item

| Item you send | What Claude builds |
|---|---|
| Variant IDs + domain | Creates `.env.local` file with all env vars |
| Product images | Places them in `/public/products/`, ensures correct file names |
| Meta Pixel ID | Adds Meta Pixel script to `index.html` |
| GA4 Measurement ID | Adds GA4 script + config to `index.html` |
| Google Ads IDs | Adds Google Ads conversion tracking to `index.html` |
| TikTok Pixel ID | Adds TikTok Pixel script to `index.html` |
| Klaviyo Public Key | Adds Klaviyo JS snippet to `index.html` |
| Checkout confirmed | Runs end-to-end test: products → cart → Shopify URL |
| Storefront API token | Builds live price + inventory fetch from Shopify |

---

## PART 6 — Security Rules (Read This)

- **Never paste your client's Admin API token anywhere in this project.** It would expose their entire store.
- **Never share passwords in plain text.** Use a password manager or 1Password to share credentials.
- **The Storefront API token is safe to use in the frontend** — it is read-only and Shopify designed it for public use.
- **Pixel IDs are not secrets** — they are visible in the browser source code of any website using them.
- **Variant IDs are not secrets** — they are part of the public cart URL.
- **Keep `.env.local` out of git** — it is already in `.gitignore` by Vite's default. Never commit it.

---

## PART 7 — What the End-to-End Test Will Look Like

Once everything is in place, here is the test sequence to confirm it all works:

1. Open `http://localhost:5173/products` (dev) or the live URL
2. Click **Add to Cart** on the Glass product
3. You are redirected to `/cart` — confirm the product shows with the correct price
4. Click **Check out**
5. You land on Shopify's checkout — URL should contain the Glass variant ID and quantity
6. Confirm the Shopify checkout shows the correct product, price, shipping, and tax
7. Complete a test order using Shopify's **Bogus Gateway** (Settings → Payments → Test mode)
8. Confirm the order appears in Shopify Admin → Orders
9. Confirm tracking events fired (check browser DevTools → Network tab for pixel calls)
10. Confirm Klaviyo received a "Started Checkout" event

That confirms everything is connected and working end-to-end.
