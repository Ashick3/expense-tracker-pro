"use client";

import { useState } from 'react';
import { Search, Filter, Download, Plus, MoreHorizontal, ArrowUpRight, ArrowDownLeft, Calendar, Tag, Trash2, Edit2 } from 'lucide-react';
import styles from './Transactions.module.css';
import { useTransactions } from '@/context/TransactionContext';
import { useTranslation } from '@/hooks/useTranslation';
import { exportToCsv } from '@/utils/exportCsv';
import Tooltip from '@/components/ui/Tooltip';

export default function Transactions() {
  const { transactions, deleteTransaction, openAddModal, currencySymbol } = useTransactions();
  const t = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | 'week' | 'month' | 'year'>('all');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');

  const categories = ['All', ...Array.from(new Set(transactions.map(tx => tx.category)))];

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tx.category.toLowerCase().includes(searchQuery.toLowerCase());
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const txDate = new Date(tx.date);
      const today = new Date();
      
      if (dateFilter === 'week') {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        matchesDate = txDate >= startOfWeek;
      } else if (dateFilter === 'month') {
        matchesDate = txDate.getMonth() === today.getMonth() && txDate.getFullYear() === today.getFullYear();
      } else if (dateFilter === 'year') {
        matchesDate = txDate.getFullYear() === today.getFullYear();
      }
    }
    const matchesCategory = categoryFilter === 'All' || tx.category === categoryFilter;
    const matchesType = typeFilter === 'all' || tx.type === typeFilter;
    return matchesSearch && matchesDate && matchesCategory && matchesType;
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className="text-gradient">{t.transactions.title}</h1>
          <p className={styles.subtitle}>{t.transactions.subtitle}</p>
        </div>
        <div className={styles.headerActions}>
          <Tooltip text={t.transactions.exportCSV}>
            <button className={styles.exportBtn} onClick={() => exportToCsv('transactions.csv', transactions)}>
              <Download size={18} />
              <span>{t.transactions.exportCSV}</span>
            </button>
          </Tooltip>
          <Tooltip text={t.transactions.addTransaction}>
            <button className={styles.addBtn} onClick={() => openAddModal()}>
              <Plus size={18} />
              <span>{t.transactions.addTransaction}</span>
            </button>
          </Tooltip>
        </div>
      </div>

      <div className={`glass-card ${styles.filtersSection}`}>
        <div className={styles.searchWrapper}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder={t.transactions.searchPlaceholder}
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className={styles.filterBtns}>
          <div className={styles.filterGroup}>
            <Calendar size={18} className={styles.filterIcon} />
            <select className={styles.filterSelect} value={dateFilter} onChange={(e) => setDateFilter(e.target.value as any)}>
              <option value="all">{t.transactions.allTime}</option>
              <option value="week">{t.transactions.thisWeek}</option>
              <option value="month">{t.transactions.thisMonth}</option>
              <option value="year">{t.transactions.thisYear}</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <Tag size={18} className={styles.filterIcon} />
            <select className={styles.filterSelect} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <Filter size={18} className={styles.filterIcon} />
            <select className={styles.filterSelect} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as 'all' | 'income' | 'expense')}>
              <option value="all">{t.transactions.all}</option>
              <option value="income">{t.transactions.income}</option>
              <option value="expense">{t.transactions.expense}</option>
            </select>
          </div>
        </div>
      </div>

      <div className={`glass-card ${styles.tableContainer}`}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{t.transactions.name}</th>
              <th>{t.transactions.category}</th>
              <th>{t.transactions.date}</th>
              <th>{t.transactions.status}</th>
              <th>{t.transactions.amount}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((tx) => (
                <tr key={tx.id} className={styles.row}>
                  <td>
                    <div className={styles.txNameCell}>
                      <div className={`${styles.iconMarker} ${tx.type === 'income' ? styles.incomeIcon : styles.expenseIcon}`}>
                        {tx.type === 'income' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                      </div>
                      <span>{tx.name}</span>
                    </div>
                  </td>
                  <td><span className={styles.categoryTag}>{tx.category}</span></td>
                  <td>{tx.date}</td>
                  <td><span className={styles.statusBadge}>{t.transactions.completed}</span></td>
                  <td className={tx.type === 'income' ? styles.incomeText : styles.expenseText}>
                    {tx.type === 'income' ? '+' : '-'}{currencySymbol}{Math.abs(tx.amount).toFixed(2)}
                  </td>
                  <td>
                    <div className={styles.rowActions}>
                      <Tooltip text={t.transactions.edit}>
                        <button className={styles.editBtn} onClick={() => openAddModal(tx)}><Edit2 size={16} /></button>
                      </Tooltip>
                      <Tooltip text={t.transactions.delete}>
                        <button className={styles.deleteBtn} onClick={() => deleteTransaction(tx.id)}><Trash2 size={16} /></button>
                      </Tooltip>
                      <Tooltip text="More">
                        <button className={styles.moreBtn}><MoreHorizontal size={18} /></button>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>
                  {t.transactions.noTransactions}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
