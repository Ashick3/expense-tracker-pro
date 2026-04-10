"use client";

import React from 'react';
import Skeleton from '@/components/ui/Skeleton';
import styles from '@/app/categories/Categories.module.css';

export default function CategoriesSkeleton() {
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
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className={`glass-card ${styles.categoryCard}`}>
            <div className={styles.cardHeader}>
              <Skeleton width={44} height={44} variant="rect" style={{ borderRadius: '10px' }} />
            </div>
            <div className={styles.cardContent}>
              <Skeleton width="70%" height={24} variant="text" />
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
