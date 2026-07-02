# Live Email Deployment

The live host must execute a backend for contact/chat email to work. Static hosting cannot send SMTP mail and returns `405` for `POST /api/contact` or `POST /api/email-support`.

Preferred Hostinger Node setup:

1. Upload the full project or connect the repository.
2. Set the app start command to `npm run start`.
3. Set the build command to `npm run build`.
4. Set the app port from Hostinger through `PORT`.
5. Configure these server environment variables:
   - `VITE_API_URL=http://2.25.199.73:3000` for the direct VPS API target
   - `SMTP_HOST=smtp.gmail.com`
   - `SMTP_PORT=465`
   - `SMTP_USER=support@orisefinance.com`
   - `SMTP_APP_PASSWORD=<set in hosting only>`
   - `SUPPORT_EMAIL_TO=support@orisefinance.com`
   - `SUPPORT_EMAIL_FROM=support@orisefinance.com`
   - `MARKETING_SIGNUP_TO=support@orisefinance.com`
   - `SUPPORT_ALLOWED_ORIGINS=https://mdrnlifeddw.com,https://www.mdrnlifeddw.com`
6. Route/proxy the domain to the Node app so `/api/contact`, `/api/email-support`, and `/api/marketing-signup` reach `server.js`.

Do not commit the real SMTP app password. Keep it in Hostinger/Vercel/server environment variables.

## VPS/nginx Fix For 405

The live error `POST /api/contact -> 405 Method Not Allowed` or `POST /api/email-support -> 405 Method Not Allowed` means nginx is serving the static frontend instead of proxying `/api` to Node.

Use the included config:

```bash
sudo cp deploy/nginx/mdrnlifeddw.com.conf /etc/nginx/sites-available/mdrnlifeddw.com
sudo ln -sf /etc/nginx/sites-available/mdrnlifeddw.com /etc/nginx/sites-enabled/mdrnlifeddw.com
sudo nginx -t
sudo systemctl reload nginx
```

Run the app with PM2:

```bash
npm install
npm run build
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

If SSL is managed separately, keep the same `/api/` proxy block inside the HTTPS `server { listen 443 ssl; ... }` block.

Expected checks after deploy:

- `GET /api/contact` returns JSON `405 Method not allowed`, not React HTML.
- Invalid `POST /api/contact` returns JSON `400` with `success: false` and field errors.
- `GET /api/email-support` returns JSON `405 Method not allowed`, not React HTML.
- Invalid `POST /api/email-support` returns JSON `400`.
- A real contact form submission returns JSON `200` and delivers to `SUPPORT_EMAIL_TO`.

If using Vercel instead, deploy the same repo and set the same environment variables in Project Settings.
