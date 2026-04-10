import Database from 'better-sqlite3';
import path from 'path';

let db: Database.Database | null = null;

export function getDb() {
  if (db) return db;

  const dbPath = path.resolve(process.cwd(), 'expense_pro.db');
  db = new Database(dbPath);

  // Initialize tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      amount REAL NOT NULL,
      date TEXT NOT NULL,
      type TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS budgets (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      category TEXT NOT NULL,
      limit_amount REAL NOT NULL,
      color TEXT NOT NULL,
      icon TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id),
      UNIQUE(user_id, category)
    );

    CREATE TABLE IF NOT EXISTS accounts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      balance REAL NOT NULL,
      color TEXT NOT NULL,
      icon TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      color TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS settings (
      user_id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      notifyBudget INTEGER NOT NULL,
      notifySummary INTEGER NOT NULL,
      theme TEXT NOT NULL,
      language TEXT NOT NULL,
      currency TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      date TEXT NOT NULL,
      read INTEGER NOT NULL,
      type TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `);

  // Migration for existing tables
  const tables = ['transactions', 'budgets', 'accounts', 'categories', 'notifications', 'settings'];
  for (const table of tables) {
    try {
      db.prepare(`ALTER TABLE ${table} ADD COLUMN user_id TEXT`).run();
    } catch (e) { /* Column already exists */ }
    
    // Specifically handle tables that might be missing 'id' from old schemas
    if (['budgets', 'categories', 'notifications'].includes(table)) {
      try {
        db.prepare(`ALTER TABLE ${table} ADD COLUMN id TEXT`).run();
      } catch (e) { /* Column already exists */ }
    }
  }

  // Handle old 'settings' table constraint (id = 1)
  try {
    const columns = db.prepare("PRAGMA table_info(settings)").all() as any[];
    const hasId = columns.some(c => c.name === 'id');
    if (hasId) {
      console.log('Migrating settings table to remove old ID constraint...');
      db.exec(`
        ALTER TABLE settings RENAME TO settings_old;
        CREATE TABLE settings (
          user_id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          notifyBudget INTEGER NOT NULL,
          notifySummary INTEGER NOT NULL,
          theme TEXT NOT NULL,
          language TEXT NOT NULL,
          currency TEXT NOT NULL,
          FOREIGN KEY(user_id) REFERENCES users(id)
        );
        INSERT INTO settings (user_id, name, email, notifyBudget, notifySummary, theme, language, currency)
        SELECT user_id, name, email, notifyBudget, notifySummary, theme, language, currency 
        FROM settings_old 
        WHERE user_id IS NOT NULL;
        DROP TABLE settings_old;
      `);
    }
  } catch (e) {
    console.error('Settings migration failed:', e);
  }

  // Final fix for budgets table if it was using category as PK
  try {
    // If we just added 'id', we need to populate it for existing rows
    db.prepare(`UPDATE budgets SET id = user_id || '_' || category WHERE id IS NULL`).run();
  } catch (e) { /* May fail if user_id is null or id doesn't exist yet */ }

  return db;
}

export default getDb;
