<?php
declare(strict_types=1);

require __DIR__ . '/_smtp.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  header('Allow: POST');
  api_json(405, ['error' => 'Method not allowed.']);
}

if (!same_origin_allowed()) {
  api_json(403, ['error' => 'Signup origin is not allowed.']);
}

if (!rate_limit('marketing_signup', 6)) {
  api_json(429, ['error' => 'Too many signup attempts. Please try again later.']);
}

$body = read_json_body(16384);
$email = strtolower(clean_value($body['email'] ?? '', 254));
$page = clean_value($body['page'] ?? '', 1000);
$sessionId = clean_value($body['sessionId'] ?? '', 80);
$website = clean_value($body['website'] ?? '', 200);

if ($website !== '') {
  api_json(200, ['ok' => true]);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  api_json(400, ['error' => 'Please enter a valid email address.']);
}

$plain = implode("\n", array_filter([
  'New lead email: ' . $email,
  $page !== '' ? 'Page: ' . $page : '',
  $sessionId !== '' ? 'Session: ' . $sessionId : '',
  '',
  'Source: Unlock a world of opportunities popup',
], fn($line) => $line !== null));

$html = '<p><strong>New lead email:</strong> ' . htmlspecialchars($email, ENT_QUOTES, 'UTF-8') . '</p>'
  . ($page !== '' ? '<p><strong>Page:</strong> ' . htmlspecialchars($page, ENT_QUOTES, 'UTF-8') . '</p>' : '')
  . ($sessionId !== '' ? '<p><strong>Session:</strong> ' . htmlspecialchars($sessionId, ENT_QUOTES, 'UTF-8') . '</p>' : '')
  . '<p><strong>Source:</strong> Unlock a world of opportunities popup</p>';

send_smtp_email('MARKETING_SIGNUP_TO', $email, 'New wellness opportunity signup', $plain, $html);
api_json(200, ['ok' => true]);
