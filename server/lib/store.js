import { appendFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { config } from '../config.js';

// Append-only JSON Lines log. Simple to back up, grep or import into a
// spreadsheet; swap for a database when the site needs one.
export async function record(collection, entry) {
  await mkdir(config.dataDir, { recursive: true });
  const line = JSON.stringify({ at: new Date().toISOString(), ...entry }) + '\n';
  await appendFile(path.join(config.dataDir, `${collection}.jsonl`), line);
}
