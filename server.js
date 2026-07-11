/* global process */
import { createServer } from 'node:http';
import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import contactHandler from './api/contact.js';
import emailSupportHandler from './api/email-support.js';
import marketingSignupHandler from './api/marketing-signup.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const distDir = resolve(__dirname, 'dist');
const SHOPIFY_CHECKOUT_ORIGIN = 'https://orise-6796.myshopify.com';

function loadEnvFile(filename) {
  const filePath = resolve(__dirname, filename);
  if (!existsSync(filePath)) return;

  const lines = readFileSync(filePath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue;

    const index = trimmed.indexOf('=');
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^['"]|['"]$/g, '');
    if (key && process.env[key] === undefined) process.env[key] = value;
  }
}

loadEnvFile('.env');
loadEnvFile('.env.local');

const port = Number(process.env.PORT || 3000);

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.pdf': 'application/pdf',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webm': 'video/webm',
  '.webp': 'image/webp',
};

const appRoutePatterns = [
  /^\/$/,
  /^\/science$/,
  /^\/science\/lab-testing$/,
  /^\/benefits$/,
  /^\/athletes-recovery$/,
  /^\/healthy-aging$/,
  /^\/shop$/,
  /^\/products$/,
  /^\/cart$/,
  /^\/products\/cart$/,
  /^\/checkout$/,
  /^\/login$/,
  /^\/register$/,
  /^\/forgot-password$/,
  /^\/reset-password$/,
  /^\/account$/,
  /^\/account\/orders$/,
  /^\/account\/orders\/.+$/,
  /^\/account\/reset\/.+$/,
  /^\/research$/,
  /^\/blogs$/,
  /^\/blogs\/news$/,
  /^\/blogs\/news\/.+$/,
  /^\/contact$/,
  /^\/learn$/,
  /^\/learn\/.+$/,
  /^\/founder$/,
  /^\/pages\/refund$/,
  /^\/policies\/.+$/,
];

const shopifyPathPatterns = [
  /^\/cart\/c\//,
  /^\/cart\/\d/,
  /^\/checkouts\//,
  /^\/checkout\/.+/,
  /^\/wallets\/checkouts\//,
  /^\/orders\//,
  /^\/\d+\/orders\//,
  /^\/a\/checkout$/,
];

function setSecurityHeaders(response) {
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('X-Frame-Options', 'SAMEORIGIN');
  response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  response.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: https://cdn.shopify.com",
      "connect-src 'self' https://orise-6796.myshopify.com https://mdrnlifeddw.com",
      "frame-src 'self'",
      "form-action 'self' https://orise-6796.myshopify.com",
      "base-uri 'self'",
      "object-src 'none'",
      'upgrade-insecure-requests',
    ].join('; '),
  );
}

function json(response, status, payload) {
  response.statusCode = status;
  setSecurityHeaders(response);
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store');
  response.end(JSON.stringify(payload));
}

function sendNotFound(response) {
  response.statusCode = 404;
  setSecurityHeaders(response);
  response.setHeader('Content-Type', 'text/plain; charset=utf-8');
  response.end('Not found');
}

function serveFile(filePath, response, statusCode = 200) {
  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    sendNotFound(response);
    return;
  }

  response.statusCode = statusCode;
  setSecurityHeaders(response);
  response.setHeader('Content-Type', contentTypes[extname(filePath)] || 'application/octet-stream');
  createReadStream(filePath).pipe(response);
}

function staticPath(pathname) {
  const decoded = decodeURIComponent(pathname);
  const normalizedPath = normalize(decoded).replace(/^(\.\.[/\\])+/, '');
  const target = resolve(distDir, normalizedPath.slice(1));
  return target.startsWith(distDir) ? target : null;
}

function isAppRoute(pathname) {
  return appRoutePatterns.some((pattern) => pattern.test(pathname));
}

function normalizeAppPath(pathname) {
  return pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
}

function isShopifyPath(pathname) {
  return shopifyPathPatterns.some((pattern) => pattern.test(pathname));
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`);

    if (isShopifyPath(url.pathname)) {
      response.statusCode = 302;
      setSecurityHeaders(response);
      response.setHeader('Location', `${SHOPIFY_CHECKOUT_ORIGIN}${url.pathname}${url.search}`);
      response.end();
      return;
    }

    if (url.pathname === '/api/email-support') {
      await emailSupportHandler(request, response);
      return;
    }

    if (url.pathname === '/api/contact') {
      await contactHandler(request, response);
      return;
    }

    if (url.pathname === '/api/marketing-signup') {
      await marketingSignupHandler(request, response);
      return;
    }

    if (url.pathname.startsWith('/api/')) {
      json(response, 404, { success: false, message: 'Route not found' });
      return;
    }

    const target = staticPath(url.pathname);
    if (target && existsSync(target) && statSync(target).isFile()) {
      serveFile(target, response);
      return;
    }

    serveFile(join(distDir, 'index.html'), response, isAppRoute(normalizeAppPath(url.pathname)) ? 200 : 404);
  } catch (error) {
    json(response, 500, { success: false, message: 'Server error.' });
  }
});

server.listen(port, () => {
  console.log(`Mdrn-Life DDW server running on port ${port}`);
});
