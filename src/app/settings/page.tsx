"use client";

import { useState, useEffect } from 'react';
import { 
  Bell, 
  Shield, 
  User, 
  Laptop, 
  Database, 
  CheckCircle2,
  AlertCircle,
  Globe
} from 'lucide-react';
import styles from './Settings.module.css';
import { useTransactions } from '@/context/TransactionContext';
import { useTranslation } from '@/hooks/useTranslation';
import Modal from '@/components/ui/Modal';

export default function Settings() {
  const { 
    exportData, 
    resetDatabase, 
    userSettings, 
    updateUserSettings 
  } = useTransactions();
  const t = useTranslation();

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Form State
  const [name, setName] = useState(userSettings.name);
  const [email, setEmail] = useState(userSettings.email);
  const [notifyBudget, setNotifyBudget] = useState(userSettings.notifyBudget);
  const [notifySummary, setNotifySummary] = useState(userSettings.notifySummary);

  useEffect(() => {
    setName(userSettings.name);
    setEmail(userSettings.email);
    setNotifyBudget(userSettings.notifyBudget);
    setNotifySummary(userSettings.notifySummary);
  }, [userSettings]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('saving');
    setTimeout(() => {
      updateUserSettings({ name, email });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }, 600);
  };

  const handleToggleNotifyBudget = () => {
    const newVal = !notifyBudget;
    setNotifyBudget(newVal);
    updateUserSettings({ notifyBudget: newVal });
  };

  const handleToggleNotifySummary = () => {
    const newVal = !notifySummary;
    setNotifySummary(newVal);
    updateUserSettings({ notifySummary: newVal });
  };

  const handleResetData = () => {
    setIsConfirmModalOpen(false);
    resetDatabase();
    setIsSuccessModalOpen(true);
  };

  const saveLabel = 
    saveStatus === 'saving' ? t.settings.saving :
    saveStatus === 'saved'  ? t.settings.saved  :
    t.settings.saveChanges;

  return (
    <div className={styles.container}>
      <header>
        <h1 className="text-gradient">{t.settings.title}</h1>
        <p className={styles.subtitle}>{t.settings.subtitle}</p>
      </header>

      <div className={styles.sections}>
        {/* Profile Section */}
        <section className={`glass-card ${styles.section}`}>
          <div className={styles.sectionHeader}>
            <User className={styles.icon} size={20} />
            <h3>{t.settings.userProfile}</h3>
          </div>
          <form className={styles.sectionContent} onSubmit={handleSaveProfile}>
            <div className={styles.field}>
              <label>{t.settings.fullName}</label>
              <input 
                type="text" 
                className="glass-input" 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label>{t.settings.emailAddress}</label>
              <input 
                type="email" 
                className="glass-input" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              className={styles.saveBtn} 
              disabled={saveStatus === 'saving'} 
              style={{
                background: saveStatus === 'saved' ? 'var(--success)' : 'var(--primary)',
                color: 'white', border: 'none', padding: '10px 20px',
                borderRadius: '8px', fontWeight: '600', cursor: 'pointer',
                marginTop: '10px', transition: 'all 0.3s ease'
              }}>
              {saveLabel}
            </button>
          </form>
        </section>

        {/* Notifications Section */}
        <section className={`glass-card ${styles.section}`}>
          <div className={styles.sectionHeader}>
            <Bell className={styles.icon} size={20} />
            <h3>{t.settings.notifications}</h3>
          </div>
          <div className={styles.sectionContent}>
            <div className={styles.toggleRow} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <span style={{ fontWeight: '600', display: 'block' }}>{t.settings.budgetAlerts}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{t.settings.budgetAlertsDesc}</span>
              </div>
              <input type="checkbox" checked={notifyBudget} onChange={handleToggleNotifyBudget} />
            </div>
            <div className={styles.toggleRow} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontWeight: '600', display: 'block' }}>{t.settings.dailySummary}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{t.settings.dailySummaryDesc}</span>
              </div>
              <input type="checkbox" checked={notifySummary} onChange={handleToggleNotifySummary} />
            </div>
          </div>
        </section>

        {/* Appearance Section */}
        <section className={`glass-card ${styles.section}`}>
          <div className={styles.sectionHeader}>
            <Laptop className={styles.icon} size={20} />
            <h3>{t.settings.appearance}</h3>
          </div>
          <div className={styles.sectionContent}>
            <div className={styles.toggleRow} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontWeight: '600', display: 'block' }}>{t.settings.lightMode}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{t.settings.lightModeDesc}</span>
              </div>
              <input 
                type="checkbox" 
                checked={userSettings.theme === 'light'} 
                onChange={() => updateUserSettings({ theme: userSettings.theme === 'light' ? 'dark' : 'light' })}
              />
            </div>
          </div>
        </section>

        {/* Language Section */}
        <section className={`glass-card ${styles.section}`}>
          <div className={styles.sectionHeader}>
            <Globe className={styles.icon} size={20} />
            <h3>{t.settings.language}</h3>
          </div>
          <div className={styles.sectionContent}>
            <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '16px' }}>
              {t.settings.languageDesc}
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => updateUserSettings({ language: 'en' })}
                style={{
                  padding: '10px 24px',
                  borderRadius: '10px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  border: '2px solid',
                  transition: 'all 0.2s ease',
                  background: userSettings.language === 'en' ? 'var(--primary)' : 'var(--bg-surface)',
                  color: userSettings.language === 'en' ? 'white' : 'var(--text-main)',
                  borderColor: userSettings.language === 'en' ? 'var(--primary)' : 'var(--card-border)',
                }}>
                🇬🇧 English
              </button>
              <button
                onClick={() => updateUserSettings({ language: 'ta' })}
                style={{
                  padding: '10px 24px',
                  borderRadius: '10px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  border: '2px solid',
                  transition: 'all 0.2s ease',
                  background: userSettings.language === 'ta' ? 'var(--primary)' : 'var(--bg-surface)',
                  color: userSettings.language === 'ta' ? 'white' : 'var(--text-main)',
                  borderColor: userSettings.language === 'ta' ? 'var(--primary)' : 'var(--card-border)',
                }}>
                🇮🇳 தமிழ்
              </button>
            </div>
          </div>

          <div className={styles.sectionHeader} style={{ marginTop: '32px' }}>
            <Globe className={styles.icon} size={20} />
            <h3>{t.settings.currency}</h3>
          </div>
          <div className={styles.sectionContent}>
            <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '16px' }}>
              {t.settings.currencyDesc}
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => updateUserSettings({ currency: 'USD' })}
                style={{
                  padding: '10px 24px',
                  borderRadius: '10px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  border: '2px solid',
                  transition: 'all 0.2s ease',
                  background: userSettings.currency === 'USD' ? 'var(--primary)' : 'var(--bg-surface)',
                  color: userSettings.currency === 'USD' ? 'white' : 'var(--text-main)',
                  borderColor: userSettings.currency === 'USD' ? 'var(--primary)' : 'var(--card-border)',
                }}>
                $ Dollar
              </button>
              <button
                onClick={() => updateUserSettings({ currency: 'INR' })}
                style={{
                  padding: '10px 24px',
                  borderRadius: '10px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  border: '2px solid',
                  transition: 'all 0.2s ease',
                  background: userSettings.currency === 'INR' ? 'var(--primary)' : 'var(--bg-surface)',
                  color: userSettings.currency === 'INR' ? 'white' : 'var(--text-main)',
                  borderColor: userSettings.currency === 'INR' ? 'var(--primary)' : 'var(--card-border)',
                }}>
                ₹ Rupee
              </button>
            </div>
          </div>
        </section>

        {/* Data Management Section */}
        <section className={`glass-card ${styles.section}`}>
          <div className={styles.sectionHeader}>
            <Database className={styles.icon} size={20} />
            <h3>{t.settings.dataManagement}</h3>
          </div>
          <div className={styles.sectionContent}>
            <div className={styles.dataAction} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <p className={styles.actionTitle} style={{ fontWeight: '600', marginBottom: '4px' }}>{t.settings.clearData}</p>
                <p className={styles.actionDesc} style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{t.settings.clearDataDesc}</p>
              </div>
              <button className={styles.dangerBtn} onClick={() => setIsConfirmModalOpen(true)}>{t.settings.resetData}</button>
            </div>
            <div className={styles.dataAction} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p className={styles.actionTitle} style={{ fontWeight: '600', marginBottom: '4px' }}>{t.settings.exportBackup}</p>
                <p className={styles.actionDesc} style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{t.settings.exportBackupDesc}</p>
              </div>
              <button className={styles.secondaryBtn} onClick={exportData}>{t.settings.downloadJson}</button>
            </div>
          </div>
        </section>
      </div>

      {/* Confirmation Modal */}
      <Modal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} title={t.settings.resetConfirmTitle}>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <AlertCircle size={48} color="var(--error)" />
          </div>
          <h3 style={{ marginBottom: '12px' }}>{t.settings.resetConfirmTitle}</h3>
          <p style={{ color: 'var(--muted)', marginBottom: '24px' }}>
            {t.settings.resetConfirmBody} <strong>This action cannot be undone.</strong>
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button className={styles.secondaryBtn} onClick={() => setIsConfirmModalOpen(false)}>{t.settings.cancel}</button>
            <button className={styles.dangerBtn} onClick={handleResetData}>{t.settings.resetConfirmCta}</button>
          </div>
        </div>
      </Modal>

      {/* Success Modal */}
      <Modal isOpen={isSuccessModalOpen} onClose={() => { setIsSuccessModalOpen(false); window.location.reload(); }} title={t.settings.successTitle}>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ marginBottom: '16px', background: 'rgba(16, 185, 129, 0.1)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <CheckCircle2 size={48} color="var(--success)" />
          </div>
          <h3 style={{ marginBottom: '12px' }}>{t.settings.successTitle}</h3>
          <p style={{ color: 'var(--muted)', marginBottom: '24px' }}>{t.settings.successBody}</p>
          <button 
            className={styles.saveBtn} 
            style={{ width: '100%', background: 'var(--success)', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
            onClick={() => { setIsSuccessModalOpen(false); window.location.reload(); }}>
            {t.settings.finish}
          </button>
        </div>
      </Modal>
    </div>
  );
}
