"use client";

import React from 'react';
import Skeleton from '@/components/ui/Skeleton';
import styles from '@/app/budgets/Budgets.module.css';

export default function BudgetsSkeleton() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <Skeleton width={180} height={32} variant="text" />
          <Skeleton width={220} height={20} variant="text" />
        </div>
        <Skeleton width={140} height={42} variant="rect" />
      </div>

      <div className={`glass-card ${styles.summaryCard}`}>
        <div className={styles.summaryInfo}>
          <div className={styles.summaryText}>
            <Skeleton width={180} height={24} variant="text" />
            <Skeleton width="100%" height={20} variant="text" />
          </div>
          <div className={styles.overallProgressRing}>
             <Skeleton width={80} height={80} variant="circle" />
          </div>
        </div>
        <div className={styles.summaryFooter}>
          <div className={styles.summaryStat}>
            <Skeleton width={16} height={16} variant="circle" />
            <Skeleton width={120} height={16} variant="text" />
          </div>
          <div className={styles.summaryStat}>
            <Skeleton width={16} height={16} variant="circle" />
            <Skeleton width={120} height={16} variant="text" />
          </div>
        </div>
      </div>

      <div className={styles.budgetsGrid}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className={`glass-card ${styles.budgetCard}`}>
            <div className={styles.cardHeader}>
              <Skeleton width={44} height={44} variant="rect" style={{ borderRadius: '10px' }} />
              <div className={styles.titleBox}>
                <Skeleton width={100} height={18} variant="text" />
                <Skeleton width={70} height={14} variant="text" />
              </div>
            </div>
            <div className={styles.progressSection}>
              <div className={styles.progressLabels}>
                <Skeleton width={80} height={14} variant="text" />
                <Skeleton width={80} height={14} variant="text" />
              </div>
              <Skeleton width="100%" height={10} variant="rect" style={{ borderRadius: '5px' }} />
            </div>
            <div className={styles.cardFooter}>
              <Skeleton width={120} height={14} variant="text" />
              <Skeleton width={60} height={32} variant="rect" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
