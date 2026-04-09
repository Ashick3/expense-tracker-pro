"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

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
}

interface TransactionContextType {
  transactions: Transaction[];
  budgets: Budget[];
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  updateTransaction: (id: string, tx: Omit<Transaction, 'id'>) => void;
  updateBudget: (budget: Budget) => void;
  addBudget: (budget: Budget) => void;
  clearData: () => void;
  getTotals: () => { balance: number; income: number; expenses: number; totalIncome: number; totalExpenses: number };
  getCategorySpending: (category: string) => number;
  isAddModalOpen: boolean;
  editingTransaction: Transaction | null;
  openAddModal: (tx?: Transaction) => void;
  closeAddModal: () => void;
  exportData: () => void;
  resetDatabase: () => void;
  accounts: Account[];
  addAccount: (acc: Omit<Account, 'id'>) => void;
  updateAccount: (id: string, acc: Omit<Account, 'id'>) => void;
  deleteAccount: (id: string) => void;
  userSettings: UserSettings;
  updateUserSettings: (settings: Partial<UserSettings>) => void;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

const INITIAL_BUDGETS: Budget[] = [
  { category: 'Housing', limit: 1500, color: '#7c3aed' },
  { category: 'Food & Drink', limit: 500, color: '#ef4444' },
  { category: 'Transport', limit: 300, color: '#10b981' },
  { category: 'Shopping', limit: 800, color: '#f59e0b' },
  { category: 'Healthcare', limit: 400, color: '#3b82f6' },
  { category: 'Entertainment', limit: 200, color: '#ec4899' },
];

const INITIAL_TRANSACTIONS: Transaction[] = [];

const INITIAL_ACCOUNTS: Account[] = [
  { id: 'acc1', name: 'Main Savings', type: 'Bank', balance: 12500, color: '#7c3aed' },
  { id: 'acc2', name: 'Checking Account', type: 'Bank', balance: 3400, color: '#10b981' },
  { id: 'acc3', name: 'Cash Wallet', type: 'Cash', balance: 850, color: '#f59e0b' },
];

const INITIAL_SETTINGS: UserSettings = {
  name: 'Alex Johnson',
  email: 'alex.j@example.com',
  notifyBudget: true,
  notifySummary: false,
  theme: 'dark',
  language: 'en'
};

const INITIAL_SIDEBAR_STATE = false;

export function TransactionProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>(INITIAL_BUDGETS);
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [userSettings, setUserSettings] = useState<UserSettings>(INITIAL_SETTINGS);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(INITIAL_SIDEBAR_STATE);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // Load data from localStorage
  useEffect(() => {
    const savedTransactions = localStorage.getItem('expense_pro_transactions');
    const savedBudgets = localStorage.getItem('expense_pro_budgets');
    const savedAccounts = localStorage.getItem('expense_pro_accounts');
    const savedSettings = localStorage.getItem('expense_pro_settings');
    const savedSidebar = localStorage.getItem('expense_pro_sidebar_collapsed');

    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    } else {
      setTransactions(INITIAL_TRANSACTIONS);
    }

    if (savedBudgets) {
      setBudgets(JSON.parse(savedBudgets));
    }

    if (savedAccounts) {
      setAccounts(JSON.parse(savedAccounts));
    }

    if (savedSettings) {
      setUserSettings(JSON.parse(savedSettings));
    }

    if (savedSidebar) {
      setIsSidebarCollapsed(JSON.parse(savedSidebar));
    }

    setIsLoaded(true);
  }, []);

  // Save data to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('expense_pro_transactions', JSON.stringify(transactions));
      localStorage.setItem('expense_pro_budgets', JSON.stringify(budgets));
      localStorage.setItem('expense_pro_accounts', JSON.stringify(accounts));
      localStorage.setItem('expense_pro_settings', JSON.stringify(userSettings));
      localStorage.setItem('expense_pro_sidebar_collapsed', JSON.stringify(isSidebarCollapsed));
    }
  }, [transactions, budgets, accounts, userSettings, isSidebarCollapsed, isLoaded]);

  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    const newTx = { ...tx, id: Math.random().toString(36).substr(2, 9) };
    setTransactions(prev => [newTx, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id));
  };

  const updateTransaction = (id: string, updatedTx: Omit<Transaction, 'id'>) => {
    setTransactions(prev => prev.map(tx => tx.id === id ? { ...updatedTx, id } : tx));
  };

  const updateBudget = (updatedBudget: Budget) => {
    setBudgets(prev => prev.map(b => b.category === updatedBudget.category ? updatedBudget : b));
  };

  const addBudget = (newBudget: Budget) => {
    setBudgets(prev => [...prev, newBudget]);
  };

  const clearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      setTransactions([]);
      setBudgets(INITIAL_BUDGETS);
      localStorage.removeItem('expense_pro_transactions');
      localStorage.removeItem('expense_pro_budgets');
      // Notify the user
      alert('Application data has been successfully cleared.');
      // Force a reload to ensure clean state across all components
      window.location.reload();
    }
  };

  const exportData = () => {
    const data = {
      transactions,
      budgets,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `expense_pro_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const resetDatabase = () => {
    setTransactions([]);
    setBudgets(INITIAL_BUDGETS);
    setAccounts(INITIAL_ACCOUNTS);
    setUserSettings(INITIAL_SETTINGS);
    localStorage.removeItem('expense_pro_transactions');
    localStorage.removeItem('expense_pro_budgets');
    localStorage.removeItem('expense_pro_accounts');
    localStorage.removeItem('expense_pro_settings');
  };

  const addAccount = (acc: Omit<Account, 'id'>) => {
    const newAcc = { ...acc, id: Math.random().toString(36).substr(2, 9) };
    setAccounts(prev => [...prev, newAcc]);
  };

  const updateAccount = (id: string, updatedAcc: Omit<Account, 'id'>) => {
    setAccounts(prev => prev.map(acc => acc.id === id ? { ...updatedAcc, id } : acc));
  };

  const deleteAccount = (id: string) => {
    setAccounts(prev => prev.filter(acc => acc.id !== id));
  };

  const updateUserSettings = (settings: Partial<UserSettings>) => {
    setUserSettings(prev => ({ ...prev, ...settings }));
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev);
  };

  const openAddModal = (tx?: Transaction) => {
    if (tx) setEditingTransaction(tx);
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setEditingTransaction(null);
  };

  const getTotals = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Monthly Totals
    const monthlyTransactions = transactions.filter(tx => {
      const d = new Date(tx.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const monthlyIncome = monthlyTransactions
      .filter(tx => tx.type === 'income')
      .reduce((sum, tx) => sum + tx.amount, 0);
    const monthlyExpenses = monthlyTransactions
      .filter(tx => tx.type === 'expense')
      .reduce((sum, tx) => sum + tx.amount, 0);

    // All-Time Totals
    const totalIncome = transactions
      .filter(tx => tx.type === 'income')
      .reduce((sum, tx) => sum + tx.amount, 0);
    const totalExpenses = transactions
      .filter(tx => tx.type === 'expense')
      .reduce((sum, tx) => sum + tx.amount, 0);

    return {
      balance: totalIncome - totalExpenses,
      income: monthlyIncome,
      expenses: monthlyExpenses,
      totalIncome,
      totalExpenses
    };
  };

  const getCategorySpending = (category: string) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return transactions
      .filter(tx => {
        const d = new Date(tx.date);
        return tx.category === category && 
               tx.type === 'expense' &&
               d.getMonth() === currentMonth &&
               d.getFullYear() === currentYear;
      })
      .reduce((sum, tx) => sum + tx.amount, 0);
  };

  return (
    <TransactionContext.Provider value={{ 
      transactions, 
      budgets, 
      addTransaction, 
      deleteTransaction, 
      updateTransaction,
      updateBudget,
      addBudget,
      clearData,
      getTotals,
      getCategorySpending,
      isAddModalOpen,
      editingTransaction,
      openAddModal,
      closeAddModal,
      exportData,
      resetDatabase,
      accounts,
      addAccount,
      updateAccount,
      deleteAccount,
      userSettings,
      updateUserSettings,
      isSidebarCollapsed,
      toggleSidebar
    }}>
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
}
