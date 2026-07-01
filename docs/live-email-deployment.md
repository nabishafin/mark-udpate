# Live Email Deployment

The live host must execute a backend for contact/chat email to work. Static hosting cannot send SMTP mail and returns `405` for `POST /api/email-support`.

Preferred Hostinger Node setup:

1. Upload the full project or connect the repository.
2. Set the app start command to `npm run start`.
3. Set the build command to `npm run build`.
4. Set the app port from Hostinger through `PORT`.
5. Configure these server environment variables:
   - `SMTP_HOST`
   - `SMTP_PORT`
   - `SMTP_USER`
   - `SMTP_APP_PASSWORD`
   - `SUPPORT_EMAIL_TO`
   - `SUPPORT_EMAIL_FROM`
   - `MARKETING_SIGNUP_TO`
   - `SUPPORT_ALLOWED_ORIGINS`
6. Route/proxy the domain to the Node app so `/api/email-support` reaches `server.js`.

Expected checks after deploy:

- `GET /api/email-support` returns JSON `405 Method not allowed`, not React HTML.
- Invalid `POST /api/email-support` returns JSON `400`.
- A real contact form submission returns JSON `200` and delivers to `SUPPORT_EMAIL_TO`.

If using Vercel instead, deploy the same repo and set the same environment variables in Project Settings.
