import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@mui/material';
import PageLayout from '@/components/layout/PageLayout';
import theme from '@/styles/theme';
import ErrorBoundary from 'components/ErrorBoundary';

export default function MyApp({ Component, pageProps: { session, ...pageProps } }) {
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
