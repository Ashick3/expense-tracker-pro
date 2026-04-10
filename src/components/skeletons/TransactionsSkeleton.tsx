"use client";

import React from 'react';
import Skeleton from '@/components/ui/Skeleton';
import styles from '@/app/transactions/Transactions.module.css';

export default function TransactionsSkeleton() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <Skeleton width={200} height={32} variant="text" />
          <Skeleton width={250} height={20} variant="text" />
        </div>
        <div className={styles.headerActions}>
          <Skeleton width={130} height={42} variant="rect" />
          <Skeleton width={150} height={42} variant="rect" />
        </div>
      </div>

      <div className={`glass-card ${styles.filtersSection}`}>
        <div className={styles.searchWrapper}>
          <Skeleton width="100%" height={42} variant="rect" />
        </div>
        <div className={styles.filterBtns}>
          <Skeleton width={120} height={42} variant="rect" />
          <Skeleton width={120} height={42} variant="rect" />
          <Skeleton width={120} height={42} variant="rect" />
        </div>
      </div>

      <div className={`glass-card ${styles.tableContainer}`}>
        <table className={styles.table}>
          <thead>
            <tr>
              {[1, 2, 3, 4, 5, 6].map(i => (
                <th key={i}><Skeleton width={80} height={20} variant="text" /></th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <tr key={i} className={styles.row}>
                <td>
                  <div className={styles.txNameCell}>
                    <Skeleton width={32} height={32} variant="rect" style={{ borderRadius: '8px' }} />
                    <Skeleton width={120} height={16} variant="text" />
                  </div>
                </td>
                <td><Skeleton width={80} height={24} variant="rect" style={{ borderRadius: '12px' }} /></td>
                <td><Skeleton width={100} height={16} variant="text" /></td>
                <td><Skeleton width={80} height={24} variant="rect" style={{ borderRadius: '12px' }} /></td>
                <td><Skeleton width={70} height={16} variant="text" /></td>
                <td>
                  <div className={styles.rowActions}>
                    <Skeleton width={28} height={28} variant="rect" />
                    <Skeleton width={28} height={28} variant="rect" />
                    <Skeleton width={28} height={28} variant="rect" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
