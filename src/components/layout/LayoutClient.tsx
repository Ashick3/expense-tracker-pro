"use client";

import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { useTransactions } from "@/context/TransactionContext";
import GlobalTransactionModal from "@/components/modals/GlobalTransactionModal";
import MobileNav from "@/components/layout/MobileNav";
import styles from "./LayoutClient.module.css";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const { isSidebarCollapsed, userSettings } = useTransactions();

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
