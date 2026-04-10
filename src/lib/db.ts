import fs from 'fs';
import path from 'path';

const isVercel = process.env.VERCEL === '1' || process.env.VERCEL === 'true' || process.env.NODE_ENV === 'production';
const dbPath = isVercel ? path.join('/tmp', 'db.json') : path.resolve(process.cwd(), 'expense_pro.json');

const defaultDb = {
  users: [],
  transactions: [],
  budgets: [],
  accounts: [],
  categories: [],
  settings: [],
  notifications: []
};

export async function readDb() {
  try {
    if (!fs.existsSync(dbPath)) {
      await fs.promises.writeFile(dbPath, JSON.stringify(defaultDb));
      return JSON.parse(JSON.stringify(defaultDb));
    }
    const data = await fs.promises.readFile(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return JSON.parse(JSON.stringify(defaultDb));
  }
}

export async function writeDb(data: any) {
  try {
    await fs.promises.writeFile(dbPath, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Failed to write to JSON db", e);
  }
}

export async function initializeDatabase() {
  await readDb();
  return true;
}
