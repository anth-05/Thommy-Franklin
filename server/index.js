import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from './config.js';
import { verifyMailer } from './lib/mailer.js';
import enquiry from './routes/enquiry.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const app = express();

app.disable('x-powered-by');
if (config.trustProxy) app.set('trust proxy', 1);

/* API: add new features as routers under /api */
const api = express.Router();
api.use(express.json({ limit: '32kb' }));
api.use((req, res, next) => {
  const origin = req.get('origin');
  if (origin && config.allowedOrigins.includes(origin)) {
    res.set({ 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Allow-Methods': 'GET,POST', Vary: 'Origin' });
  }
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});
api.get('/health', (req, res) => res.json({ ok: true }));
api.use('/enquiry', enquiry);
api.use((req, res) => res.status(404).json({ ok: false, error: 'Not found' }));
api.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ ok: false, error: err.status === 400 ? 'Invalid request' : 'Server error' });
});
app.use('/api', api);

/* Site */
// CSS/JS change with every site update, so browsers must revalidate them (cheap 304s via ETag);
// images, fonts and video rarely change and can be cached for a week.
app.use('/assets', express.static(path.join(root, 'assets'), {
  maxAge: '7d',
  setHeaders: (res, file) => {
    if (/\.(css|js)$/.test(file)) res.setHeader('Cache-Control', 'no-cache');
  },
}));
// Only these files are public; the rest of the project folder (server code, .env, data) is not served.
const PAGES = ['index', 'press', 'booking'];
// Story and Wildcard were separate pages for a while; they're sections on the home page now.
const MOVED = { story: '/#story', wildcard: '/#label' };
app.get('/', (req, res) => res.sendFile(path.join(root, 'index.html')));
app.get('/:page', (req, res, next) => {
  const name = req.params.page.replace(/\.html$/, '');
  if (MOVED[name]) return res.redirect(301, MOVED[name]);
  if (!PAGES.includes(name)) return next();
  res.sendFile(path.join(root, `${name}.html`));
});
app.get('/favicon.ico', (req, res) => res.type('png').sendFile(path.join(root, 'assets/favicon-32.png'), { maxAge: '7d' }));

app.listen(config.port, () => {
  console.log(`Thommy Franklin site on http://localhost:${config.port}`);
  verifyMailer();
});
