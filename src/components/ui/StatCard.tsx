import { LucideIcon } from 'lucide-react';
import styles from './StatCard.module.css';

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  color?: string;
}

export default function StatCard({ 
  title, 
  value, 
  change, 
  isPositive, 
  icon: Icon,
  color = 'var(--primary)'
}: StatCardProps) {
  return (
    <div className={`glass-card ${styles.card}`}>
      <div className={styles.header}>
        <div className={styles.iconWrapper} style={{ backgroundColor: `${color}20`, color: color }}>
          <Icon size={24} />
        </div>
        {change && (
          <div className={`${styles.badge} ${isPositive ? styles.positive : styles.negative}`}>
            {isPositive ? '+' : ''}{change}%
          </div>
        )}
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.value}>{value}</p>
      </div>
    </div>
  );
}
