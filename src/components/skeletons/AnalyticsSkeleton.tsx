"use client";

import React from 'react';
import Skeleton from '@/components/ui/Skeleton';
import styles from '@/app/analytics/Analytics.module.css';

export default function AnalyticsSkeleton() {
  return (
    <div className={styles.container}>
      <header>
        <Skeleton width={200} height={32} variant="text" />
        <Skeleton width={250} height={20} variant="text" />
      </header>

      <div className={styles.statsGrid}>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} width="100%" height={140} variant="rect" />
        ))}
      </div>

      <div className={styles.grid}>
        <div className={`glass-card ${styles.chartCard}`}>
          <Skeleton width={180} height={24} variant="text" />
          <div className={styles.chartWrapper}>
            <Skeleton width="100%" height={350} variant="rect" />
          </div>
        </div>

        <div className={`glass-card ${styles.chartCard}`}>
          <Skeleton width={180} height={24} variant="text" />
          <div className={styles.chartWrapper}>
            <Skeleton width="100%" height={350} variant="rect" />
          </div>
        </div>
      </div>
    </div>
  );
}
