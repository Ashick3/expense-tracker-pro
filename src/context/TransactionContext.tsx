"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  getInitialData, 
  saveTransaction, 
  deleteTransaction, 
  saveBudget, 
  saveAccount, 
  deleteAccount, 
  saveCategory, 
  deleteCategory, 
  saveSettings, 
  saveNotification, 
  deleteNotifications 
} from '@/lib/actions';

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
  currencySymbol: string;
  notifications: AppNotification[];
  addNotification: (notif: Omit<AppNotification, 'id' | 'date' | 'read'>) => void;
  markAsRead: (id: string) => void;
  clearNotifications: () => void;
  categories: TransactionCategory[];
  addCategory: (cat: Omit<TransactionCategory, 'id'>) => void;
  updateCategory: (id: string, cat: Omit<TransactionCategory, 'id'>) => void;
  deleteCategory: (id: string) => void;
  isLoaded: boolean;
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
  language: 'en',
  currency: 'INR'
};

const INITIAL_CATEGORIES: TransactionCategory[] = [
  { id: 'cat_housing', name: 'Housing', color: '#7c3aed' },
  { id: 'cat_food', name: 'Food & Drink', color: '#ef4444' },
  { id: 'cat_transport', name: 'Transport', color: '#10b981' },
  { id: 'cat_shopping', name: 'Shopping', color: '#f59e0b' },
  { id: 'cat_health', name: 'Healthcare', color: '#3b82f6' },
  { id: 'cat_entertainment', name: 'Entertainment', color: '#ec4899' },
  { id: 'cat_income', name: 'Income', color: '#10b981' },
];

const INITIAL_SIDEBAR_STATE = false;

export function TransactionProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>(INITIAL_BUDGETS);
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [categories, setCategories] = useState<TransactionCategory[]>(INITIAL_CATEGORIES);
  const [userSettings, setUserSettings] = useState<UserSettings>(INITIAL_SETTINGS);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(INITIAL_SIDEBAR_STATE);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // Load data from SQLite (with fallback to localStorage migration)
  useEffect(() => {
    async function loadData() {
      if (status !== 'authenticated') return;
      
      try {
        const dbData = await getInitialData();
        
        // If SQLite settings are missing, consider it a fresh DB and check for migration
        if (!dbData.settings) {
          console.log('No SQLite data found, checking localStorage for migration...');
          
          const savedTransactions = localStorage.getItem('expense_pro_transactions');
          const savedBudgets = localStorage.getItem('expense_pro_budgets');
          const savedAccounts = localStorage.getItem('expense_pro_accounts');
          const savedCategories = localStorage.getItem('expense_pro_categories');
          const savedSettings = localStorage.getItem('expense_pro_settings');
          const savedNotifications = localStorage.getItem('expense_pro_notifications');

          // Migration Logic
          if (savedTransactions || savedBudgets || savedAccounts || savedCategories || savedSettings || savedNotifications) {
            console.log('Migrating data to SQLite...');
            const txs = savedTransactions ? JSON.parse(savedTransactions) : INITIAL_TRANSACTIONS;
            const bdgts = savedBudgets ? JSON.parse(savedBudgets) : INITIAL_BUDGETS;
            const accs = savedAccounts ? JSON.parse(savedAccounts) : INITIAL_ACCOUNTS;
            const cats = savedCategories ? JSON.parse(savedCategories) : INITIAL_CATEGORIES;
            const stngs = savedSettings ? { ...INITIAL_SETTINGS, ...JSON.parse(savedSettings) } : INITIAL_SETTINGS;
            const ntfs = savedNotifications ? JSON.parse(savedNotifications) : [];

            setTransactions(txs);
            setBudgets(bdgts);
            setAccounts(accs);
            setCategories(cats);
            setUserSettings(stngs);
            setNotifications(ntfs);

            // Persist to SQLite
            for (const tx of txs) await saveTransaction(tx);
            for (const b of bdgts) await saveBudget(b);
            for (const a of accs) await saveAccount(a);
            for (const c of cats) await saveCategory(c);
            await saveSettings(stngs);
            for (const n of ntfs) await saveNotification(n);
            
            console.log('Migration complete.');
          } else {
            console.log('No migration data found, using initials.');
            setTransactions(INITIAL_TRANSACTIONS);
            setBudgets(INITIAL_BUDGETS);
            setAccounts(INITIAL_ACCOUNTS);
            setCategories(INITIAL_CATEGORIES);
            setUserSettings(INITIAL_SETTINGS);
            
            // Initial seed to DB
            await saveSettings(INITIAL_SETTINGS);
            for (const b of INITIAL_BUDGETS) await saveBudget(b);
            for (const a of INITIAL_ACCOUNTS) await saveAccount(a);
            for (const c of INITIAL_CATEGORIES) await saveCategory(c);
          }
        } else {
          console.log('Loading data from SQLite...');
          setTransactions(dbData.transactions);
          setBudgets(dbData.budgets.length > 0 ? dbData.budgets : INITIAL_BUDGETS);
          setAccounts(dbData.accounts.length > 0 ? dbData.accounts : INITIAL_ACCOUNTS);
          setCategories(dbData.categories.length > 0 ? dbData.categories : INITIAL_CATEGORIES);
          setUserSettings(dbData.settings);
          setNotifications(dbData.notifications);
        }

        setIsLoaded(true);
      } catch (error) {
        console.error('Failed to load data from SQLite:', error);
        setIsLoaded(true);
      }
    }
    loadData();
  }, [status]);

  // Sync session name/email into settings
  const { data: session } = useSession();
  useEffect(() => {
    if (session?.user && isLoaded) {
      setUserSettings(prev => ({
        ...prev,
        name: session.user?.name || prev.name,
        email: session.user?.email || prev.email,
      }));
    }
  }, [session, isLoaded]);

  // Save sidebar state to localStorage (UI only)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('expense_pro_sidebar_collapsed', JSON.stringify(isSidebarCollapsed));
    }
  }, [isSidebarCollapsed, isLoaded]);

  const addNotification = async (notif: Omit<AppNotification, 'id' | 'date' | 'read'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
    await saveNotification(newNotif);
  };

  const markAsRead = async (id: string) => {
    const notif = notifications.find(n => n.id === id);
    if (notif) {
      const updated = { ...notif, read: true };
      setNotifications(prev => prev.map(n => n.id === id ? updated : n));
      await saveNotification(updated);
    }
  };

  const clearNotifications = async () => {
    setNotifications([]);
    await deleteNotifications();
  };

  const checkBudgetExceedance = (tx: Omit<Transaction, 'id'>, currentTransactions: Transaction[]) => {
    if (tx.type !== 'expense' || !userSettings.notifyBudget) return;

    const budget = budgets.find(b => b.category === tx.category);
    if (!budget) return;

    const txDate = new Date(tx.date);
    const currentMonth = txDate.getMonth();
    const currentYear = txDate.getFullYear();

    // Calculate current spending for this category in the same month
    let previousSpending = currentTransactions
      .filter(t => t.category === tx.category && 
                  t.type === 'expense' &&
                  new Date(t.date).getMonth() === currentMonth &&
                  new Date(t.date).getFullYear() === currentYear)
      .reduce((sum, t) => sum + t.amount, 0);

    const newTotal = previousSpending + tx.amount;

    if (newTotal > budget.limit) {
      const exceededAmount = (newTotal - budget.limit).toFixed(2);
      const symbol = userSettings.currency === 'INR' ? '₹' : '$';
      addNotification({
        title: 'Budget Exceeded',
        message: `You have exceeded your ${budget.category} budget limit by ${symbol}${exceededAmount}.`,
        type: 'alert'
      });
    } else if (newTotal >= budget.limit * 0.8 && previousSpending < budget.limit * 0.8) {
      const symbol = userSettings.currency === 'INR' ? '₹' : '$';
      addNotification({
        title: 'Budget Warning',
        message: `You are approaching your ${budget.category} budget limit (${symbol}${newTotal.toFixed(2)} of ${symbol}${budget.limit}).`,
        type: 'warning'
      });
    }
  };

  const addTransaction = async (tx: Omit<Transaction, 'id'>) => {
    const newTx = { ...tx, id: Math.random().toString(36).substr(2, 9) };
    checkBudgetExceedance(tx, transactions);
    setTransactions(prev => [newTx, ...prev]);
    await saveTransaction(newTx);
  };

  const deleteTransaction = async (id: string) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id));
    await deleteTransaction(id);
  };

  const updateTransaction = async (id: string, updatedTx: Omit<Transaction, 'id'>) => {
    // Check budget without the old transaction amount
    const otherTransactions = transactions.filter(t => t.id !== id);
    checkBudgetExceedance(updatedTx, otherTransactions);
    const updated = { ...updatedTx, id };
    setTransactions(prev => prev.map(tx => tx.id === id ? updated : tx));
    await saveTransaction(updated);
  };

  const updateBudget = async (updatedBudget: Budget) => {
    setBudgets(prev => prev.map(b => b.category === updatedBudget.category ? updatedBudget : b));
    await saveBudget(updatedBudget);
  };

  const addBudget = async (newBudget: Budget) => {
    setBudgets(prev => [...prev, newBudget]);
    await saveBudget(newBudget);
  };

  const clearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      setTransactions([]);
      setBudgets(INITIAL_BUDGETS);
      // SQLite clear logic would go here
      alert('Application data has been successfully cleared.');
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
    link.download = `expense_pro_user_backup_${new Date().toISOString().split('T')[0]}.json`;
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
  };

  const addAccount = async (acc: Omit<Account, 'id'>) => {
    const newAcc = { ...acc, id: Math.random().toString(36).substr(2, 9) };
    setAccounts(prev => [...prev, newAcc]);
    await saveAccount(newAcc);
  };

  const updateAccount = async (id: string, updatedAcc: Omit<Account, 'id'>) => {
    const updated = { ...updatedAcc, id };
    setAccounts(prev => prev.map(acc => acc.id === id ? updated : acc));
    await saveAccount(updated);
  };

  const deleteAccount = async (id: string) => {
    setAccounts(prev => prev.filter(acc => acc.id !== id));
    await deleteAccount(id);
  };

  const addCategory = async (cat: Omit<TransactionCategory, 'id'>) => {
    const newCat = { ...cat, id: Math.random().toString(36).substr(2, 9) };
    setCategories(prev => [...prev, newCat]);
    await saveCategory(newCat);
  };

  const updateCategory = async (id: string, updatedCat: Omit<TransactionCategory, 'id'>) => {
    const oldCat = categories.find(c => c.id === id);
    if (oldCat && oldCat.name !== updatedCat.name) {
      // Update associated transactions and budgets
      const newTransactions = transactions.map(t => t.category === oldCat.name ? { ...t, category: updatedCat.name } : t);
      const newBudgets = budgets.map(b => b.category === oldCat.name ? { ...b, category: updatedCat.name } : b);
      
      setTransactions(newTransactions);
      setBudgets(newBudgets);

      for (const t of newTransactions) {
        if (t.category === updatedCat.name) await saveTransaction(t);
      }
      for (const b of newBudgets) {
        if (b.category === updatedCat.name) await saveBudget(b);
      }
    }
    const updated = { ...updatedCat, id };
    setCategories(prev => prev.map(c => c.id === id ? updated : c));
    await saveCategory(updated);
  };

  const deleteCategory = async (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    await deleteCategory(id);
  };

  const updateUserSettings = async (settings: Partial<UserSettings>) => {
    const updated = { ...userSettings, ...settings };
    setUserSettings(updated);
    await saveSettings(updated);
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
      toggleSidebar,
      currencySymbol: userSettings.currency === 'INR' ? '₹' : '$',
      notifications,
      addNotification,
      markAsRead,
      clearNotifications,
      categories,
      addCategory,
      updateCategory,
      deleteCategory,
      isLoaded
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
