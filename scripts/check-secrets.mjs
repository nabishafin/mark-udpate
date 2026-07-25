import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

const root = process.cwd();
const files = execFileSync(
  'git',
  ['ls-files', '--cached', '--others', '--exclude-standard', '-z'],
  { cwd: root, encoding: 'utf8' },
).split('\0').filter(Boolean);

const findings = [];
const placeholder = /^(?:|your[_ -]|replace[_ -]|example|changeme|<.*>)$/i;

for (const filename of files) {
  let content;
  try {
    content = readFileSync(resolve(root, filename), 'utf8');
  } catch {
    continue;
  }

  for (const [index, line] of content.split(/\r?\n/).entries()) {
    const smtp = line.match(/^\s*SMTP_APP_PASSWORD\s*=\s*(.+?)\s*$/);
    if (smtp && !placeholder.test(smtp[1])) {
      findings.push(`${filename}:${index + 1} contains a non-empty SMTP app password`);
    }

    const admin = line.match(/^\s*SHOPIFY_ADMIN_ACCESS_TOKEN\s*=\s*(.+?)\s*$/);
    if (admin && !placeholder.test(admin[1]) && !/your_real_token/i.test(admin[1])) {
      findings.push(`${filename}:${index + 1} contains a Shopify Admin access token`);
    }

    const privateKeyMarker = ['-----BEGIN', 'PRIVATE KEY-----'].join(' ');
    if (line.includes(privateKeyMarker)) {
      findings.push(`${filename}:${index + 1} contains a private key`);
    }
  }
}

if (findings.length) {
  throw new Error(`Secret check failed:\n- ${findings.join('\n- ')}`);
}

console.log(`Secret check passed for ${files.length} tracked and unignored files`);
