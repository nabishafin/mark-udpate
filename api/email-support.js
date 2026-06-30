/* global Buffer, process */
import tls from 'node:tls';

const SUPPORT_EMAIL = 'support@orisefinance.com';
const MAX_BODY_BYTES = 48 * 1024;
const MAX_MESSAGE_LENGTH = 4000;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT = 5;
const attempts = new Map();

function json(response, status, payload) {
  response.statusCode = status;
  response.setHeader('Content-Type', 'application/json');
  response.setHeader('Cache-Control', 'no-store');
  response.end(JSON.stringify(payload));
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk;
      if (Buffer.byteLength(body) > MAX_BODY_BYTES) {
        reject(new Error('Support request payload is too large.'));
        request.destroy();
      }
    });
    request.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error('Invalid JSON payload.'));
      }
    });
    request.on('error', reject);
  });
}

function clean(value, max = 500) {
  return String(value || '').replace(/\s+/g, ' ').trim().slice(0, max);
}

function cleanMultiline(value, max = MAX_MESSAGE_LENGTH) {
  return String(value || '').replace(/\r\n?/g, '\n').trim().slice(0, max);
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function header(value) {
  return clean(value, 240).replace(/[\r\n]+/g, ' ');
}

function encodedHeader(value) {
  return `=?UTF-8?B?${Buffer.from(header(value), 'utf8').toString('base64')}?=`;
}

function senderName(value) {
  return `"${header(value).replace(/"/g, '\\"')}"`;
}

function getClientIp(request) {
  const forwardedFor = request.headers['x-forwarded-for'];
  if (typeof forwardedFor === 'string' && forwardedFor) return forwardedFor.split(',')[0].trim();
  return request.socket?.remoteAddress || 'unknown';
}

function isSameOrigin(request) {
  const origin = request.headers.origin;
  if (!origin) return true;

  try {
    const originUrl = new URL(origin);
    const host = request.headers['x-forwarded-host'] || request.headers.host;
    const allowed = (process.env.SUPPORT_ALLOWED_ORIGINS || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    if (allowed.includes(originUrl.origin)) return true;
    return originUrl.host === host;
  } catch {
    return false;
  }
}

function rateLimit(request) {
  const now = Date.now();
  const ip = getClientIp(request);
  const entry = attempts.get(ip) || { count: 0, resetAt: now + RATE_WINDOW_MS };

  if (entry.resetAt <= now) {
    entry.count = 0;
    entry.resetAt = now + RATE_WINDOW_MS;
  }

  entry.count += 1;
  attempts.set(ip, entry);

  return entry.count <= RATE_LIMIT;
}

function smtpConfig() {
  const user = process.env.SMTP_USER || SUPPORT_EMAIL;
  const pass = (process.env.SMTP_APP_PASSWORD || process.env.SMTP_PASS || '').replace(/\s+/g, '');

  if (!user || !pass) {
    throw new Error('SMTP is not configured.');
  }

  return {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 465),
    user,
    pass,
    from: process.env.SUPPORT_EMAIL_FROM || user,
    to: process.env.SUPPORT_EMAIL_TO || SUPPORT_EMAIL,
  };
}

function readSmtpResponse(socket) {
  return new Promise((resolve, reject) => {
    let buffer = '';

    const onData = (chunk) => {
      buffer += chunk.toString('utf8');
      const lines = buffer.split(/\r?\n/).filter(Boolean);
      if (!lines.length) return;

      const last = lines[lines.length - 1];
      if (/^\d{3} /.test(last)) {
        cleanup();
        resolve({ code: Number(last.slice(0, 3)), message: buffer.trim() });
      }
    };

    const onError = (error) => {
      cleanup();
      reject(error);
    };

    const onTimeout = () => {
      cleanup();
      reject(new Error('SMTP request timed out.'));
    };

    const cleanup = () => {
      socket.off('data', onData);
      socket.off('error', onError);
      socket.off('timeout', onTimeout);
    };

    socket.on('data', onData);
    socket.on('error', onError);
    socket.on('timeout', onTimeout);
  });
}

async function smtpCommand(socket, command, expected) {
  if (command) socket.write(`${command}\r\n`);
  const response = await readSmtpResponse(socket);
  const expectedCodes = Array.isArray(expected) ? expected : [expected];
  if (!expectedCodes.includes(response.code)) {
    throw new Error(`SMTP command failed with status ${response.code}.`);
  }
  return response;
}

function dotStuff(value) {
  return value.replace(/\n\./g, '\n..');
}

function detailRow(label, value) {
  if (!value) return '';
  return `
    <tr>
      <td style="padding:14px 0;border-bottom:1px solid #e7edf4;color:#627084;font:600 12px Arial,sans-serif;text-transform:uppercase;letter-spacing:.08em;">${escapeHtml(label)}</td>
      <td style="padding:14px 0;border-bottom:1px solid #e7edf4;color:#101828;font:600 15px Arial,sans-serif;text-align:right;">${escapeHtml(value)}</td>
    </tr>
  `;
}

function buildEmail({ email, name, phone, subject, issue, message, source }, config) {
  const boundary = `mdrn_support_${Date.now().toString(36)}`;
  const safeSubject = `Website support: ${subject}`;
  const displaySource = source || 'Support chat';
  const text = [
    `Source: ${displaySource}`,
    name ? `Name: ${name}` : '',
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : '',
    `Inquiry type: ${issue}`,
    `Subject: ${subject}`,
    '',
    message,
  ].filter((line) => line !== '').join('\n');
  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#eef6f8;font-family:Arial,sans-serif;color:#101828;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#eef6f8;padding:28px 14px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;overflow:hidden;border-radius:24px;background:#ffffff;box-shadow:0 18px 55px rgba(15,23,42,.14);">
            <tr>
              <td style="padding:28px 30px;background:linear-gradient(135deg,#06202c,#0f6b7e);">
                <div style="color:#9df0ff;font:700 12px Arial,sans-serif;letter-spacing:.18em;text-transform:uppercase;">Mdrn-Life DDW</div>
                <h1 style="margin:10px 0 0;color:#ffffff;font:700 28px Arial,sans-serif;line-height:1.16;">New website message</h1>
                <p style="margin:10px 0 0;color:#c6f7ff;font:400 14px Arial,sans-serif;">${escapeHtml(displaySource)} inquiry received from the website.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 30px 8px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  ${detailRow('Source', displaySource)}
                  ${detailRow('Name', name)}
                  ${detailRow('Email', email)}
                  ${detailRow('Phone', phone)}
                  ${detailRow('Inquiry', issue)}
                  ${detailRow('Subject', subject)}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 30px 32px;">
                <div style="border-radius:18px;background:#f7fbfc;border:1px solid #dcecf1;padding:22px;">
                  <div style="margin:0 0 12px;color:#0f6b7e;font:700 12px Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;">Customer Message</div>
                  <div style="color:#1d2939;font:400 17px Arial,sans-serif;line-height:1.65;white-space:pre-wrap;">${escapeHtml(message)}</div>
                </div>
                <p style="margin:20px 0 0;color:#667085;font:400 12px Arial,sans-serif;line-height:1.6;">Reply directly to this email to respond to the customer.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return [
    `From: ${senderName('Mdrn-Life DDW Support')} <${config.from}>`,
    `To: ${config.to}`,
    `Reply-To: ${email}`,
    `Subject: ${encodedHeader(safeSubject)}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    '',
    text,
    `--${boundary}`,
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    '',
    html,
    `--${boundary}--`,
    '',
  ].join('\r\n');
}

async function sendMail(mail) {
  const config = smtpConfig();
  const socket = tls.connect({
    host: config.host,
    port: config.port,
    servername: config.host,
    rejectUnauthorized: true,
  });
  socket.setTimeout(15000);

  try {
    await smtpCommand(socket, null, 220);
    await smtpCommand(socket, `EHLO ${process.env.SMTP_EHLO_DOMAIN || 'mdrnlifeddw.com'}`, 250);
    await smtpCommand(socket, `AUTH PLAIN ${Buffer.from(`\0${config.user}\0${config.pass}`).toString('base64')}`, 235);
    await smtpCommand(socket, `MAIL FROM:<${config.from}>`, 250);
    await smtpCommand(socket, `RCPT TO:<${config.to}>`, [250, 251]);
    await smtpCommand(socket, 'DATA', 354);
    await smtpCommand(socket, `${dotStuff(buildEmail(mail, config))}\r\n.`, 250);
    socket.write('QUIT\r\n');
  } finally {
    socket.end();
  }
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    json(response, 405, { error: 'Method not allowed.' });
    return;
  }

  if (!isSameOrigin(request)) {
    json(response, 403, { error: 'Support request origin is not allowed.' });
    return;
  }

  if (!rateLimit(request)) {
    json(response, 429, { error: 'Too many support requests. Please try again later.' });
    return;
  }

  try {
    const body = await readBody(request);
    const source = clean(body.source, 120) || 'Support chat';
    const name = clean(body.name, 160);
    const email = clean(body.email, 254).toLowerCase();
    const phone = clean(body.phone, 80);
    const subject = clean(body.subject, 160);
    const issue = clean(body.issue, 120) || (source === 'Contact form' ? 'Contact form' : '');
    const message = cleanMultiline(body.message, MAX_MESSAGE_LENGTH);
    const website = clean(body.website, 200);

    if (website) {
      json(response, 200, { ok: true });
      return;
    }

    if (!email || !isEmail(email)) {
      json(response, 400, { error: 'Please enter a valid email address.' });
      return;
    }

    if (!subject) {
      json(response, 400, { error: 'Please enter a subject.' });
      return;
    }

    if (!issue) {
      json(response, 400, { error: 'Please select an issue type.' });
      return;
    }

    if (!message) {
      json(response, 400, { error: 'Please describe the issue.' });
      return;
    }

    await sendMail({ email, name, phone, subject, issue, message, source });
    json(response, 200, { ok: true });
  } catch (error) {
    const message = error instanceof Error && error.message === 'SMTP is not configured.'
      ? 'Email support is not configured.'
      : 'Support request could not be sent.';
    json(response, 500, { error: message });
  }
}
