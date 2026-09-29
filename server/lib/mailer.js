import nodemailer from 'nodemailer';
import { config } from '../config.js';

const { mail } = config;

export const previewMode = !mail.host;

const transport = previewMode
  ? nodemailer.createTransport({ jsonTransport: true })
  : nodemailer.createTransport({
      host: mail.host,
      port: mail.port,
      secure: mail.secure,
      auth: mail.user ? { user: mail.user, pass: mail.pass } : undefined,
    });

export async function sendMail(message) {
  const info = await transport.sendMail({ from: mail.from, ...message });
  if (previewMode) console.log('[mail preview]', JSON.parse(info.message));
  return info;
}

export async function verifyMailer() {
  if (previewMode) {
    console.warn('SMTP_HOST not set: emails will be logged to the console, not sent.');
    return;
  }
  try {
    await transport.verify();
    console.log(`SMTP ready (${mail.host}:${mail.port})`);
  } catch (err) {
    console.error('SMTP check failed:', err.message);
  }
}
