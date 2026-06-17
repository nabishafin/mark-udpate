# Contact Form Handoff

The contact page UI is built, but a real form endpoint is required before the form can send messages in production.

## Required Inputs

1. Form submission endpoint
   - Recommended: a Vercel Serverless Function, Formspree endpoint, Netlify Forms endpoint, HubSpot form endpoint, Klaviyo form endpoint, or custom backend endpoint.
   - Environment variable: `VITE_CONTACT_FORM_ENDPOINT`.

2. Destination inbox
   - Main support email.
   - Wholesale or practitioner inquiry email, if separate.
   - Lab report request email, if separate.

3. Email provider
   - Resend, SendGrid, Mailgun, Postmark, HubSpot, Klaviyo, or another approved provider.
   - API key must stay server-side only. Do not expose email provider secrets in Vite frontend variables.

4. Spam protection
   - Cloudflare Turnstile or Google reCAPTCHA site key and secret.
   - Honeypot field rules if the client wants a no-CAPTCHA flow.

5. CRM or marketing routing
   - Whether messages should create HubSpot, Klaviyo, Shopify customer, or CRM records.
   - Topic mapping for product questions, lab report requests, wholesale inquiries, subscription support, and practitioner inquiries.

6. Legal and compliance details
   - Privacy policy URL.
   - Consent checkbox copy if marketing follow-up is allowed.
   - Data retention requirement.

7. Success and failure behavior
   - Final success message.
   - Error message.
   - Whether the user should receive an auto-reply.

## Production Recommendation

Use a small serverless API route on Vercel to receive the form, validate fields, verify spam protection, and send the message through Resend or Postmark. The frontend should never hold private API keys.
