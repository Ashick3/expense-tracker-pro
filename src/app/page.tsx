"use client";

import { useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ArrowUpRight,
  MoreVertical,
  Briefcase,
  Utensils,
  Car,
  Home,
  Laptop,
  Heart,
  PieChart as LucidePieChart
} from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import styles from './Dashboard.module.css';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useTransactions } from '@/context/TransactionContext';
import { useTranslation } from '@/hooks/useTranslation';
import { exportToCsv } from '@/utils/exportCsv';
import UITooltip from '@/components/ui/Tooltip';

const ICON_MAP: Record<string, any> = {
  'Housing': Home,
  'Food & Drink': Utensils,
  'Transport': Car,
  'Shopping': Laptop,
  'Healthcare': Heart,
  'Entertainment': ({ size }: { size: number }) => <Briefcase size={size} />,
  'Income': DollarSign,
  'Other': LucidePieChart
};

import DashboardSkeleton from '@/components/skeletons/DashboardSkeleton';

export default function Dashboard() {
  const { transactions, getTotals, budgets, userSettings, currencySymbol, isLoaded } = useTransactions();
  const t = useTranslation();

  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      const dayTransactions = transactions.filter(tx => tx.date === date);
      const dayIncome = dayTransactions
        .filter(tx => tx.type === 'income')
        .reduce((sum, tx) => sum + tx.amount, 0);
      const dayExpense = dayTransactions
        .filter(tx => tx.type === 'expense')
        .reduce((sum, tx) => sum + tx.amount, 0);
      
      const label = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
      return { name: label, income: dayIncome, expense: dayExpense };
    });
  }, [transactions]);

  const pieData = useMemo(() => {
    const categoryTotals: Record<string, number> = {};
    transactions
      .filter(tx => tx.type === 'expense')
      .forEach(tx => {
        categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
      });

    return budgets.map(b => ({
      name: b.category,
      value: categoryTotals[b.category] || 0,
      color: b.color
    })).filter(d => d.value > 0);
  }, [transactions, budgets]);

  if (!isLoaded) {
    return <DashboardSkeleton />;
  }

  const { balance, income, expenses } = getTotals();
  const isLight = userSettings.theme === 'light';
  const gridStroke = isLight ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.05)';
  const tooltipStyle = { backgroundColor: isLight ? '#ffffff' : 'var(--secondary)', border: `1px solid ${isLight ? 'rgba(0,0,0,0.1)' : 'var(--card-border)'}`, borderRadius: '8px', color: isLight ? '#0f172a' : 'var(--foreground)' };
  const itemStyle = { color: isLight ? '#0f172a' : 'var(--foreground)' };

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4);

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div>
          <h1 className="text-gradient">{t.dashboard.welcomeBack}, {userSettings.name}!</h1>
          <p className={styles.subtitle}>{t.dashboard.subtitle}</p>
        </div>
        <UITooltip text={t.dashboard.downloadReport}>
          <button className={styles.exportBtn} onClick={() => exportToCsv('report.csv', transactions)}>
            {t.dashboard.downloadReport}
          </button>
        </UITooltip>
      </div>

      <div className={styles.statsGrid}>
        <StatCard 
          title={t.dashboard.totalBalance}
          value={`${currencySymbol}${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} 
          change="0" 
          isPositive 
          icon={DollarSign} 
        />
        <StatCard 
          title={t.dashboard.monthlyIncome}
          value={`${currencySymbol}${income.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} 
          change="0" 
          isPositive 
          icon={TrendingUp} 
          color="var(--success)" 
        />
        <StatCard 
          title={t.dashboard.monthlyExpenses}
          value={`${currencySymbol}${expenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} 
          change="0" 
          isPositive={false} 
          icon={TrendingDown} 
          color="var(--error)" 
        />
      </div>

      <div className={styles.chartsGrid}>
        <div className={`glass-card ${styles.chartContainer}`}>
          <div className={styles.chartHeader}>
            <h3>{t.dashboard.cashFlowAnalysis}</h3>
            <div className={styles.chartLegend}>
              <span className={styles.incomeDot}>{t.dashboard.income}</span>
              <span className={styles.expenseDot}>{t.dashboard.expense}</span>
            </div>
          </div>
          <div className={styles.chartBody}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis dataKey="name" stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${currencySymbol}${v}`} />
                <Tooltip contentStyle={tooltipStyle} itemStyle={itemStyle} />
                <Area type="monotone" dataKey="income" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`glass-card ${styles.pieContainer}`}>
          <h3>{t.dashboard.expensesByCategory}</h3>
          <div className={styles.pieBody}>
            {pieData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className={styles.pieLegend}>
                  {pieData.map((item) => (
                    <div key={item.name} className={styles.legendItem}>
                      <span className={styles.dot} style={{ backgroundColor: item.color }} />
                      <span className={styles.name}>{item.name}</span>
                      <span className={styles.percent}>{currencySymbol}{item.value.toFixed(0)}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ height: '220px', display: 'flex', alignItems: 'center', color: 'var(--muted)' }}>
                {t.dashboard.noExpenseData}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.bottomSection}>
        <div className={`glass-card ${styles.transactionsContainer}`}>
          <div className={styles.sectionHeader}>
            <h3>{t.dashboard.recentTransactions}</h3>
            <UITooltip text="See history" position="left">
              <button className={styles.viewAll}>{t.dashboard.viewAll}</button>
            </UITooltip>
          </div>
          <div className={styles.transactionsList}>
            {recentTransactions.length > 0 ? (
              recentTransactions.map((tx) => {
                const Icon = ICON_MAP[tx.category] || LucidePieChart;
                return (
                  <div key={tx.id} className={styles.transactionItem}>
                    <div className={styles.txIcon}><Icon size={20} /></div>
                    <div className={styles.txInfo}>
                      <p className={styles.txName}>{tx.name}</p>
                      <p className={styles.txCategory}>{tx.category}</p>
                    </div>
                    <div className={styles.txDetails}>
                      <p className={tx.type === 'income' ? styles.income : styles.expense}>
                        {tx.type === 'income' ? '+' : '-'}{currencySymbol}{Math.abs(tx.amount).toLocaleString()}
                      </p>
                      <p className={styles.txDate}>{tx.date}</p>
                    </div>
                    <UITooltip text="Actions" position="left">
                      <button className={styles.moreBtn}><MoreVertical size={16} /></button>
                    </UITooltip>
                  </div>
                );
              })
            ) : (
              <p style={{ textAlign: 'center', padding: '20px', color: 'var(--muted)' }}>
                {t.dashboard.noTransactions}
              </p>
            )}
          </div>
        </div>

        <div className={`glass-card ${styles.goalsContainer}`}>
          <h3>{t.dashboard.monthlyBudget}</h3>
          <p className={styles.goalSubtitle}>
            {t.dashboard.spentMostOn} {pieData.length > 0 ? pieData[0].name : '...'} {t.dashboard.thisMonth}
          </p>
          <div className={styles.progressWrapper}>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${Math.min((expenses / (income || 1)) * 100, 100)}%` }} 
              />
            </div>
            <div className={styles.progressLabels}>
              <span>{currencySymbol}{expenses.toLocaleString()} {t.dashboard.spent}</span>
              <span>{t.dashboard.overallVsIncome}</span>
            </div>
          </div>
          <div className={styles.goalAlert}>
            <ArrowUpRight size={18} />
            <span>{t.dashboard.keepTracking}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
