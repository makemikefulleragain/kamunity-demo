import type { Metadata } from 'next';
import Header from '@/components/Header';
import { AuthProvider } from '@/lib/auth/auth-context';
import { DemoAuthProvider } from '@/contexts/DemoAuthContext';
import { DemoAuthWrapper } from '@/components/auth/DemoAuthWrapper';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kamunity',
  description: 'Community begins with one spark',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <DemoAuthProvider>
          <AuthProvider>
            <DemoAuthWrapper>
              <Header />
              <main className="container mx-auto px-4 py-8">
                {children}
              </main>
            </DemoAuthWrapper>
          </AuthProvider>
        </DemoAuthProvider>
      </body>
    </html>
  );
}
