import type { Metadata } from 'next';
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import FloatingSurvey from '@/components/demo/FloatingSurvey'
import ErrorBoundary from '@/components/ErrorBoundary'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Kamunity',
  description: 'Building community, one conversation at a time',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`} suppressHydrationWarning={true}>
        <Providers>
          <ErrorBoundary componentName="Header">
            <Header />
          </ErrorBoundary>
          <main className="min-h-screen">
            <ErrorBoundary componentName="Main Content">
              {children}
            </ErrorBoundary>
          </main>
          <ErrorBoundary componentName="FloatingSurvey">
            <FloatingSurvey />
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}
