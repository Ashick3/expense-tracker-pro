"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Receipt, 
  Wallet, 
  PieChart, 
  Settings, 
  LogOut,
  TrendingUp,
  CreditCard,
  Tags,
} from 'lucide-react';
import styles from './Sidebar.module.css';
import Tooltip from '@/components/ui/Tooltip';
import { useTransactions } from '@/context/TransactionContext';
import { useTranslation } from '@/hooks/useTranslation';
import { useEffect, useState } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const { isSidebarCollapsed } = useTransactions();
  const t = useTranslation();
  const [user, setUser] = useState<{name?: string; email?: string} | null>(null);

  const menuItems = [
    { icon: LayoutDashboard, label: t.nav.dashboard, href: '/' },
    { icon: Receipt, label: t.nav.transactions, href: '/transactions' },
    { icon: Wallet, label: t.nav.budgets, href: '/budgets' },
    { icon: PieChart, label: t.nav.analytics, href: '/analytics' },
    { icon: CreditCard, label: t.nav.accounts, href: '/accounts' },
    { icon: Tags, label: t.nav.categories, href: '/categories' },
    { icon: Settings, label: t.nav.settings, href: '/settings' },
  ];

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('expense_pro_auth_user');
      if (savedUser) setUser(JSON.parse(savedUser));
    } catch {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('expense_pro_auth_user');
    window.location.href = '/login';
  };

  return (
    <aside className={`${styles.sidebar} ${isSidebarCollapsed ? styles.collapsed : ''}`}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <TrendingUp size={24} color="var(--primary)" />
          </div>
        </div>
      </div>

      <nav className={styles.nav}>
        <ul className={styles.menu}>
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Tooltip text={isSidebarCollapsed ? item.label : ''} position="right">
                  <Link 
                    href={item.href} 
                    className={`${styles.menuItem} ${isActive ? styles.active : ''}`}
                  >
                    <item.icon size={20} />
                    {!isSidebarCollapsed && <span>{item.label}</span>}
                  </Link>
                </Tooltip>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className={styles.footer}>
        <div className={styles.userProfile}>
          <div className={styles.avatar}>
            {(user?.name || 'U').charAt(0)}
          </div>
          {!isSidebarCollapsed && (
            <div className={styles.userInfo}>
              <p className={styles.userName}>{user?.name || 'User'}</p>
              <p className={styles.userEmail}>{user?.email || ''}</p>
            </div>
          )}
        </div>
        
        <Tooltip text={isSidebarCollapsed ? t.nav.logout : ''} position="right">
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={20} />
            {!isSidebarCollapsed && <span>{t.nav.logout}</span>}
          </button>
        </Tooltip>
      </div>
    </aside>
  );
}
