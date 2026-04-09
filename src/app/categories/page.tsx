"use client";

import { useState } from 'react';
import { Plus, Tags, Trash2 } from 'lucide-react';
import styles from './Categories.module.css';
import { useTransactions, TransactionCategory } from '@/context/TransactionContext';
import { useTranslation } from '@/hooks/useTranslation';
import Tooltip from '@/components/ui/Tooltip';
import Modal from '@/components/ui/Modal';

export default function Categories() {
  const { categories, addCategory, updateCategory, deleteCategory } = useTransactions();
  const t = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<TransactionCategory | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    color: '#7c3aed'
  });

  const handleEditClick = (cat: TransactionCategory) => {
    setEditingCategory(cat);
    setFormData({ name: cat.name, color: cat.color });
    setIsModalOpen(true);
  };

  const handleNewClick = () => {
    setEditingCategory(null);
    setFormData({ name: '', color: '#7c3aed' });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    
    // Prevent duplicate exact names
    if (!editingCategory && categories.some(c => c.name.toLowerCase() === formData.name.toLowerCase())) {
        alert("A category with this name already exists.");
        return;
    }

    const catData: Omit<TransactionCategory, 'id'> = {
      name: formData.name, 
      color: formData.color
    };
    
    if (editingCategory) { 
        updateCategory(editingCategory.id, catData); 
    } else { 
        addCategory(catData); 
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this category? Associated transactions will lose their colored tag match.')) { 
        deleteCategory(id); 
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className="text-gradient">{t.categories.title}</h1>
          <p className={styles.subtitle}>{t.categories.subtitle}</p>
        </div>
        <Tooltip text={t.categories.addCategory}>
          <button className={styles.addBtn} onClick={handleNewClick}>
            <Plus size={18} /><span>{t.categories.addCategory}</span>
          </button>
        </Tooltip>
      </div>

      <div className={styles.grid}>
        {categories.map((cat) => {
          return (
            <div key={cat.id} className={`glass-card ${styles.categoryCard}`} onClick={() => handleEditClick(cat)} style={{ cursor: 'pointer' }}>
              <div className={styles.cardHeader}>
                <div className={styles.iconBox} style={{ backgroundColor: `${cat.color}20`, color: cat.color }}>
                  <Tags size={24} />
                </div>
              </div>
              <div className={styles.cardContent}>
                <h3>{cat.name}</h3>
              </div>
              <div className={styles.cardFooter}>
                <Tooltip text={t.categories.editCategory}>
                  <button className={styles.actionBtn} onClick={() => handleEditClick(cat)}>{t.categories.editCategory}</button>
                </Tooltip>
                <Tooltip text={t.categories.deleteCategory}>
                  <button className={styles.actionBtn} style={{ color: 'var(--error)' }} onClick={(e) => handleDelete(cat.id, e)}>
                    <Trash2 size={16} />
                  </button>
                </Tooltip>
              </div>
            </div>
          );
        })}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCategory ? t.categories.editCategory : t.categories.addCategory}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>{t.categories.categoryName}</label>
            <input type="text" className="glass-input" placeholder="e.g. Subscriptions"
              value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          </div>
          <div className={styles.formGroup}>
            <label>{t.categories.themeColor}</label>
            <input type="color" className={`glass-input ${styles.colorPicker}`}
              value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} />
          </div>
          <button type="submit" className={styles.submitBtn}>
            {t.categories.save}
          </button>
        </form>
      </Modal>
    </div>
  );
}
