import type { AppProps } from 'next/app';
import PageLayout from '@/components/layout/PageLayout';
import ErrorBoundary from 'components/ErrorBoundary';
import Provider from './_index';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <Provider>
        <PageLayout>
          <Component {...pageProps} />
        </PageLayout>
      </Provider>
    </ErrorBoundary>
  );
}

export default MyApp;
