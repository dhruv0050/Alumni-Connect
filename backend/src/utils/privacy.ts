// Regular expressions for detecting private information
const PATTERNS = {
  email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  phone: /(\+\d{1,3}[-.]?)?\(?\d{3}\)?[-.]?\d{3}[-.]?\d{4}/g,
  // Add more patterns as needed
};

export function redactPrivateInfo(content: string): string {
  let redactedContent = content;

  // Redact email addresses
  redactedContent = redactedContent.replace(PATTERNS.email, '[EMAIL REDACTED]');

  // Redact phone numbers
  redactedContent = redactedContent.replace(PATTERNS.phone, '[PHONE NUMBER REDACTED]');

  return redactedContent;
} 