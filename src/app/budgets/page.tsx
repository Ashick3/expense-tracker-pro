"use client";

import { useMemo, useState } from 'react';
import { Plus, AlertTriangle, CheckCircle2, Home, Utensils, Car, Laptop, Heart, Briefcase } from 'lucide-react';
import styles from './Budgets.module.css';
import { useTransactions, Budget } from '@/context/TransactionContext';
import { useTranslation } from '@/hooks/useTranslation';
import Tooltip from '@/components/ui/Tooltip';
import Modal from '@/components/ui/Modal';

const ICON_MAP: Record<string, any> = {
  'Housing': Home, 'Food & Drink': Utensils, 'Transport': Car,
  'Shopping': Laptop, 'Healthcare': Heart,
  'Entertainment': ({ size }: { size: number }) => <Briefcase size={size} />,
};

export default function Budgets() {
  const { budgets, getCategorySpending, transactions, updateBudget, addBudget } = useTransactions();
  const t = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [formData, setFormData] = useState({ category: '', limit: '', color: '#7c3aed' });

  const totalSpent = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    return transactions
      .filter(tx => {
        const d = new Date(tx.date);
        return tx.type === 'expense' && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum, tx) => sum + tx.amount, 0);
  }, [transactions]);

  const totalLimit = useMemo(() => budgets.reduce((acc, curr) => acc + curr.limit, 0), [budgets]);
  const overallProgress = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0;

  const budgetStats = useMemo(() => {
    let onTrack = 0, overLimit = 0;
    budgets.forEach(b => { const spent = getCategorySpending(b.category); if (spent > b.limit) overLimit++; else onTrack++; });
    return { onTrack, overLimit };
  }, [budgets, getCategorySpending]);

  const handleEditClick = (budget: Budget) => {
    setEditingBudget(budget);
    setFormData({ category: budget.category, limit: budget.limit.toString(), color: budget.color });
    setIsModalOpen(true);
  };

  const handleNewClick = () => {
    setEditingBudget(null);
    setFormData({ category: '', limit: '', color: '#7c3aed' });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category || !formData.limit) return;
    const budgetData: Budget = { category: formData.category, limit: parseFloat(formData.limit), color: formData.color };
    if (editingBudget) { updateBudget(budgetData); } else { addBudget(budgetData); }
    setIsModalOpen(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className="text-gradient">{t.budgets.title}</h1>
          <p className={styles.subtitle}>{t.budgets.subtitle}</p>
        </div>
        <Tooltip text={t.budgets.addBudget}>
          <button className={styles.addBtn} onClick={handleNewClick}>
            <Plus size={18} /><span>{t.budgets.addBudget}</span>
          </button>
        </Tooltip>
      </div>

      <div className={`glass-card ${styles.summaryCard}`}>
        <div className={styles.summaryInfo}>
          <div className={styles.summaryText}>
            <h3>{t.budgets.monthlyStatus}</h3>
            <p className={styles.summaryDetail}>
              {t.budgets.spent}: <strong>${totalSpent.toLocaleString()}</strong> / <strong>${totalLimit.toLocaleString()}</strong>
            </p>
          </div>
          <div className={styles.overallProgressRing}>
            <svg viewBox="0 0 36 36" className={styles.circularChart}>
              <path className={styles.circleBg} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className={styles.circle}
                strokeDasharray={`${Math.min(overallProgress, 100)}, 100`}
                style={{ stroke: overallProgress > 100 ? 'var(--error)' : 'var(--primary)' }}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <text x="18" y="20.35" className={styles.percentage}>{Math.round(overallProgress)}%</text>
            </svg>
          </div>
        </div>
        <div className={styles.summaryFooter}>
          <div className={styles.summaryStat}>
            <CheckCircle2 size={16} color="var(--success)" />
            <span>{budgetStats.onTrack} {t.budgets.catsOnTrack}</span>
          </div>
          <div className={styles.summaryStat}>
            <AlertTriangle size={16} color="var(--error)" />
            <span>{budgetStats.overLimit} {t.budgets.catsOverLimit}</span>
          </div>
        </div>
      </div>

      <div className={styles.budgetsGrid}>
        {budgets.map((budget) => {
          const spent = getCategorySpending(budget.category);
          const progress = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;
          const isOver = spent > budget.limit;
          const isNear = progress > 80 && !isOver;
          const Icon = ICON_MAP[budget.category] || Briefcase;

          return (
            <div key={budget.category} className={`glass-card ${styles.budgetCard}`}>
              <div className={styles.cardHeader}>
                <div className={styles.iconBox} style={{ backgroundColor: `${budget.color}20`, color: budget.color }}>
                  <Icon size={24} />
                </div>
                <div className={styles.titleBox}>
                  <h4>{budget.category}</h4>
                  <p className={isOver ? styles.atRisk : styles.onTrack}>
                    {isOver ? t.budgets.overLimit : isNear ? t.budgets.atRisk : t.budgets.onTrack}
                  </p>
                </div>
              </div>
              <div className={styles.progressSection}>
                <div className={styles.progressLabels}>
                  <span>${spent.toLocaleString()} {t.budgets.spent}</span>
                  <span>${budget.limit.toLocaleString()} {t.budgets.limit}</span>
                </div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill}
                    style={{ width: `${Math.min(progress, 100)}%`, backgroundColor: isOver ? 'var(--error)' : isNear ? 'var(--warning)' : budget.color }} />
                </div>
              </div>
              <div className={styles.cardFooter}>
                <div className={styles.remaining}>
                  {isOver ? (
                    <span className={styles.overText}>{t.budgets.exceeded} ${(spent - budget.limit).toLocaleString()}</span>
                  ) : (
                    <span className={styles.underText}>${(budget.limit - spent).toLocaleString()} {t.budgets.remaining}</span>
                  )}
                </div>
                <Tooltip text={t.budgets.editBudget}>
                  <button className={styles.editBtn} onClick={() => handleEditClick(budget)}>{t.budgets.editBudget.split(' ')[0]}</button>
                </Tooltip>
              </div>
            </div>
          );
        })}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingBudget ? t.budgets.editBudget : t.budgets.addBudget}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>{t.budgets.budgetCategory}</label>
            <input type="text" className="glass-input" placeholder="e.g. Subscriptions"
              value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              disabled={!!editingBudget} required />
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>{t.budgets.budgetLimit} ($)</label>
              <input type="number" className="glass-input" placeholder="0.00" step="0.01"
                value={formData.limit} onChange={(e) => setFormData({ ...formData, limit: e.target.value })} required />
            </div>
            <div className={styles.formGroup}>
              <label>{t.budgets.themeColor}</label>
              <input type="color" className={`glass-input ${styles.colorPicker}`}
                value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} />
            </div>
          </div>
          <button type="submit" className={styles.submitBtn}>
            {editingBudget ? t.budgets.save : t.budgets.addBudget}
          </button>
        </form>
      </Modal>
    </div>
  );
}
