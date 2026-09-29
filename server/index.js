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
app.use('/assets', express.static(path.join(root, 'assets'), { maxAge: '7d' }));
app.get('/', (req, res) => res.sendFile(path.join(root, 'thommy-franklin.html')));

app.listen(config.port, () => {
  console.log(`Thommy Franklin site on http://localhost:${config.port}`);
  verifyMailer();
});
