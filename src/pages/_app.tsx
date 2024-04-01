import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import PageLayout from '@/components/layout/PageLayout';
import ErrorBoundary from 'components/ErrorBoundary';
export const metadata = {
  title: 'Blog-Project ',
};
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <ThemeProvider themes={['light', 'dark']}>
        <PageLayout>
          <Component {...pageProps} />
        </PageLayout>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default MyApp;
