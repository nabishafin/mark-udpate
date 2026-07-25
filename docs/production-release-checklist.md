# Production release and client recovery checklist

## What is automated

Run these from the repaired project root on Windows:

```powershell
npm.cmd ci
npm.cmd test
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run check:secrets
npm.cmd run validate:shopify
npm.cmd run build
npm.cmd run verify:production
```

The build fails if the generated sitemap is malformed, an indexable route is
missing initial HTML, a canonical is wrong, an H1 is missing, JSON-LD is invalid,
or required Product, ItemList, BlogPosting, and Article schema is absent.

`verify:production` tests the real domain for direct-route HTTP status, initial
HTML, canonical tags, schema, security headers, API method behavior, robots,
sitemap, and real 404 behavior. Run it after every deployment.

Windows validation and Linux VPS deployment are separate stages. See
[`windows-vps-deployment.md`](windows-vps-deployment.md) before copying commands
to a terminal.

## Hostinger or server access required

Provide one of the following:

- Temporary Hostinger collaborator access with file manager, Node application,
  environment variables, domains, SSL, and logs; or
- SSH host, port, username, authentication method, deployed project path, and
  confirmation that sudo may be used for nginx and PM2.

The release must upload the new `dist` directory, `server.js`, `api`,
`ecosystem.config.cjs`, and the applicable web-server configuration. For nginx,
copy the built static files to a readable release below
`/var/www/mdrnlifeddw.com/releases`, atomically update the `current` symlink,
install `deploy/nginx/mdrnlifeddw.com.conf`, run `sudo nginx -t`, reload nginx,
restart PM2, and then run `npm.cmd run verify:production` from a trusted
machine. Do not configure nginx to serve files directly from `/root`.

The current VPS runs the hardened application on loopback port `3001`; nginx
proxies `/api/*` to that port. Ports `3000`, `3001`, and `4173` must not be
publicly allowed through UFW because nginx is the only public entry point.

After the application is healthy:

- Run `pm2 save` and configure the `pm2-root` systemd service so the cluster
  returns after a reboot.
- Keep only SSH and nginx HTTP/HTTPS ports publicly allowed in UFW.
- Enable the Fail2ban `sshd` jail with escalating bans.
- Apply Ubuntu security updates and perform a controlled reboot when
  `/var/run/reboot-required` exists.
- After a reboot, repeat `nginx -t`, PM2/systemd checks, socket/firewall checks,
  and `npm.cmd run verify:production`.

Do not send passwords or private keys in chat. Use a temporary collaborator
account or the platform's secret/credential flow.

If a password or API secret has been pasted into chat, committed, emailed, or
included in a ticket, revoke it and create a replacement before deployment.
For this repository, follow
[`credential-rotation.md`](credential-rotation.md) before enabling SMTP.

## DNS, CDN, WAF, and bot protection required

For high-volume and attack resistance, provide Cloudflare account access or
permission to move the domain behind Cloudflare. Configure:

- Proxied DNS for the web origin;
- Managed WAF rules, known-bot handling, and bot protection;
- Rate limits for `/api/*`, login, password reset, cart, and checkout handoff;
- A challenge for abusive traffic and country/ASN rules only when justified;
- Origin access restricted to Cloudflare IP ranges where the host permits it;
- Cloudflare Turnstile site and secret keys if form challenges are required.

Application and nginx limits are defense-in-depth, not a replacement for an
edge WAF or distributed rate-limit service. If multiple origin servers will be
used, provide a managed Redis/Upstash connection so API limits can be shared.

## Server secrets and service access required

Set these only in the hosting environment:

- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_APP_PASSWORD`;
- `SUPPORT_EMAIL_FROM`, `SUPPORT_EMAIL_TO`, `MARKETING_SIGNUP_TO`;
- `SUPPORT_ALLOWED_ORIGINS=https://mdrnlifeddw.com,https://www.mdrnlifeddw.com`;
- `TRUST_PROXY_HEADERS=true` only when the origin is reachable exclusively
  through a trusted proxy that overwrites forwarding headers.

Confirm the Shopify store domain, Storefront API token, glass/PET variant IDs,
selling-plan IDs, current prices, inventory behavior, and checkout domain.
Provide Shopify collaborator access if these must be verified or changed.

## SEO ownership required

Provide Google Search Console owner access for both domain variants. After
deployment:

1. Submit `https://mdrnlifeddw.com/sitemap.xml`.
2. Inspect `/products`, three blog articles, and the Learn pages.
3. Request indexing after the live verification command passes.
4. Review Manual Actions, Security Issues, Page indexing, Core Web Vitals, and
   Enhancements.
5. Confirm the preferred domain and remove stale URLs only after redirects are
   verified.

Provide the GA4 measurement ID and Google Tag Manager container ID if analytics
and conversion tracking are expected. Also provide Meta/TikTok/other pixel IDs
and written consent requirements before enabling them.

## Business and legal confirmation required

The owner or qualified counsel must confirm:

- Legal business name, mailing address, telephone number, support email, and
  governing jurisdiction;
- The real returns rule. Current supplied copy conflicts between “30 days” and
  “all sales are final”;
- Shipping prices, destinations, delivery estimates, and damaged-order process;
- Privacy disclosures, cookie/advertising practices, data-sale statements, and
  opt-out links;
- Subscription renewal/cancellation terms;
- Approval for product, health, performance, recovery, immunity, metabolism,
  brain, anti-aging, and disease-adjacent claims;
- Lab names, report files, batch dates, test results, facility claims, and any
  “lowest ppm,” “USA-made,” or comparative statements.

These items cannot be invented or silently changed by engineering. Until they
are confirmed, treat them as release blockers for a legal/compliance sign-off,
even when the site is technically deployable.

## Scale validation required

Before a high-traffic campaign, provide expected steady and peak requests per
second, geographic distribution, API submission volume, and an approved load
test window. Test a staging hostname—not the live store—using production-like
infrastructure. Define success thresholds for p95 latency, error rate, CPU,
memory, SMTP throughput, Shopify API limits, and origin recovery.
