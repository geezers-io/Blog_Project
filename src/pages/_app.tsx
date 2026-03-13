import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@mui/material';
import ErrorBoundary from '@/components/ErrorBoundary';
import PageLayout from '@/components/layout/PageLayout';
import theme from '@/styles/theme';

export default function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <SessionProvider session={session}>
          <PageLayout>
            <Component {...pageProps} />
          </PageLayout>
        </SessionProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
