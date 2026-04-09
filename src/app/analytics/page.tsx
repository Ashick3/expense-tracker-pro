"use client";

import { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, LineChart, Line, Cell
} from 'recharts';
import { TrendingUp, TrendingDown, Target, Zap } from 'lucide-react';
import { useTransactions } from '@/context/TransactionContext';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './Analytics.module.css';
import StatCard from '@/components/ui/StatCard';

export default function Analytics() {
  const { transactions, budgets, getTotals } = useTransactions();
  const t = useTranslation();
  const { income, expenses } = getTotals();

  const monthlyInsights = useMemo(() => {
    const now = new Date();
    const currentDay = now.getDate();
    const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;
    const avgDailySpend = expenses / currentDay;
    return {
      savingsRate: Math.max(0, savingsRate).toFixed(1),
      avgDailySpend: Math.round(avgDailySpend),
      isSavingsPositive: income > expenses
    };
  }, [income, expenses]);

  const categoryData = useMemo(() => {
    const totals: Record<string, number> = {};
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    transactions
      .filter(tx => {
        const d = new Date(tx.date);
        return tx.type === 'expense' && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .forEach(tx => { totals[tx.category] = (totals[tx.category] || 0) + tx.amount; });
    return Object.entries(totals).map(([name, value]) => ({
      name, value, color: budgets.find(b => b.category === name)?.color || 'var(--primary)'
    })).sort((a, b) => b.value - a.value);
  }, [transactions, budgets]);

  const trendData = useMemo(() => {
    const days = Array.from({ length: 30 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (29 - i));
      return d.toISOString().split('T')[0];
    });
    return days.map(date => {
      const dayTxs = transactions.filter(tx => tx.date === date && tx.type === 'expense');
      const total = dayTxs.reduce((sum, tx) => sum + tx.amount, 0);
      return { date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), amount: total };
    });
  }, [transactions]);

  const tooltipStyle = { backgroundColor: 'var(--secondary)', border: '1px solid var(--card-border)', borderRadius: '8px' };
  const itemStyle = { color: 'var(--foreground)' };

  return (
    <div className={styles.container}>
      <header>
        <h1 className="text-gradient">{t.analytics.title}</h1>
        <p className={styles.subtitle}>{t.analytics.subtitle}</p>
      </header>

      <div className={styles.statsGrid}>
        <StatCard title={t.analytics.income} value={`$${income.toLocaleString()}`} icon={TrendingUp} color="var(--success)" />
        <StatCard title={t.analytics.expenses} value={`$${expenses.toLocaleString()}`} icon={TrendingDown} color="var(--error)" />
        <StatCard
          title={t.analytics.savingsRate}
          value={`${monthlyInsights.savingsRate}%`}
          change={monthlyInsights.isSavingsPositive ? "Healthy" : "Low"}
          isPositive={monthlyInsights.isSavingsPositive}
          icon={Target} color="var(--primary)"
        />
        <StatCard
          title={t.analytics.dailyBurnRate}
          value={`$${monthlyInsights.avgDailySpend.toLocaleString()}`}
          change="avg/day" isPositive={false}
          icon={Zap} color="var(--warning)"
        />
      </div>

      <div className={styles.grid}>
        <div className={`glass-card ${styles.chartCard}`}>
          <h3>{t.analytics.monthlyTrends}</h3>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="date" stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                <RechartsTooltip contentStyle={tooltipStyle} itemStyle={itemStyle} labelStyle={{ color: 'var(--muted)', marginBottom: '4px' }} />
                <Line type="monotone" dataKey="amount" stroke="var(--primary)" strokeWidth={4} dot={false} animationDuration={1500} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`glass-card ${styles.chartCard}`}>
          <h3>{t.analytics.incomeVsExpenses}</h3>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={categoryData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} width={100} />
                <RechartsTooltip contentStyle={tooltipStyle} itemStyle={itemStyle} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
