"use client";

import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import { useTransactions, TransactionType } from '@/context/TransactionContext';
import styles from './GlobalTransactionModal.module.css';

export default function GlobalTransactionModal() {
  const { 
    isAddModalOpen, 
    closeAddModal, 
    addTransaction, 
    updateTransaction, 
    editingTransaction 
  } = useTransactions();

  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    category: 'Food & Drink',
    date: new Date().toISOString().split('T')[0],
    type: 'expense' as TransactionType
  });

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        name: editingTransaction.name,
        amount: editingTransaction.amount.toString(),
        category: editingTransaction.category,
        date: editingTransaction.date,
        type: editingTransaction.type
      });
    } else {
      setFormData({
        name: '',
        amount: '',
        category: 'Food & Drink',
        date: new Date().toISOString().split('T')[0],
        type: 'expense'
      });
    }
  }, [editingTransaction, isAddModalOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.amount) return;

    const txData = {
      name: formData.name,
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
      type: formData.type
    };

    if (editingTransaction) {
      updateTransaction(editingTransaction.id, txData);
    } else {
      addTransaction(txData);
    }

    closeAddModal();
  };

  return (
    <Modal 
      isOpen={isAddModalOpen} 
      onClose={closeAddModal} 
      title={editingTransaction ? "Edit Transaction" : "Add New Transaction"}
    >
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>Transaction Name</label>
          <input 
            type="text" 
            className="glass-input" 
            placeholder="e.g. Starbucks"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Amount</label>
            <input 
              type="number" 
              className="glass-input" 
              placeholder="0.00"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Type</label>
            <select 
              className="glass-input"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as TransactionType })}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Category</label>
            <select 
              className="glass-input"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option>Housing</option>
              <option>Food & Drink</option>
              <option>Transport</option>
              <option>Shopping</option>
              <option>Healthcare</option>
              <option>Entertainment</option>
              <option>Income</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Date</label>
            <input 
              type="date" 
              className="glass-input"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
        </div>
        <button type="submit" className={styles.submitBtn}>
          {editingTransaction ? "Update Transaction" : "Save Transaction"}
        </button>
      </form>
    </Modal>
  );
}
