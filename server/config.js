// All settings come from environment variables (see .env.example).
const env = process.env;

export const config = {
  port: Number(env.PORT) || 3000,
  // Set when the site is hosted on a different origin than this API, e.g. https://thommyfranklin.com
  allowedOrigins: (env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean),
  trustProxy: env.TRUST_PROXY === 'true',

  mail: {
    // Without SMTP_HOST the server runs in preview mode: emails are logged, not sent.
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT) || 587,
    secure: env.SMTP_SECURE === 'true',
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
    from: env.MAIL_FROM || 'Thommy Franklin website <no-reply@localhost>',
    to: env.MAIL_TO || 'contact@wildcardmanagement.com',
    // Send the enquirer a short "we got it" email.
    sendConfirmation: env.SEND_CONFIRMATION !== 'false',
  },

  // Where submissions are appended (one JSON object per line) for later reporting.
  dataDir: env.DATA_DIR || new URL('../data/', import.meta.url).pathname,
};
