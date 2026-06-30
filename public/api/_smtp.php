<?php
declare(strict_types=1);

const SUPPORT_EMAIL = 'support@orisefinance.com';

function api_json(int $status, array $payload): never {
  http_response_code($status);
  header('Content-Type: application/json');
  header('Cache-Control: no-store');
  echo json_encode($payload);
  exit;
}

function clean_value(mixed $value, int $max = 500): string {
  $text = is_string($value) ? $value : '';
  $text = preg_replace('/\s+/', ' ', trim($text)) ?? '';
  return substr($text, 0, $max);
}

function clean_multiline(mixed $value, int $max = 4000): string {
  $text = is_string($value) ? str_replace(["\r\n", "\r"], "\n", trim($value)) : '';
  return substr($text, 0, $max);
}

function read_json_body(int $maxBytes = 49152): array {
  $raw = file_get_contents('php://input') ?: '';
  if (strlen($raw) > $maxBytes) {
    api_json(413, ['error' => 'Request payload is too large.']);
  }

  $payload = json_decode($raw, true);
  if (!is_array($payload)) {
    api_json(400, ['error' => 'Invalid JSON payload.']);
  }

  return $payload;
}

function same_origin_allowed(): bool {
  $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
  if ($origin === '') return true;

  $originHost = parse_url($origin, PHP_URL_HOST);
  $host = $_SERVER['HTTP_HOST'] ?? '';
  if ($originHost && strcasecmp($originHost, $host) === 0) return true;

  $allowed = array_filter(array_map('trim', explode(',', getenv('SUPPORT_ALLOWED_ORIGINS') ?: '')));
  return in_array($origin, $allowed, true);
}

function rate_limit(string $bucket, int $limit = 6, int $windowSeconds = 600): bool {
  $ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
  $ip = trim(explode(',', $ip)[0]);
  $key = preg_replace('/[^a-zA-Z0-9_.-]/', '_', $bucket . '_' . $ip);
  $file = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'mdrn_' . $key . '.json';
  $now = time();
  $entry = ['count' => 0, 'resetAt' => $now + $windowSeconds];

  if (is_file($file)) {
    $existing = json_decode(file_get_contents($file) ?: '', true);
    if (is_array($existing)) $entry = array_merge($entry, $existing);
  }

  if (($entry['resetAt'] ?? 0) <= $now) {
    $entry = ['count' => 0, 'resetAt' => $now + $windowSeconds];
  }

  $entry['count'] = (int)($entry['count'] ?? 0) + 1;
  file_put_contents($file, json_encode($entry), LOCK_EX);
  return $entry['count'] <= $limit;
}

function env_value(string $key, string $default = ''): string {
  $value = getenv($key);
  return is_string($value) && $value !== '' ? $value : $default;
}

function smtp_config(string $toKey): array {
  $user = env_value('SMTP_USER', SUPPORT_EMAIL);
  $pass = preg_replace('/\s+/', '', env_value('SMTP_APP_PASSWORD', env_value('SMTP_PASS', ''))) ?? '';
  if ($user === '' || $pass === '') {
    api_json(500, ['error' => 'Email delivery is not configured on this server.']);
  }

  return [
    'host' => env_value('SMTP_HOST', 'smtp.gmail.com'),
    'port' => (int)env_value('SMTP_PORT', '465'),
    'user' => $user,
    'pass' => $pass,
    'from' => env_value('SUPPORT_EMAIL_FROM', $user),
    'to' => env_value($toKey, env_value('SUPPORT_EMAIL_TO', SUPPORT_EMAIL)),
  ];
}

function smtp_read($socket): array {
  $message = '';
  while (($line = fgets($socket, 515)) !== false) {
    $message .= $line;
    if (preg_match('/^\d{3} /', $line)) {
      return [(int)substr($line, 0, 3), trim($message)];
    }
  }
  return [0, trim($message)];
}

function smtp_command($socket, ?string $command, array $expected): void {
  if ($command !== null) fwrite($socket, $command . "\r\n");
  [$code] = smtp_read($socket);
  if (!in_array($code, $expected, true)) {
    api_json(500, ['error' => 'Email delivery failed.']);
  }
}

function encoded_header(string $value): string {
  $safe = preg_replace('/[\r\n]+/', ' ', $value) ?? '';
  return '=?UTF-8?B?' . base64_encode($safe) . '?=';
}

function dot_stuff(string $value): string {
  return preg_replace('/\n\./', "\n..", $value) ?? $value;
}

function support_detail_row(string $label, string $value): string {
  if ($value === '') return '';
  return '<tr>'
    . '<td style="padding:14px 0;border-bottom:1px solid #e7edf4;color:#627084;font:600 12px Arial,sans-serif;text-transform:uppercase;letter-spacing:.08em;">'
    . htmlspecialchars($label, ENT_QUOTES, 'UTF-8')
    . '</td>'
    . '<td style="padding:14px 0;border-bottom:1px solid #e7edf4;color:#101828;font:600 15px Arial,sans-serif;text-align:right;">'
    . htmlspecialchars($value, ENT_QUOTES, 'UTF-8')
    . '</td>'
    . '</tr>';
}

function support_email_html(string $source, string $name, string $email, string $phone, string $issue, string $subject, string $message): string {
  return '<!doctype html><html><body style="margin:0;padding:0;background:#eef6f8;font-family:Arial,sans-serif;color:#101828;">'
    . '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#eef6f8;padding:28px 14px;"><tr><td align="center">'
    . '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;overflow:hidden;border-radius:24px;background:#ffffff;box-shadow:0 18px 55px rgba(15,23,42,.14);">'
    . '<tr><td style="padding:28px 30px;background:linear-gradient(135deg,#06202c,#0f6b7e);">'
    . '<div style="color:#9df0ff;font:700 12px Arial,sans-serif;letter-spacing:.18em;text-transform:uppercase;">Mdrn-Life DDW</div>'
    . '<h1 style="margin:10px 0 0;color:#ffffff;font:700 28px Arial,sans-serif;line-height:1.16;">New website message</h1>'
    . '<p style="margin:10px 0 0;color:#c6f7ff;font:400 14px Arial,sans-serif;">'
    . htmlspecialchars($source, ENT_QUOTES, 'UTF-8') . ' inquiry received from the website.</p>'
    . '</td></tr>'
    . '<tr><td style="padding:28px 30px 8px;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0">'
    . support_detail_row('Source', $source)
    . support_detail_row('Name', $name)
    . support_detail_row('Email', $email)
    . support_detail_row('Phone', $phone)
    . support_detail_row('Inquiry', $issue)
    . support_detail_row('Subject', $subject)
    . '</table></td></tr>'
    . '<tr><td style="padding:20px 30px 32px;">'
    . '<div style="border-radius:18px;background:#f7fbfc;border:1px solid #dcecf1;padding:22px;">'
    . '<div style="margin:0 0 12px;color:#0f6b7e;font:700 12px Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;">Customer Message</div>'
    . '<div style="color:#1d2939;font:400 17px Arial,sans-serif;line-height:1.65;white-space:pre-wrap;">'
    . nl2br(htmlspecialchars($message, ENT_QUOTES, 'UTF-8'))
    . '</div></div>'
    . '<p style="margin:20px 0 0;color:#667085;font:400 12px Arial,sans-serif;line-height:1.6;">Reply directly to this email to respond to the customer.</p>'
    . '</td></tr></table></td></tr></table></body></html>';
}

function send_smtp_email(string $toKey, string $replyTo, string $subject, string $text, string $html): void {
  $config = smtp_config($toKey);
  $boundary = 'mdrn_' . bin2hex(random_bytes(8));
  $domain = env_value('SMTP_EHLO_DOMAIN', 'mdrnlifeddw.com');
  $body = implode("\r\n", [
    'From: "Mdrn-Life DDW Website" <' . $config['from'] . '>',
    'To: ' . $config['to'],
    'Reply-To: ' . $replyTo,
    'Subject: ' . encoded_header($subject),
    'MIME-Version: 1.0',
    'Content-Type: multipart/alternative; boundary="' . $boundary . '"',
    '',
    '--' . $boundary,
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    '',
    $text,
    '--' . $boundary,
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    '',
    $html,
    '--' . $boundary . '--',
    '',
  ]);

  $socket = @stream_socket_client(
    'ssl://' . $config['host'] . ':' . $config['port'],
    $errno,
    $errstr,
    15,
    STREAM_CLIENT_CONNECT
  );
  if (!$socket) api_json(500, ['error' => 'Email delivery failed.']);
  stream_set_timeout($socket, 15);

  smtp_command($socket, null, [220]);
  smtp_command($socket, 'EHLO ' . $domain, [250]);
  smtp_command($socket, 'AUTH PLAIN ' . base64_encode("\0" . $config['user'] . "\0" . $config['pass']), [235]);
  smtp_command($socket, 'MAIL FROM:<' . $config['from'] . '>', [250]);
  smtp_command($socket, 'RCPT TO:<' . $config['to'] . '>', [250, 251]);
  smtp_command($socket, 'DATA', [354]);
  smtp_command($socket, dot_stuff($body) . "\r\n.", [250]);
  fwrite($socket, "QUIT\r\n");
  fclose($socket);
}
