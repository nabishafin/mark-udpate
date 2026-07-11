/* global Buffer, process */
import tls from 'node:tls';

const SUPPORT_EMAIL = 'support@orisefinance.com';
const MAX_BODY_BYTES = 16 * 1024;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT = 6;
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
        reject(new Error('Signup payload is too large.'));
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

function allowedOrigins() {
  return new Set([
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    ...(process.env.SUPPORT_ALLOWED_ORIGINS || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
  ]);
}

function applyCors(request, response) {
  const origin = request.headers.origin;
  if (!origin) return true;

  try {
    const originUrl = new URL(origin);
    const host = request.headers['x-forwarded-host'] || request.headers.host;
    const isAllowed = allowedOrigins().has(originUrl.origin) || originUrl.host === host;

    if (isAllowed) {
      response.setHeader('Access-Control-Allow-Origin', originUrl.origin);
      response.setHeader('Vary', 'Origin');
      response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
      response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    }
    return isAllowed;
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
    to: process.env.MARKETING_SIGNUP_TO || process.env.SUPPORT_EMAIL_TO || SUPPORT_EMAIL,
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

function buildEmail({ email, page, sessionId }, config) {
  const boundary = `mdrn_signup_${Date.now().toString(36)}`;
  const subject = 'New wellness opportunity signup';
  const text = [
    `New lead email: ${email}`,
    page ? `Page: ${page}` : '',
    sessionId ? `Session: ${sessionId}` : '',
    '',
    'Source: Unlock a world of opportunities popup',
  ].filter((line) => line !== '').join('\n');
  const html = `
    <p><strong>New lead email:</strong> ${escapeHtml(email)}</p>
    ${page ? `<p><strong>Page:</strong> ${escapeHtml(page)}</p>` : ''}
    ${sessionId ? `<p><strong>Session:</strong> ${escapeHtml(sessionId)}</p>` : ''}
    <p><strong>Source:</strong> Unlock a world of opportunities popup</p>
  `.trim();

  return [
    `From: ${senderName('Mdrn-Life DDW Website')} <${config.from}>`,
    `To: ${config.to}`,
    `Reply-To: ${email}`,
    `Subject: ${encodedHeader(subject)}`,
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
  const isAllowedOrigin = applyCors(request, response);

  if (request.method === 'OPTIONS') {
    response.statusCode = isAllowedOrigin ? 204 : 403;
    response.end();
    return;
  }

  if (!isAllowedOrigin) {
    json(response, 403, { error: 'Signup origin is not allowed.' });
    return;
  }

  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    json(response, 405, { error: 'Method not allowed.' });
    return;
  }

  if (!rateLimit(request)) {
    json(response, 429, { error: 'Too many signup attempts. Please try again later.' });
    return;
  }

  try {
    const body = await readBody(request);
    const email = clean(body.email, 254).toLowerCase();
    const page = clean(body.page, 1000);
    const sessionId = clean(body.sessionId, 80);
    const website = clean(body.website, 200);

    if (website) {
      json(response, 200, { ok: true });
      return;
    }

    if (!email || !isEmail(email)) {
      json(response, 400, { error: 'Please enter a valid email address.' });
      return;
    }

    await sendMail({ email, page, sessionId });
    json(response, 200, { ok: true });
  } catch (error) {
    const message = error instanceof Error && error.message === 'SMTP is not configured.'
      ? 'Email signup is not configured.'
      : 'Could not save your email. Please try again.';
    json(response, 500, { error: message });
  }
}
