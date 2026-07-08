"use client";

import { useTransactions } from '@/context/TransactionContext';
import { translations, type Language } from '@/locales/translations';

export function useTranslation() {
  const { userSettings } = useTransactions();
  const lang: Language = (userSettings.language as Language) || 'en';
  return translations[lang];
}
