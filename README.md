# Thommy Franklin site

Single-page artist site + EPK (`thommy-franklin.html`, `assets/`) served by a small Node/Express backend (`server/`).

## Run

```sh
npm install
cp .env.example .env   # fill in SMTP details
npm run dev            # http://localhost:3000, restarts on changes
```

Without `SMTP_HOST` the server runs in preview mode: enquiry emails are printed to the console instead of sent.

## What the backend does

- Serves the site at `/` and files under `/assets`.
- `POST /api/enquiry`: the booking form. Validates the fields, blocks bots with a hidden honeypot field, allows 5 successful sends per IP every 15 minutes, emails the enquiry to `MAIL_TO` with Reply-To set to the sender, emails the sender a confirmation, and appends it to `data/enquiries.jsonl`.
- `GET /api/health`: returns `{"ok":true}` for uptime checks.

If the page is opened without the backend (for example as a Claude artifact), the form falls back to "copy your enquiry and email it".

## Adding a feature

1. Create `server/routes/<feature>.js` exporting an Express `Router`.
2. Mount it in `server/index.js`: `api.use('/<feature>', router)`.
3. Put settings in `server/config.js` and `.env.example`.
4. Use `sendMail` (`server/lib/mailer.js`) to send email and `record` (`server/lib/store.js`) to log data.

## Deploy

Any Node 22.9+ host works, for example Render, Railway, Fly.io or a VPS. Set the variables from `.env.example` on the host, set `TRUST_PROXY=true` behind the host's proxy, and use `npm start`.

For SMTP, use a provider (Resend, Postmark, Brevo…) with the site's domain verified, so `MAIL_FROM` is on that domain and emails don't land in spam.

If the page is hosted somewhere else (a static host), add `<meta name="api-base" content="https://api.your-domain.com">` to the page and list the site's origin in `ALLOWED_ORIGINS`.
