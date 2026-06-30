# Contact Form Handoff

The contact page can still use `VITE_CONTACT_FORM_ENDPOINT` for an external form provider such as Resend, SendGrid, Mailgun, or Postmark. If that variable is blank, the page falls back to a direct email handoff.

The floating support widget now uses the server-side `/api/email-support` endpoint for email support. Required SMTP variables:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_APP_PASSWORD`
- `SUPPORT_EMAIL_TO`
- `SUPPORT_EMAIL_FROM`
- `MARKETING_SIGNUP_TO`
- `SUPPORT_ALLOWED_ORIGINS`

Security notes:

- Store SMTP credentials only as server-side environment variables in Vercel.
- On Apache/Hostinger/cPanel hosting, the same routes are provided by `public/api/email-support.php` and `public/api/marketing-signup.php`. Configure the same SMTP variables in the hosting control panel or server environment before uploading the build.
- Do not prefix SMTP credentials with `VITE_`.
- The endpoint validates same-origin requests, applies a basic per-IP rate limit, limits payload size, uses a honeypot field, and sends customer email as `Reply-To`.
- The opportunity popup uses `/api/marketing-signup` with the same SMTP credentials and emails new leads to `MARKETING_SIGNUP_TO`.
- For higher abuse protection, add Cloudflare Turnstile or Google reCAPTCHA before the SMTP send.
