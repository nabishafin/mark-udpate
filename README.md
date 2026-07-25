# Mdrn-Life DDW Interactive Experience

## Getting Started

1. Run `npm install`
2. Run `npm run dev`

## Release checks

```powershell
npm.cmd test
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
npm.cmd run verify:production
```

The production build generates and validates route-specific initial HTML,
canonical metadata, sitemap XML, and structured data for indexable routes.
`verify:production` checks the deployed domain and is expected to fail until the
new artifact and web-server configuration have been released.

See [docs/production-release-checklist.md](docs/production-release-checklist.md)
for the deployment procedure and the exact access, service, SEO, legal, and
capacity information required from the site owner.

If deploying from Windows to Hostinger, read
[docs/windows-vps-deployment.md](docs/windows-vps-deployment.md). Linux commands
such as `sudo`, `systemctl`, and `/root/...` paths must be run only after signing
in to the VPS. The direct-refresh fix is documented in
[docs/products-403-hotfix.md](docs/products-403-hotfix.md).
