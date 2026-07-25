# Required SMTP credential rotation

## Incident status

A repository-history audit found a non-empty `SMTP_APP_PASSWORD` in two older
revisions of `.env.example` that are reachable from `origin/main`. A copy was
also pasted into project communication. The credential must be considered
compromised even though the current working tree no longer contains it.

Do not reuse or deploy the exposed password.

## Rotation procedure

1. Sign in to the Google account that owns `support@orisefinance.com`.
2. Open Google Account → Security → 2-Step Verification → App passwords.
3. Revoke the exposed app password.
4. Create a new app password dedicated to `mdrnlifeddw.com production SMTP`.
5. Store the replacement only in Hostinger/server secret environment settings:

   ```text
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=465
   SMTP_USER=support@orisefinance.com
   SMTP_APP_PASSWORD=<new secret supplied through the hosting secret UI>
   SUPPORT_EMAIL_TO=support@orisefinance.com
   SUPPORT_EMAIL_FROM=support@orisefinance.com
   MARKETING_SIGNUP_TO=support@orisefinance.com
   SUPPORT_ALLOWED_ORIGINS=https://mdrnlifeddw.com,https://www.mdrnlifeddw.com
   ```

6. Restart the application without printing its environment:

   ```bash
   cd /root/mark-udpate
   pm2 restart mdrnlifeddw --update-env
   pm2 save
   ```

7. Submit one test through each public form and confirm delivery. Do not test by
   placing the password in a curl command, shell history, screenshot, or log.

## Git history

Credential rotation is mandatory and is what invalidates the leaked value.
History cleanup is optional defense-in-depth because forks, clones, caches, and
communication records cannot be reliably erased.

If the repository owner still wants a history rewrite, coordinate it with every
collaborator before using `git filter-repo` and force-pushing. Do not rewrite
shared history without explicit owner approval.

## Preventing recurrence

`npm run check:secrets` now inspects tracked and unignored files and fails the
build if it detects a non-empty SMTP password, Shopify Admin token, or private
key. Real secrets belong only in the hosting provider's encrypted settings.
