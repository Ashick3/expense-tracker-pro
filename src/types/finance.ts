export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  name: string;
  category: string;
  amount: number;
  date: string;
  type: TransactionType;
}

export interface Budget {
  category: string;
  limit: number;
  icon?: string;
  color: string;
}

export interface TransactionCategory {
  id: string;
  name: string;
  color: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'alert' | 'warning' | 'info';
}

export interface Account {
  id: string;
  name: string;
  type: 'Bank' | 'Credit' | 'Cash' | 'Investment';
  balance: number;
  color: string;
  icon?: string;
}

export interface UserSettings {
  name: string;
  email: string;
  notifyBudget: boolean;
  notifySummary: boolean;
  theme: 'dark' | 'light';
  language: 'en' | 'ta';
  currency: 'USD' | 'INR';
}
