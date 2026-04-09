"use client";

import { useState } from 'react';
import { CreditCard, Wallet, Landmark, TrendingUp, Trash2, Plus } from 'lucide-react';
import styles from './Accounts.module.css';
import { useTransactions, Account } from '@/context/TransactionContext';
import { useTranslation } from '@/hooks/useTranslation';
import Tooltip from '@/components/ui/Tooltip';
import Modal from '@/components/ui/Modal';

const ICON_MAP: Record<string, any> = {
  'Bank': Landmark,
  'Credit': CreditCard,
  'Cash': Wallet,
  'Investment': TrendingUp,
};

export default function Accounts() {
  const { accounts, addAccount, updateAccount, deleteAccount, currencySymbol } = useTransactions();
  const t = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    type: 'Bank' as Account['type'],
    balance: '',
    color: '#7c3aed'
  });

  const handleEditClick = (acc: Account) => {
    setEditingAccount(acc);
    setFormData({ name: acc.name, type: acc.type, balance: acc.balance.toString(), color: acc.color });
    setIsModalOpen(true);
  };

  const handleNewClick = () => {
    setEditingAccount(null);
    setFormData({ name: '', type: 'Bank', balance: '', color: '#7c3aed' });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.balance) return;
    const accountData: Omit<Account, 'id'> = {
      name: formData.name, type: formData.type,
      balance: parseFloat(formData.balance), color: formData.color
    };
    if (editingAccount) { updateAccount(editingAccount.id, accountData); }
    else { addAccount(accountData); }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure?')) { deleteAccount(id); }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className="text-gradient">{t.accounts.title}</h1>
          <p className={styles.subtitle}>{t.accounts.subtitle}</p>
        </div>
        <Tooltip text={t.accounts.addAccount}>
          <button className={styles.addBtn} onClick={handleNewClick}>
            <Plus size={18} /><span>{t.accounts.addAccount}</span>
          </button>
        </Tooltip>
      </div>

      <div className={styles.grid}>
        {accounts.map((acc) => {
          const Icon = ICON_MAP[acc.type] || Landmark;
          return (
            <div key={acc.id} className={`glass-card ${styles.accountCard}`} onClick={() => handleEditClick(acc)} style={{ cursor: 'pointer' }}>
              <div className={styles.cardHeader}>
                <div className={styles.iconBox} style={{ backgroundColor: `${acc.color}20`, color: acc.color }}>
                  <Icon size={24} />
                </div>
                <div className={styles.status}>
                  <span className={styles.statusDot} />
                  Active
                </div>
              </div>
              <div className={styles.cardContent}>
                <h3>{acc.name}</h3>
                <p className={styles.accType}>{acc.type}</p>
                <p className={styles.balance}>{currencySymbol}{acc.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              </div>
              <div className={styles.cardFooter}>
                <Tooltip text={t.accounts.editAccount}>
                  <button className={styles.actionBtn} onClick={() => handleEditClick(acc)}>{t.accounts.editAccount}</button>
                </Tooltip>
                <Tooltip text={t.accounts.deleteAccount}>
                  <button className={styles.actionBtn} style={{ color: 'var(--error)' }} onClick={(e) => handleDelete(acc.id, e)}>
                    <Trash2 size={16} />
                  </button>
                </Tooltip>
              </div>
            </div>
          );
        })}

      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingAccount ? t.accounts.editAccount : t.accounts.linkAccount}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>{t.accounts.accountName}</label>
            <input type="text" className="glass-input" placeholder="e.g. Chase Savings"
              value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>{t.accounts.accountType}</label>
              <select className="glass-input" value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as Account['type'] })}>
                <option value="Bank">Bank Account</option>
                <option value="Credit">Credit Card</option>
                <option value="Cash">Cash / Wallet</option>
                <option value="Investment">Investment</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Theme Color</label>
              <input type="color" className={`glass-input ${styles.colorPicker}`}
                value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>{t.accounts.balance} ({currencySymbol})</label>
            <input type="number" className="glass-input" placeholder="0.00" step="0.01"
              value={formData.balance} onChange={(e) => setFormData({ ...formData, balance: e.target.value })} required />
          </div>
          <button type="submit" className={styles.submitBtn}>
            {editingAccount ? t.accounts.editAccount : t.accounts.linkAccount}
          </button>
        </form>
      </Modal>
    </div>
  );
}
