"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { useTransactions } from "@/context/TransactionContext";
import GlobalTransactionModal from "@/components/modals/GlobalTransactionModal";
import MobileNav from "@/components/layout/MobileNav";
import styles from "./LayoutClient.module.css";

import { usePathname, useRouter } from 'next/navigation';

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const { isSidebarCollapsed, userSettings } = useTransactions();
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const authRoutes = ['/login', '/register', '/forgot-password'];
  const isAuthRoute = authRoutes.includes(pathname);

  useEffect(() => {
    setIsHydrated(true);

    try {
      const savedUser = localStorage.getItem('expense_pro_auth_user');
      const isLoggedIn = Boolean(savedUser);
      setIsAuthenticated(isLoggedIn);

      if (isLoggedIn && isAuthRoute) {
        router.replace('/');
      }

      if (!isLoggedIn && !isAuthRoute) {
        router.replace('/login');
      }
    } catch {
      setIsAuthenticated(false);
      if (!isAuthRoute) router.replace('/login');
    }
  }, [pathname, isAuthRoute, router]);

  if (!isHydrated || isAuthenticated === null) {
    return null;
  }

  if (isAuthRoute) {
    return (
      <div className={`auth-layout ${userSettings.theme === 'light' ? 'light-mode' : 'dark-mode'}`}>
        {children}
      </div>
    );
  }

  return (
    <div
      className={`main-container ${userSettings.theme === 'light' ? 'light-mode' : 'dark-mode'}`}
      style={{ '--sidebar-width': isSidebarCollapsed ? '80px' : '260px' } as React.CSSProperties}
    >
      <Sidebar />
      <div className={styles.innerWrapper}>
        <Navbar />
        <main className="content-wrapper">
          {children}
        </main>
      </div>
      {/* <MobileNav /> */}
      <GlobalTransactionModal />
    </div>
  );
}
