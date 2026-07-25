import { isIP } from 'node:net';

const loopbackAddresses = new Set(['127.0.0.1', '::1', '::ffff:127.0.0.1']);

function validHeaderIp(value) {
  if (typeof value !== 'string') return '';
  const candidate = value.trim();
  return isIP(candidate) ? candidate : '';
}

export function getClientIp(request) {
  const remoteAddress = request.socket?.remoteAddress || '';
  const behindTrustedLocalProxy = loopbackAddresses.has(remoteAddress);
  const explicitlyTrustedProxy = process.env.TRUST_PROXY_HEADERS === 'true';

  // Proxy headers are attacker-controlled unless the direct peer is trusted.
  if (behindTrustedLocalProxy || explicitlyTrustedProxy) {
    const realIp = validHeaderIp(request.headers['x-real-ip']);
    if (realIp) return realIp;

    const forwarded = request.headers['x-forwarded-for'];
    const firstForwarded = typeof forwarded === 'string' ? forwarded.split(',')[0] : '';
    const forwardedIp = validHeaderIp(firstForwarded);
    if (forwardedIp) return forwardedIp;
  }

  return remoteAddress || 'unknown';
}

export function createRateLimiter({ limit, windowMs, maxEntries = 10_000 }) {
  const attempts = new Map();
  let nextSweepAt = Date.now() + windowMs;

  function sweep(now) {
    if (now < nextSweepAt && attempts.size < maxEntries) return;
    for (const [key, entry] of attempts) {
      if (entry.resetAt <= now) attempts.delete(key);
    }
    while (attempts.size >= maxEntries) {
      const oldestKey = attempts.keys().next().value;
      if (oldestKey === undefined) break;
      attempts.delete(oldestKey);
    }
    nextSweepAt = now + windowMs;
  }

  return function rateLimit(request) {
    const now = Date.now();
    sweep(now);
    const ip = getClientIp(request);
    const existing = attempts.get(ip);
    const entry = !existing || existing.resetAt <= now
      ? { count: 0, resetAt: now + windowMs }
      : existing;

    entry.count += 1;
    attempts.delete(ip);
    attempts.set(ip, entry);
    return entry.count <= limit;
  };
}
