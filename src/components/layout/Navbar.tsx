"use client";

import { 
  Search, 
  Bell, 
  User,
  Plus,
  Menu,
  TrendingUp,
} from 'lucide-react';
import styles from './Navbar.module.css';
import Tooltip from '@/components/ui/Tooltip';
import { useTransactions } from '@/context/TransactionContext';
import { useTranslation } from '@/hooks/useTranslation';

export default function Navbar() {
  const { openAddModal, userSettings, toggleSidebar } = useTransactions();
  const t = useTranslation();

  return (
    <header className={styles.navbar}>
      <div className={styles.leftSection}>
        <button className={styles.toggleBtn} onClick={toggleSidebar} aria-label="Toggle sidebar">
          <Menu size={20} />
        </button>
        
        <div className={styles.brand}>
          <div className={styles.logoIcon}>
            <TrendingUp size={20} color="var(--primary)" />
          </div>
          <span className="text-gradient">ExpensePro</span>
        </div>

        <div className={styles.searchBar}>
          <Search size={18} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder={t.navbar.searchPlaceholder}
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.actions}>
        <Tooltip text={t.navbar.addNew} position="bottom">
          <button className={styles.addBtn} onClick={() => openAddModal()}>
            <Plus size={18} />
            <span>{t.navbar.addNew}</span>
          </button>
        </Tooltip>
        
        <Tooltip text={t.navbar.notifications} position="bottom">
          <div className={styles.iconBtn}>
            <Bell size={20} />
            <span className={styles.badge} />
          </div>
        </Tooltip>

        <Tooltip text={t.navbar.userProfile} position="bottom">
          <div className={styles.profile}>
            <div className={styles.avatar}>
              <User size={20} />
            </div>
            <div className={styles.profileInfo}>
              <p className={styles.userName}>{userSettings.name}</p>
              <p className={styles.userRole}>{t.navbar.premiumMember}</p>
            </div>
          </div>
        </Tooltip>
      </div>
    </header>
  );
}
