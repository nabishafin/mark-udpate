# Contact Form Handoff

The contact page posts JSON to `/api/contact`. The frontend builds the URL from `VITE_API_URL`:

- Production on the same domain: keep `VITE_API_URL=` blank so the browser posts to `/api/contact`.
- Local frontend with a separate Node backend: set `VITE_API_URL=http://localhost:3000`.
- Production with an external backend domain: set `VITE_API_URL=https://mdrnlifeddw.com`.

The built-in Node/PHP backend sends mail through SMTP. If the client later replaces SMTP with an email API provider such as Resend, SendGrid, Mailgun, or Postmark, keep the same `/api/contact` response contract so the frontend does not need to change.

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

- Store SMTP credentials only as server-side environment variables.
- On Apache/Hostinger/cPanel hosting, fallback routes are provided by `public/api/contact.php`, `public/api/email-support.php`, and `public/api/marketing-signup.php`. Configure the same SMTP variables in the hosting control panel or server environment before uploading the build.
- Do not prefix SMTP credentials with `VITE_`.
- The endpoints validate origin, apply a basic per-IP rate limit, limit payload size, and send customer email as `Reply-To`.
- The opportunity popup uses `/api/marketing-signup` with the same SMTP credentials and emails new leads to `MARKETING_SIGNUP_TO`.
- For higher abuse protection, add Cloudflare Turnstile or Google reCAPTCHA before the SMTP send.
