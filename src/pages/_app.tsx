import type { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import PageLayout from '@/components/layout/PageLayout';
import { theme } from '@/styles/theme/color';
import ErrorBoundary from 'components/ErrorBoundary';
export const metadata = {
  title: 'Blog-Project ',
};
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
