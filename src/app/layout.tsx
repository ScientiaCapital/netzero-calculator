import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { TenantProvider } from '@/components/shared/TenantProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NetZero Calculator | Instant Solar Savings',
  description: 'Calculate your solar savings in seconds with SREC income projections. Get accurate estimates for system size, payback period, and 25-year savings.',
  keywords: ['solar calculator', 'solar savings', 'SREC', 'renewable energy', 'solar panels', 'energy savings'],
  openGraph: {
    title: 'NetZero Calculator | Instant Solar Savings',
    description: 'Calculate your solar savings in seconds with SREC income projections',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TenantProvider tenantId="calculator">
          <main className="min-h-screen">
            {children}
          </main>
        </TenantProvider>
      </body>
    </html>
  );
}
