// Client-side localStorage persistence — no server required.

import type {
  Transaction,
  Budget,
  Account,
  TransactionCategory,
  UserSettings,
  AppNotification
} from '@/types/finance';

// ---------------------------------------------------------------------------
// Storage keys
// ---------------------------------------------------------------------------
const KEYS = {
  transactions: 'expense_pro_transactions',
  budgets: 'expense_pro_budgets',
  accounts: 'expense_pro_accounts',
  categories: 'expense_pro_categories',
  settings: 'expense_pro_settings',
  notifications: 'expense_pro_notifications',
} as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function read<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

function readList<T>(key: string): T[] {
  return read<T[]>(key) ?? [];
}

// ---------------------------------------------------------------------------
// Initial data (mirrored from TransactionContext so seeds are consistent)
// ---------------------------------------------------------------------------
const INITIAL_BUDGETS: Budget[] = [
  { category: 'Housing', limit: 1500, color: '#7c3aed' },
  { category: 'Food & Drink', limit: 500, color: '#ef4444' },
  { category: 'Transport', limit: 300, color: '#10b981' },
  { category: 'Shopping', limit: 800, color: '#f59e0b' },
  { category: 'Healthcare', limit: 400, color: '#3b82f6' },
  { category: 'Entertainment', limit: 200, color: '#ec4899' },
];

const INITIAL_ACCOUNTS: Account[] = [
  { id: 'acc1', name: 'Main Savings', type: 'Bank', balance: 12500, color: '#7c3aed' },
  { id: 'acc2', name: 'Checking Account', type: 'Bank', balance: 3400, color: '#10b981' },
  { id: 'acc3', name: 'Cash Wallet', type: 'Cash', balance: 850, color: '#f59e0b' },
];

const INITIAL_CATEGORIES: TransactionCategory[] = [
  { id: 'cat_housing', name: 'Housing', color: '#7c3aed' },
  { id: 'cat_food', name: 'Food & Drink', color: '#ef4444' },
  { id: 'cat_transport', name: 'Transport', color: '#10b981' },
  { id: 'cat_shopping', name: 'Shopping', color: '#f59e0b' },
  { id: 'cat_health', name: 'Healthcare', color: '#3b82f6' },
  { id: 'cat_entertainment', name: 'Entertainment', color: '#ec4899' },
  { id: 'cat_income', name: 'Income', color: '#10b981' },
];

const INITIAL_SETTINGS: UserSettings = {
  name: 'Alex Johnson',
  email: 'alex.j@example.com',
  notifyBudget: true,
  notifySummary: false,
  theme: 'dark',
  language: 'en',
  currency: 'INR',
};

// ---------------------------------------------------------------------------
// Public API — same signatures as the old server actions
// ---------------------------------------------------------------------------

export async function initializeDatabase(): Promise<boolean> {
  // Seed defaults only on first run (when nothing is stored yet).
  if (read(KEYS.settings) === null) {
    write(KEYS.budgets, INITIAL_BUDGETS);
    write(KEYS.accounts, INITIAL_ACCOUNTS);
    write(KEYS.categories, INITIAL_CATEGORIES);
    write(KEYS.settings, INITIAL_SETTINGS);
    write(KEYS.transactions, []);
    write(KEYS.notifications, []);
  }
  return true;
}

export async function getInitialData() {
  await initializeDatabase();

  const transactions = (readList<Transaction>(KEYS.transactions))
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const budgets = readList<Budget>(KEYS.budgets);
  const accounts = readList<Account>(KEYS.accounts);
  const categories = readList<TransactionCategory>(KEYS.categories);
  const settings = read<UserSettings>(KEYS.settings);
  const notifications = (readList<AppNotification>(KEYS.notifications))
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return { transactions, budgets, accounts, categories, settings, notifications };
}

// ---- Transactions ----

export async function saveTransaction(tx: Transaction): Promise<void> {
  const list = readList<Transaction>(KEYS.transactions);
  const idx = list.findIndex(t => t.id === tx.id);
  if (idx >= 0) list[idx] = tx;
  else list.push(tx);
  write(KEYS.transactions, list);
}

export async function deleteTransactionRecord(id: string): Promise<void> {
  write(KEYS.transactions, readList<Transaction>(KEYS.transactions).filter(t => t.id !== id));
}

// ---- Budgets ----

export async function saveBudget(budget: Budget): Promise<void> {
  const list = readList<Budget>(KEYS.budgets);
  const idx = list.findIndex(b => b.category === budget.category);
  if (idx >= 0) list[idx] = budget;
  else list.push(budget);
  write(KEYS.budgets, list);
}

// ---- Accounts ----

export async function saveAccount(acc: Account): Promise<void> {
  const list = readList<Account>(KEYS.accounts);
  const idx = list.findIndex(a => a.id === acc.id);
  if (idx >= 0) list[idx] = acc;
  else list.push(acc);
  write(KEYS.accounts, list);
}

export async function deleteAccountRecord(id: string): Promise<void> {
  write(KEYS.accounts, readList<Account>(KEYS.accounts).filter(a => a.id !== id));
}

// ---- Categories ----

export async function saveCategory(cat: TransactionCategory): Promise<void> {
  const list = readList<TransactionCategory>(KEYS.categories);
  const idx = list.findIndex(c => c.id === cat.id);
  if (idx >= 0) list[idx] = cat;
  else list.push(cat);
  write(KEYS.categories, list);
}

export async function deleteCategoryRecord(id: string): Promise<void> {
  write(KEYS.categories, readList<TransactionCategory>(KEYS.categories).filter(c => c.id !== id));
}

// ---- Settings ----

export async function saveSettings(settings: UserSettings): Promise<void> {
  write(KEYS.settings, settings);
}

// ---- Notifications ----

export async function saveNotification(notif: AppNotification): Promise<void> {
  const list = readList<AppNotification>(KEYS.notifications);
  const idx = list.findIndex(n => n.id === notif.id);
  if (idx >= 0) list[idx] = notif;
  else list.push(notif);
  write(KEYS.notifications, list);
}

export async function deleteNotifications(): Promise<void> {
  write(KEYS.notifications, []);
}

// ---- Auth stubs (kept so any existing import doesn't break) ----

export async function registerUser(formData: { name: string; email: string; password: string }) {
  // No server — just return success. The context handles actual user state.
  return { success: true, user: { id: 'local-user', name: formData.name, email: formData.email } };
}

export async function loginUser(formData: { email: string; password: string }) {
  return { success: true, user: { id: 'local-user', email: formData.email } };
}
