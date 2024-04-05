import type { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import PageLayout from '@/components/layout/PageLayout';
import theme from '@/styles/theme';
import ErrorBoundary from 'components/ErrorBoundary';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <PageLayout>
          <Component {...pageProps} />
        </PageLayout>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default MyApp;
