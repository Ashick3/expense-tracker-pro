"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

import { 
  Search, 
  Bell, 
  User,
  Plus,
  Menu,
  TrendingUp,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  Info,
  X,
  LayoutDashboard,
  Receipt,
  Wallet,
  PieChart,
  CreditCard,
  Tags,
  Settings,
  LogOut,
} from 'lucide-react';
import styles from './Navbar.module.css';
import Tooltip from '@/components/ui/Tooltip';
import { useTransactions } from '@/context/TransactionContext';
import { useTranslation } from '@/hooks/useTranslation';

export default function Navbar() {
  const { openAddModal, userSettings, toggleSidebar, notifications, markAsRead, clearNotifications } = useTransactions();
  const t = useTranslation();
  const pathname = usePathname();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const mobileNavItems = [
    { icon: LayoutDashboard, label: t.nav.dashboard, href: '/' },
    { icon: Receipt, label: t.nav.transactions, href: '/transactions' },
    { icon: Wallet, label: t.nav.budgets, href: '/budgets' },
    { icon: PieChart, label: t.nav.analytics, href: '/analytics' },
    { icon: CreditCard, label: t.nav.accounts, href: '/accounts' },
    { icon: Tags, label: t.nav.categories, href: '/categories' },
    { icon: Settings, label: t.nav.settings, href: '/settings' },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
    <header className={styles.navbar}>
      <div className={styles.leftSection}>
        <button 
          className={styles.toggleBtn} 
          onClick={() => { 
            if (window.innerWidth <= 768) {
              setIsMobileDrawerOpen(o => !o);
            } else {
              toggleSidebar(); 
            }
          }} 
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
        
        <Tooltip text={t.nav.dashboard} position="bottom">
          <Link href="/" className={styles.brand} style={{ textDecoration: 'none' }}>
            <div className={styles.logoIcon}>
              <TrendingUp size={20} color="var(--primary)" />
            </div>
            <span className="text-gradient">ExpensePro</span>
          </Link>
        </Tooltip>

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
        
        <div className={styles.notificationContainer} ref={notifRef}>
          <Tooltip text={t.navbar.notifications} position="bottom">
            <div className={`${styles.iconBtn} ${isNotifOpen ? styles.active : ''}`} onClick={() => setIsNotifOpen(!isNotifOpen)}>
              <Bell size={20} />
              {unreadCount > 0 && <span className={styles.badge}>{unreadCount > 9 ? '9+' : unreadCount}</span>}
            </div>
          </Tooltip>
          
          {isNotifOpen && (
            <div className={`glass-card ${styles.notifDropdown}`}>
              <div className={styles.notifHeader}>
                <h3>{t.navbar.notifications}</h3>
                {notifications.length > 0 && (
                  <button className={styles.clearBtn} onClick={clearNotifications}>
                    <Trash2 size={14} /> Clear All
                  </button>
                )}
              </div>
              
              <div className={styles.notifBody}>
                {notifications.length === 0 ? (
                  <div className={styles.emptyNotifs}>
                    <Bell size={24} className={styles.emptyIcon} />
                    <p>No new notifications</p>
                  </div>
                ) : (
                  notifications.map(notif => (
                    <div key={notif.id} className={`${styles.notifItem} ${!notif.read ? styles.unread : ''}`} onClick={() => markAsRead(notif.id)}>
                      <div className={styles.notifIconWrapper} data-type={notif.type}>
                        {notif.type === 'alert' && <AlertTriangle size={16} />}
                        {notif.type === 'warning' && <AlertTriangle size={16} />}
                        {notif.type === 'info' && <Info size={16} />}
                      </div>
                      <div className={styles.notifContent}>
                        <h4>{notif.title}</h4>
                        <p>{notif.message}</p>
                        <span className={styles.notifTime}>
                          {new Date(notif.date).toLocaleDateString()} {new Date(notif.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                      {!notif.read && <div className={styles.unreadDot} />}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

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

    {/* Mobile Drawer */}
    {isMobileDrawerOpen && (
      <div className={styles.drawerOverlay} onClick={() => setIsMobileDrawerOpen(false)}>
        <div className={styles.drawer} onClick={e => e.stopPropagation()}>
          <div className={styles.drawerHeader}>
            <span className="text-gradient" style={{ fontWeight: 700, fontSize: '1.2rem' }}>ExpensePro</span>
            <button className={styles.drawerClose} onClick={() => setIsMobileDrawerOpen(false)}>
              <X size={20} />
            </button>
          </div>
          <nav className={styles.drawerNav}>
            {mobileNavItems.map(item => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.drawerItem} ${isActive ? styles.drawerActive : ''}`}
                  onClick={() => setIsMobileDrawerOpen(false)}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className={styles.drawerFooter}>
            <button className={styles.drawerLogout}>
              <LogOut size={18} />
              <span>{t.nav.logout}</span>
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
