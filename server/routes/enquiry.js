import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { config } from '../config.js';
import { sendMail } from '../lib/mailer.js';
import { record } from '../lib/store.js';

const TYPES = ['Club show', 'Festival', 'Private event', 'Request EPK', 'Press / interview', 'Label / collab'];
const LIMITS = { name: 120, email: 200, event: 200, date: 20, city: 120, message: 5000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const clean = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const esc = s => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function validate(body = {}) {
  const data = Object.fromEntries(Object.entries(LIMITS).map(([k, max]) => [k, clean(body[k], max)]));
  data.type = TYPES.includes(body.type) ? body.type : TYPES[0];

  const errors = {};
  if (!data.name) errors.name = 'Add your name so the team knows who to reply to.';
  if (!data.email) errors.email = 'Add an email address the team can reply to.';
  else if (!EMAIL_RE.test(data.email)) errors.email = 'This email address looks incomplete. Check for a missing @ or domain.';
  if (!data.event) errors.event = 'Add the event, venue or company this is for.';
  if (data.date && !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) data.date = '';
  return { data, errors };
}

function enquiryText(d) {
  return [
    `Name: ${d.name}`,
    `Email: ${d.email}`,
    `Event / venue: ${d.event}`,
    `Date: ${d.date || '-'}`,
    `City: ${d.city || '-'}`,
    `Type: ${d.type}`,
    '',
    d.message || '(no details)',
  ].join('\n');
}

const router = Router();

router.post(
  '/',
  rateLimit({ windowMs: 15 * 60 * 1000, limit: 5, skipFailedRequests: true, standardHeaders: 'draft-7', legacyHeaders: false,
    message: { ok: false, error: 'Too many enquiries from this connection. Try again later or email the team directly.' } }),
  async (req, res) => {
    // Honeypot: real visitors never see or fill this field.
    if (req.body?.website) return res.json({ ok: true });

    const { data, errors } = validate(req.body);
    if (Object.keys(errors).length) return res.status(422).json({ ok: false, errors });

    const text = enquiryText(data);
    try {
      await sendMail({
        to: config.mail.to,
        replyTo: `"${data.name.replace(/"/g, '')}" <${data.email}>`,
        subject: `${data.type}: ${data.event} (${data.name})`,
        text: `New enquiry from the Thommy Franklin website\n\n${text}`,
        html: `<p>New enquiry from the Thommy Franklin website</p><pre style="font:14px/1.5 system-ui,sans-serif;white-space:pre-wrap">${esc(text)}</pre>`,
      });
    } catch (err) {
      console.error('Enquiry email failed:', err);
      return res.status(502).json({ ok: false, error: 'The enquiry could not be sent right now.' });
    }

    // Best-effort extras: never fail the request once the team email is out.
    record('enquiries', { ...data, ua: req.get('user-agent') }).catch(err => console.error('Could not store enquiry:', err));
    if (config.mail.sendConfirmation) {
      sendMail({
        to: data.email,
        subject: 'Thanks for your enquiry: Thommy Franklin',
        text: `Hi ${data.name},\n\nThanks for getting in touch. Thommy's team at Wildcard Records has your enquiry and will reply to this address.\n\nWhat you sent:\n\n${text}\n\n- Wildcard Records`,
      }).catch(err => console.error('Confirmation email failed:', err));
    }

    res.json({ ok: true });
  },
);

export default router;
