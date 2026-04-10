"use client";

import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import styles from './Toast.module.css';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  const icons = {
    success: <CheckCircle className={styles.icon} size={20} />,
    error: <XCircle className={styles.icon} size={20} />,
    warning: <AlertTriangle className={styles.icon} size={20} />,
    info: <Info className={styles.icon} size={20} />,
  };

  return (
    <div className={`${styles.toast} ${styles[type]} glass-card`}>
      <div className={styles.content}>
        {icons[type]}
        <span className={styles.message}>{message}</span>
      </div>
      <button onClick={onClose} className={styles.closeBtn}>
        <X size={16} />
      </button>
      <div className={styles.progressBar}></div>
    </div>
  );
}
