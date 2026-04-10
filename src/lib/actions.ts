'use server';

import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth";
import bcrypt from "bcryptjs";
import getDb from './db';
import { 
  Transaction, 
  Budget, 
  Account, 
  TransactionCategory, 
  UserSettings, 
  AppNotification 
} from '@/context/TransactionContext';

async function getUserId() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  return (session.user as any).id;
}

// Auth Actions
export async function registerUser(formData: any) {
  const { name, email, password } = formData;
  const db = getDb();
  
  // Check if user exists
  const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = Math.random().toString(36).substr(2, 9);
  
  db.prepare(`
    INSERT INTO users (id, name, email, password, createdAt)
    VALUES (?, ?, ?, ?, ?)
  `).run(userId, name, email, hashedPassword, new Date().toISOString());

  // Initialize default settings for the new user
  db.prepare(`
    INSERT INTO settings (user_id, name, email, notifyBudget, notifySummary, theme, language, currency)
    VALUES (?, ?, ?, 1, 0, 'dark', 'en', 'INR')
  `).run(userId, name, email);

  return { success: true };
}

export async function getInitialData() {
  const userId = await getUserId();
  const db = getDb();
  if (!userId) return { transactions: [], budgets: [], accounts: [], categories: [], settings: null, notifications: [] };

  const transactions = db.prepare('SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC').all(userId) as Transaction[];
  
  const budgetsRows = db.prepare('SELECT * FROM budgets WHERE user_id = ?').all(userId) as any[];
  const budgets: Budget[] = budgetsRows.map(row => ({
    category: row.category,
    limit: row.limit_amount,
    color: row.color,
    icon: row.icon
  }));

  const accounts = db.prepare('SELECT * FROM accounts WHERE user_id = ?').all(userId) as Account[];
  const categories = db.prepare('SELECT * FROM categories WHERE user_id = ?').all(userId) as TransactionCategory[];
  
  const settingsRow = db.prepare('SELECT * FROM settings WHERE user_id = ?').get(userId) as any;
  const settings: UserSettings | null = settingsRow ? {
    name: settingsRow.name,
    email: settingsRow.email,
    notifyBudget: Boolean(settingsRow.notifyBudget),
    notifySummary: Boolean(settingsRow.notifySummary),
    theme: settingsRow.theme as any,
    language: settingsRow.language as any,
    currency: settingsRow.currency as any
  } : null;

  const notificationsRows = db.prepare('SELECT * FROM notifications WHERE user_id = ? ORDER BY date DESC').all(userId) as any[];
  const notifications: AppNotification[] = notificationsRows.map(row => ({
    id: row.id,
    title: row.title,
    message: row.message,
    date: row.date,
    read: Boolean(row.read),
    type: row.type as any
  }));

  return { transactions, budgets, accounts, categories, settings, notifications };
}

// Transaction Actions
export async function saveTransaction(tx: Transaction) {
  const userId = await getUserId();
  if (!userId) throw new Error("Unauthorized");
  const db = getDb();

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO transactions (id, user_id, name, category, amount, date, type)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(tx.id, userId, tx.name, tx.category, tx.amount, tx.date, tx.type);
}

export async function deleteTransaction(id: string) {
  const userId = await getUserId();
  if (!userId) throw new Error("Unauthorized");
  getDb().prepare('DELETE FROM transactions WHERE id = ? AND user_id = ?').run(id, userId);
}

// Budget Actions
export async function saveBudget(budget: Budget) {
  const userId = await getUserId();
  if (!userId) throw new Error("Unauthorized");
  const db = getDb();

  const id = `${userId}_${budget.category}`;
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO budgets (id, user_id, category, limit_amount, color, icon)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  stmt.run(id, userId, budget.category, budget.limit, budget.color, budget.icon);
}

// Account Actions
export async function saveAccount(acc: Account) {
  const userId = await getUserId();
  if (!userId) throw new Error("Unauthorized");
  const db = getDb();

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO accounts (id, user_id, name, type, balance, color, icon)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(acc.id, userId, acc.name, acc.type, acc.balance, acc.color, acc.icon);
}

export async function deleteAccount(id: string) {
  const userId = await getUserId();
  if (!userId) throw new Error("Unauthorized");
  getDb().prepare('DELETE FROM accounts WHERE id = ? AND user_id = ?').run(id, userId);
}

// Category Actions
export async function saveCategory(cat: TransactionCategory) {
  const userId = await getUserId();
  if (!userId) throw new Error("Unauthorized");
  const db = getDb();

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO categories (id, user_id, name, color)
    VALUES (?, ?, ?, ?)
  `);
  stmt.run(cat.id, userId, cat.name, cat.color);
}

export async function deleteCategory(id: string) {
  const userId = await getUserId();
  if (!userId) throw new Error("Unauthorized");
  getDb().prepare('DELETE FROM categories WHERE id = ? AND user_id = ?').run(id, userId);
}

// Settings Actions
export async function saveSettings(settings: UserSettings) {
  const userId = await getUserId();
  if (!userId) throw new Error("Unauthorized");
  const db = getDb();

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO settings (user_id, name, email, notifyBudget, notifySummary, theme, language, currency)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    userId,
    settings.name, 
    settings.email, 
    settings.notifyBudget ? 1 : 0, 
    settings.notifySummary ? 1 : 0, 
    settings.theme, 
    settings.language || 'en', 
    settings.currency || 'INR'
  );
}

// Notification Actions
export async function saveNotification(notif: AppNotification) {
  const userId = await getUserId();
  if (!userId) throw new Error("Unauthorized");
  const db = getDb();

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO notifications (id, user_id, title, message, date, read, type)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(notif.id, userId, notif.title, notif.message, notif.date, notif.read ? 1 : 0, notif.type);
}

export async function deleteNotifications() {
  const userId = await getUserId();
  if (!userId) throw new Error("Unauthorized");
  getDb().prepare('DELETE FROM notifications WHERE user_id = ?').run(userId);
}
