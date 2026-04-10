import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TransactionProvider } from "@/context/TransactionContext";
import LayoutClient from "@/components/layout/LayoutClient";
import NextAuthProvider from "@/components/providers/NextAuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ExpensePro | Premium Financial Tracker",
  description: "Advanced personal expense tracking with real-time analytics and budgeting.",
};

import { ToastProvider } from "@/context/ToastContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          <ToastProvider>
            <TransactionProvider>
              <LayoutClient>
                {children}
              </LayoutClient>
            </TransactionProvider>
          </ToastProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
