"use client";

import React from 'react';
import Skeleton from '@/components/ui/Skeleton';
import styles from '@/app/Dashboard.module.css';

export default function DashboardSkeleton() {
  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div>
          <Skeleton width={300} height={32} variant="text" />
          <Skeleton width={200} height={20} variant="text" />
        </div>
        <Skeleton width={150} height={42} variant="rect" />
      </div>

      <div className={styles.statsGrid}>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} width="calc(33.333% - 16px)" height={160} variant="rect" style={{ flex: 1, minWidth: '280px' }} />
        ))}
      </div>

      <div className={styles.chartsGrid}>
        <div className={`glass-card ${styles.chartContainer}`}>
          <div className={styles.chartHeader}>
            <Skeleton width={200} height={24} variant="text" />
            <div className={styles.chartLegend}>
              <Skeleton width={60} height={16} variant="text" />
              <Skeleton width={60} height={16} variant="text" />
            </div>
          </div>
          <Skeleton width="100%" height={300} variant="rect" />
        </div>

        <div className={`glass-card ${styles.pieContainer}`}>
          <Skeleton width={200} height={24} variant="text" />
          <div className={styles.pieBody}>
            <Skeleton width={160} height={160} variant="circle" />
            <div className={styles.pieLegend}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <Skeleton width={10} height={10} variant="circle" />
                  <Skeleton width="60%" height={14} variant="text" />
                  <Skeleton width="20%" height={14} variant="text" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottomSection}>
        <div className={`glass-card ${styles.transactionsContainer}`}>
          <div className={styles.sectionHeader}>
            <Skeleton width={180} height={24} variant="text" />
            <Skeleton width={60} height={20} variant="text" />
          </div>
          <div className={styles.transactionsList}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '12px' }}>
                <Skeleton width={44} height={44} variant="rect" style={{ borderRadius: '10px' }} />
                <div style={{ flex: 1 }}>
                  <Skeleton width="40%" height={16} variant="text" />
                  <Skeleton width="25%" height={12} variant="text" />
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Skeleton width={60} height={16} variant="text" />
                  <Skeleton width={40} height={12} variant="text" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`glass-card ${styles.goalsContainer}`}>
          <Skeleton width={180} height={24} variant="text" />
          <Skeleton width="70%" height={16} variant="text" />
          <div style={{ marginTop: '10px' }}>
            <Skeleton width="100%" height={10} variant="rect" style={{ borderRadius: '5px', marginBottom: '12px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Skeleton width={80} height={14} variant="text" />
              <Skeleton width={100} height={14} variant="text" />
            </div>
          </div>
          <Skeleton width="100%" height={50} variant="rect" style={{ marginTop: 'auto', borderRadius: '12px' }} />
        </div>
      </div>
    </div>
  );
}
