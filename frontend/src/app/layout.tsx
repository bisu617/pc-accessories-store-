import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientProviders from '@/components/ClientProviders';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Byte Bazar Tech - Premium Gaming Peripherals',
  description: 'Discover premium gaming peripherals designed for champions. Mechanical keyboards, gaming mice, headsets, monitors and more at Byte Bazar Tech.',
  keywords: 'gaming, keyboards, mice, headsets, monitors, peripherals, mechanical keyboard, gaming mouse',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
