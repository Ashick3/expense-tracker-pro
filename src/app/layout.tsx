import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { TransactionProvider } from "@/context/TransactionContext";
import GlobalTransactionModal from "@/components/modals/GlobalTransactionModal";

import LayoutClient from "@/components/layout/LayoutClient";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ExpensePro | Premium Financial Tracker",
  description: "Advanced personal expense tracking with real-time analytics and budgeting.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TransactionProvider>
          <LayoutClient>
            {children}
          </LayoutClient>
        </TransactionProvider>
      </body>
    </html>
  );
}
