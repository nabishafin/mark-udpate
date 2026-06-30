<?php
declare(strict_types=1);

require __DIR__ . '/_smtp.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  header('Allow: POST');
  api_json(405, ['error' => 'Method not allowed.']);
}

if (!same_origin_allowed()) {
  api_json(403, ['error' => 'Support request origin is not allowed.']);
}

if (!rate_limit('email_support', 5)) {
  api_json(429, ['error' => 'Too many support requests. Please try again later.']);
}

$body = read_json_body();
$source = clean_value($body['source'] ?? '', 120);
if ($source === '') $source = 'Support chat';
$name = clean_value($body['name'] ?? '', 160);
$email = strtolower(clean_value($body['email'] ?? '', 254));
$phone = clean_value($body['phone'] ?? '', 80);
$subject = clean_value($body['subject'] ?? '', 160);
$issue = clean_value($body['issue'] ?? '', 120);
$message = clean_multiline($body['message'] ?? '', 4000);
$website = clean_value($body['website'] ?? '', 200);

if ($website !== '') {
  api_json(200, ['ok' => true]);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  api_json(400, ['error' => 'Please enter a valid email address.']);
}

if ($subject === '') api_json(400, ['error' => 'Please enter a subject.']);
if ($issue === '') $issue = $source === 'Contact form' ? 'Contact form' : '';
if ($issue === '') api_json(400, ['error' => 'Please select an issue type.']);
if ($message === '') api_json(400, ['error' => 'Please describe the issue.']);

$plain = implode("\n", array_filter([
  'Source: ' . $source,
  $name !== '' ? 'Name: ' . $name : '',
  'Email: ' . $email,
  $phone !== '' ? 'Phone: ' . $phone : '',
  'Inquiry type: ' . $issue,
  'Subject: ' . $subject,
  '',
  $message,
], fn($line) => $line !== null));

$html = support_email_html($source, $name, $email, $phone, $issue, $subject, $message);

send_smtp_email('SUPPORT_EMAIL_TO', $email, 'Website support: ' . $subject, $plain, $html);
api_json(200, ['ok' => true]);
