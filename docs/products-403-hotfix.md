# Fixing the live `/products/` 403

> **Important:** The commands in the "On the VPS" section are Linux commands.
> Run them only after signing in to the Hostinger browser terminal or SSH and
> seeing a prompt similar to `root@server:~#`. Do not run them at a Windows
> prompt such as `C:\Users\...\mark-udpate>`.

## Cause

The deployed build contains a physical `/products/` directory for product
images. The old live nginx rule uses:

```nginx
try_files $uri $uri/ /index.html;
```

For `/products`, nginx sees that directory, redirects to `/products/`, and then
tries to serve/list the directory. Directory listing is disabled, so nginx
returns `403 Forbidden` before React or Node receives the request.

## Permanent fix

Deploy the latest build and the repository nginx configuration. The new build
contains `dist/products/index.html`, and the nginx configuration contains exact
rules for both URL forms.

Before running `git pull`, the repaired changes must be committed and pushed to
the branch that the VPS deploys. `git pull` reporting `Already up to date` only
means the remote branch has no newer commit; it does not include uncommitted
files from another computer or Codex workspace.

On the VPS:

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

The essential nginx rules are:

```nginx
location = /products {
    try_files /products/index.html /index.html =500;
}

location = /products/ {
    try_files /products/index.html /index.html =500;
}
```

Do not use `try_files $uri $uri/ /index.html` for this route.

The nginx document root is `/var/www/mdrnlifeddw.com/current`, not
`/root/mark-udpate/dist`. On Ubuntu, the nginx worker commonly cannot traverse
the root user's home directory. The release commands copy the verified build
to a readable timestamped directory and switch the `current` symlink
atomically.

## Verification

```bash
curl -sS -o /dev/null -w '%{http_code}\n' https://mdrnlifeddw.com/products
curl -sS -o /dev/null -w '%{http_code}\n' https://mdrnlifeddw.com/products/
curl -sS https://mdrnlifeddw.com/products/ | grep -F '<h1>Buy 5 ppm Deuterium Depleted Water</h1>'
```

Both status checks must print `200`, and the final command must find the
prerendered product H1.

## Windows versus VPS commands

Use Windows PowerShell or Command Prompt only for local validation:

```powershell
cd "C:\path\to\the\repaired\mark-udpate"
npm.cmd ci
npm.cmd test
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
Test-Path .\dist\products\index.html
```

`Test-Path` must print `True`. The Linux commands `test -f`, `sudo`, `systemctl`,
`nginx`, and `/root/...` paths do not work in Windows.

To reach the server from Windows, use the Hostinger browser terminal or:

```powershell
ssh root@2.25.199.73
```

Authentication must succeed before running any VPS command. Do not paste a
password or private SSH key into project files, Git, or chat.
