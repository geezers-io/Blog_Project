import type { AppProps } from 'next/app';
import { SessionProvider, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import ErrorBoundary from '@/components/ErrorBoundary';
import Layout from '@/components/layout/Layout';
import { setAuthToken } from '@/lib/api';
import theme from '@/styles/theme';
import '@/styles/globals.css';

function AuthSync() {
  const { data: session } = useSession();

  useEffect(() => {
    const syncAuth = async () => {
      if (session?.user?.email) {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
          const res = await fetch(`${apiUrl}/auth/sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: session.user.email,
              name: session.user.name || '',
              image: session.user.image || '',
            }),
          });
          if (res.ok) {
            const data = await res.json();
            setAuthToken(data.token);
          }
        } catch (e) {
          console.error('Auth sync failed:', e);
        }
      }
    };
    syncAuth();
  }, [session]);

  return null;
}

export default function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SessionProvider session={session}>
          <AuthSync />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </SessionProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
