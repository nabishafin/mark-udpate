<?php
declare(strict_types=1);

require __DIR__ . '/_smtp.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  header('Allow: POST');
  api_json(405, ['success' => false, 'message' => 'Method not allowed.']);
}

if (!same_origin_allowed()) {
  api_json(403, ['success' => false, 'message' => 'Request origin is not allowed.']);
}

if (!rate_limit('contact', 5)) {
  api_json(429, ['success' => false, 'message' => 'Too many requests. Please try again later.']);
}

$body = read_json_body();
$name = clean_value($body['name'] ?? '', 160);
$email = strtolower(clean_value($body['email'] ?? '', 254));
$phone = clean_value($body['phone'] ?? '', 80);
$subject = clean_value($body['subject'] ?? '', 180);
$message = clean_multiline($body['message'] ?? '', 4000);
$errors = [];

if ($name === '') $errors[] = ['field' => 'name', 'message' => 'Name is required.'];
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  $errors[] = ['field' => 'email', 'message' => 'A valid email is required.'];
}
if ($message === '' || strlen($message) < 3) {
  $errors[] = ['field' => 'message', 'message' => 'Message must be at least 3 characters.'];
}

if ($errors) {
  api_json(400, [
    'success' => false,
    'message' => 'Validation failed',
    'errors' => $errors,
  ]);
}

if ($subject === '') $subject = 'Website contact message';
$messageId = 'contact_' . bin2hex(random_bytes(10));
$plain = implode("\n", [
  'Source: Contact form',
  'Name: ' . $name,
  'Email: ' . $email,
  $phone !== '' ? 'Phone: ' . $phone : '',
  'Subject: ' . $subject,
  '',
  $message,
]);
$html = support_email_html('Contact form', $name, $email, $phone, 'Contact form', $subject, $message);

send_smtp_email('SUPPORT_EMAIL_TO', $email, 'Website contact: ' . $subject, $plain, $html);
api_json(200, [
  'success' => true,
  'message' => 'Your message has been sent successfully.',
  'messageId' => $messageId,
]);
