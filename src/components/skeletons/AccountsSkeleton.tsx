"use client";

import React from 'react';
import Skeleton from '@/components/ui/Skeleton';
import styles from '@/app/accounts/Accounts.module.css';

export default function AccountsSkeleton() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <Skeleton width={180} height={32} variant="text" />
          <Skeleton width={220} height={20} variant="text" />
        </div>
        <Skeleton width={140} height={42} variant="rect" />
      </div>

      <div className={styles.grid}>
        {[1, 2, 3].map((i) => (
          <div key={i} className={`glass-card ${styles.accountCard}`}>
            <div className={styles.cardHeader}>
              <Skeleton width={44} height={44} variant="rect" style={{ borderRadius: '10px' }} />
              <div className={styles.status}>
                <Skeleton width={60} height={14} variant="text" />
              </div>
            </div>
            <div className={styles.cardContent}>
              <Skeleton width="60%" height={24} variant="text" />
              <Skeleton width="40%" height={16} variant="text" />
              <Skeleton width="50%" height={32} variant="text" style={{ marginTop: '12px' }} />
            </div>
            <div className={styles.cardFooter}>
              <Skeleton width={80} height={32} variant="rect" />
              <Skeleton width={32} height={32} variant="rect" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
