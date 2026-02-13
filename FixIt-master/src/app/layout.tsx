// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

import { AuthProvider } from '@/context/AuthContext';
import Loading from '@/components/Loading';

import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'FixIt',
  description: 'Report and track local issues in your community.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
