# Deploying from Windows to the Hostinger VPS

There are two separate machines in this deployment. Check the prompt before
running a command.

| Prompt example | Machine | Use it for |
| --- | --- | --- |
| `C:\Users\...\mark-udpate>` or `PS C:\...>` | Windows development computer | Validate, build, commit, and push |
| `root@server:~#` | Linux VPS | Pull, build, install nginx config, and restart |

## 1. Validate the repaired project on Windows

Run this in the repaired project directory, not an older clone:

```powershell
npm.cmd ci
npm.cmd test
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run check:secrets
npm.cmd run validate:shopify
npm.cmd run build
Test-Path .\dist\products\index.html
```

The final command must print `True`. The repaired build output also reports
secret scanning, sitemap generation, prerendering, and SEO validation. If the
output only says `vite build`, the command is running in the old project.

## 2. Publish the repaired commit

The deployment server cannot pull local, uncommitted files. A release owner
must first review the diff, commit it, and push it to the branch deployed by the
VPS. Confirm the remote and branch before pushing:

```powershell
git status --short
git remote -v
git branch --show-current
```

Do not commit `.env`, passwords, tokens, private keys, or a production database.

## 3. Sign in to the VPS

Use Hostinger's browser terminal, or run this from Windows:

```powershell
ssh root@2.25.199.73
```

Continue only after the prompt changes to a Linux VPS prompt such as
`root@server:~#`. SSH access requires an authorized key or password configured
by the server owner.

## 4. Deploy on the VPS

These commands are Linux-only:

```bash
cd /root/mark-udpate
git pull origin main
npm ci
npm run build
test -f /root/mark-udpate/dist/products/index.html

release_id="$(date -u +%Y%m%d%H%M%S)"
release_dir="/var/www/mdrnlifeddw.com/releases/$release_id"
sudo install -d -m 0755 -o root -g www-data /var/www/mdrnlifeddw.com/releases
sudo install -d -m 0755 -o root -g www-data "$release_dir"
sudo cp -a dist/. "$release_dir/"
sudo chown -R root:www-data "$release_dir"
sudo find "$release_dir" -type d -exec chmod 755 {} +
sudo find "$release_dir" -type f -exec chmod 644 {} +
sudo ln -sfn "$release_dir" /var/www/mdrnlifeddw.com/current.next
sudo mv -Tf /var/www/mdrnlifeddw.com/current.next /var/www/mdrnlifeddw.com/current

sudo cp deploy/nginx/mdrnlifeddw.com.conf /etc/nginx/sites-available/mdrnlifeddw.com
sudo ln -sf /etc/nginx/sites-available/mdrnlifeddw.com /etc/nginx/sites-enabled/mdrnlifeddw.com
sudo nginx -t
sudo systemctl reload nginx

pm2 restart mdrnlifeddw --update-env
pm2 save
```

If the deployed service has a different PM2 name or project path, use the
values shown by `pm2 list` and `pwd` rather than guessing.

The timestamped `/var/www` release and atomic `current` symlink avoid partial
static deployments and avoid nginx permission failures caused by serving files
from `/root`.

## 5. Verify the live release

From Windows:

```powershell
npm.cmd run verify:production
curl.exe -I https://mdrnlifeddw.com/products/
```

The direct product route must return `200`, not `403`, and the complete
production verifier must pass before the release is considered complete.
