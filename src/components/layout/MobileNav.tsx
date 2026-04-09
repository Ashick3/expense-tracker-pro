"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Receipt, Wallet, PieChart, CreditCard, Plus, Settings } from 'lucide-react';
import styles from './MobileNav.module.css';
import { useTransactions } from '@/context/TransactionContext';
import { useTranslation } from '@/hooks/useTranslation';

export default function MobileNav() {
  const pathname = usePathname();
  const { openAddModal } = useTransactions();
  const t = useTranslation();

  const navItems = [
    { icon: LayoutDashboard, label: t.nav.dashboard, href: '/' },
    { icon: Receipt, label: t.nav.transactions, href: '/transactions' },
    { icon: Wallet, label: t.nav.budgets, href: '/budgets' },
    { icon: PieChart, label: t.nav.analytics, href: '/analytics' },
    { icon: CreditCard, label: t.nav.accounts, href: '/accounts' },
    { icon: Settings, label: t.nav.settings, href: '/settings' },
  ];

  return (
    <nav className={styles.mobileNav}>
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link key={item.href} href={item.href} className={`${styles.navItem} ${isActive ? styles.active : ''}`}>
            <item.icon size={22} />
            <span>{item.label}</span>
          </Link>
        );
      })}
      <button className={styles.addItem} onClick={() => openAddModal()}>
        <Plus size={22} />
        <span>{t.navbar.addNew}</span>
      </button>
    </nav>
  );
}
