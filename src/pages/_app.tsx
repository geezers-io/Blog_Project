import type { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import PageHeader from '@/components/layout/PageHeader';
import PageSidebar from '@/components/layout/PageSidebar';
import { theme } from '@/styles/theme/color';
import ErrorBoundary from 'components/ErrorBoundary';
export const metadata = {
  title: 'Blog-Project ',
};
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <PageHeader />
        <PageSidebar>
          <Component {...pageProps} />
        </PageSidebar>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default MyApp;
