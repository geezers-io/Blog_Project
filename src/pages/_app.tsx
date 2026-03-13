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
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const token = (session.user as any).backendToken;
      if (token) {
        setAuthToken(token);
      }
    }
    if (status === 'unauthenticated') {
      setAuthToken(null);
    }
  }, [session, status]);

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
