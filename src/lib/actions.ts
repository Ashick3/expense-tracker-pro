'use server';

import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth";
import bcrypt from "bcryptjs";
import { readDb, writeDb, initializeDatabase } from './db';
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
  
  await initializeDatabase();
  const dbConfig = await readDb();
  
  if (dbConfig.users.find((u: any) => u.email === email)) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = Math.random().toString(36).substr(2, 9);
  
  dbConfig.users.push({
    id: userId,
    name,
    email,
    password: hashedPassword,
    createdAt: new Date().toISOString()
  });

  dbConfig.settings.push({
    user_id: userId,
    name,
    email,
    notifyBudget: 1,
    notifySummary: 0,
    theme: 'dark',
    language: 'en',
    currency: 'INR'
  });

  await writeDb(dbConfig);
  return { success: true };
}

export async function getInitialData() {
  const userId = await getUserId();
  if (!userId) return { transactions: [], budgets: [], accounts: [], categories: [], settings: null, notifications: [] };

  await initializeDatabase();
  const dbConfig = await readDb();

  const transactions = dbConfig.transactions
    .filter((t: any) => t.user_id === userId)
    .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const budgets: Budget[] = dbConfig.budgets
    .filter((b: any) => b.user_id === userId)
    .map((row: any) => ({
      category: row.category,
      limit: row.limit_amount,
      color: row.color,
      icon: row.icon
    }));

  const accounts = dbConfig.accounts.filter((a: any) => a.user_id === userId);
  const categories = dbConfig.categories.filter((c: any) => c.user_id === userId);
  
  const settingsRow = dbConfig.settings.find((s: any) => s.user_id === userId);
  const settings: UserSettings | null = settingsRow ? {
    name: settingsRow.name,
    email: settingsRow.email,
    notifyBudget: Boolean(settingsRow.notifyBudget),
    notifySummary: Boolean(settingsRow.notifySummary),
    theme: settingsRow.theme,
    language: settingsRow.language,
    currency: settingsRow.currency
  } : null;

  const notifications = dbConfig.notifications
    .filter((n: any) => n.user_id === userId)
    .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((row: any) => ({
      id: row.id,
      title: row.title,
      message: row.message,
      date: row.date,
      read: Boolean(row.read),
      type: row.type
    }));

  return { transactions, budgets, accounts, categories, settings, notifications };
}

// Transaction Actions
export async function saveTransaction(tx: Transaction) {
  const userId = await getUserId();
  if (!userId) throw new Error("Unauthorized");
  
  const dbConfig = await readDb();
  const index = dbConfig.transactions.findIndex((t: any) => t.id === tx.id && t.user_id === userId);
  const newTx = { ...tx, user_id: userId };
  
  if (index >= 0) dbConfig.transactions[index] = newTx;
  else dbConfig.transactions.push(newTx);
  
  await writeDb(dbConfig);
}

export async function deleteTransaction(id: string) {
  const userId = await getUserId();
  if (!userId) throw new Error("Unauthorized");
  
  const dbConfig = await readDb();
  dbConfig.transactions = dbConfig.transactions.filter((t: any) => !(t.id === id && t.user_id === userId));
  await writeDb(dbConfig);
}

// Budget Actions
export async function saveBudget(budget: Budget) {
  const userId = await getUserId();
  if (!userId) throw new Error("Unauthorized");

  const id = `${userId}_${budget.category}`;
  const dbConfig = await readDb();
  
  const index = dbConfig.budgets.findIndex((b: any) => b.id === id && b.user_id === userId);
  const newBudget = { id, user_id: userId, category: budget.category, limit_amount: budget.limit, color: budget.color, icon: budget.icon };
  
  if (index >= 0) dbConfig.budgets[index] = newBudget;
  else dbConfig.budgets.push(newBudget);
  
  await writeDb(dbConfig);
}

// Account Actions
export async function saveAccount(acc: Account) {
  const userId = await getUserId();
  if (!userId) throw new Error("Unauthorized");

  const dbConfig = await readDb();
  const index = dbConfig.accounts.findIndex((a: any) => a.id === acc.id && a.user_id === userId);
  const newAcc = { ...acc, user_id: userId };
  
  if (index >= 0) dbConfig.accounts[index] = newAcc;
  else dbConfig.accounts.push(newAcc);
  
  await writeDb(dbConfig);
}

export async function deleteAccount(id: string) {
  const userId = await getUserId();
  if (!userId) throw new Error("Unauthorized");

  const dbConfig = await readDb();
  dbConfig.accounts = dbConfig.accounts.filter((a: any) => !(a.id === id && a.user_id === userId));
  await writeDb(dbConfig);
}

// Category Actions
export async function saveCategory(cat: TransactionCategory) {
  const userId = await getUserId();
  if (!userId) throw new Error("Unauthorized");

  const dbConfig = await readDb();
  const index = dbConfig.categories.findIndex((c: any) => c.id === cat.id && c.user_id === userId);
  const newCat = { ...cat, user_id: userId };
  
  if (index >= 0) dbConfig.categories[index] = newCat;
  else dbConfig.categories.push(newCat);
  
  await writeDb(dbConfig);
}

export async function deleteCategory(id: string) {
  const userId = await getUserId();
  if (!userId) throw new Error("Unauthorized");

  const dbConfig = await readDb();
  dbConfig.categories = dbConfig.categories.filter((c: any) => !(c.id === id && c.user_id === userId));
  await writeDb(dbConfig);
}

// Settings Actions
export async function saveSettings(settings: UserSettings) {
  const userId = await getUserId();
  if (!userId) throw new Error("Unauthorized");

  const dbConfig = await readDb();
  const index = dbConfig.settings.findIndex((s: any) => s.user_id === userId);
  
  const newSettings = {
    user_id: userId,
    name: settings.name,
    email: settings.email,
    notifyBudget: settings.notifyBudget ? 1 : 0,
    notifySummary: settings.notifySummary ? 1 : 0,
    theme: settings.theme,
    language: settings.language || 'en',
    currency: settings.currency || 'INR'
  };
  
  if (index >= 0) dbConfig.settings[index] = newSettings;
  else dbConfig.settings.push(newSettings);
  
  await writeDb(dbConfig);
}

// Notification Actions
export async function saveNotification(notif: AppNotification) {
  const userId = await getUserId();
  if (!userId) throw new Error("Unauthorized");

  const dbConfig = await readDb();
  const index = dbConfig.notifications.findIndex((n: any) => n.id === notif.id && n.user_id === userId);
  const newNotif = { ...notif, user_id: userId, read: notif.read ? 1 : 0 };
  
  if (index >= 0) dbConfig.notifications[index] = newNotif;
  else dbConfig.notifications.push(newNotif);
  
  await writeDb(dbConfig);
}

export async function deleteNotifications() {
  const userId = await getUserId();
  if (!userId) throw new Error("Unauthorized");

  const dbConfig = await readDb();
  dbConfig.notifications = dbConfig.notifications.filter((n: any) => n.user_id !== userId);
  await writeDb(dbConfig);
}
