"use client";

import { useTransactions } from '@/context/TransactionContext';
import { translations } from '@/locales/translations';

export function useTranslation() {
  const { userSettings } = useTransactions();
  const lang = userSettings.language || 'en';
  return translations[lang];
}
