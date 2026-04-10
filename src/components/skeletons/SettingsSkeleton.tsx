"use client";

import React from 'react';
import Skeleton from '@/components/ui/Skeleton';
import styles from '@/app/settings/Settings.module.css';

export default function SettingsSkeleton() {
  return (
    <div className={styles.container}>
      <header>
        <Skeleton width={200} height={32} variant="text" />
        <Skeleton width={250} height={20} variant="text" />
      </header>

      <div className={styles.sections}>
        {[1, 2, 3, 4, 5].map((i) => (
          <section key={i} className={`glass-card ${styles.section}`}>
            <div className={styles.sectionHeader}>
              <Skeleton width={20} height={20} variant="circle" />
              <Skeleton width={150} height={24} variant="text" />
            </div>
            <div className={styles.sectionContent} style={{ marginTop: '16px' }}>
              <Skeleton width="100%" height={16} variant="text" />
              <Skeleton width="100%" height={42} variant="rect" style={{ margin: '12px 0' }} />
              {i === 1 && <Skeleton width="100%" height={42} variant="rect" style={{ margin: '12px 0' }} />}
              {i === 1 && <Skeleton width={120} height={40} variant="rect" style={{ marginTop: '10px' }} />}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
