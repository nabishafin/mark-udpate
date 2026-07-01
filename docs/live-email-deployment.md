# Live Email Deployment

The live host must execute a backend for contact/chat email to work. Static hosting cannot send SMTP mail and returns `405` for `POST /api/email-support`.

Preferred Hostinger Node setup:

1. Upload the full project or connect the repository.
2. Set the app start command to `npm run start`.
3. Set the build command to `npm run build`.
4. Set the app port from Hostinger through `PORT`.
5. Configure these server environment variables:
   - `VITE_CONTACT_FORM_ENDPOINT=/api/email-support`
   - `SMTP_HOST=smtp.gmail.com`
   - `SMTP_PORT=465`
   - `SMTP_USER=support@orisefinance.com`
   - `SMTP_APP_PASSWORD=<set in hosting only>`
   - `SUPPORT_EMAIL_TO=support@orisefinance.com`
   - `SUPPORT_EMAIL_FROM=support@orisefinance.com`
   - `MARKETING_SIGNUP_TO=support@orisefinance.com`
   - `SUPPORT_ALLOWED_ORIGINS=https://mdrnlifeddw.com,https://www.mdrnlifeddw.com`
6. Route/proxy the domain to the Node app so `/api/email-support` reaches `server.js`.

Do not commit the real SMTP app password. Keep it in Hostinger/Vercel/server environment variables.

Expected checks after deploy:

- `GET /api/email-support` returns JSON `405 Method not allowed`, not React HTML.
- Invalid `POST /api/email-support` returns JSON `400`.
- A real contact form submission returns JSON `200` and delivers to `SUPPORT_EMAIL_TO`.

If using Vercel instead, deploy the same repo and set the same environment variables in Project Settings.
