import type { Metadata } from 'next';
import './globals.css';
import ClientProviders from '@/components/ClientProviders';

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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
