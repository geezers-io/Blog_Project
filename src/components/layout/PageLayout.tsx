import { FC, ReactNode } from 'react';
import AuthProvider from '@/pages/api/auth/provider';
import * as S from '@/styles/layout/layout.style';
import PageHeader from './PageHeader';
import PageSidebar from './PageSidebar';

interface Props {
  children: ReactNode;
}

const PageLayout: FC<Props> = ({ children }) => (
  <>
    <AuthProvider>
      <PageHeader />
      <S.BGContainer>
        <PageSidebar />
        <S.BGContentsContainer>{children}</S.BGContentsContainer>
      </S.BGContainer>
    </AuthProvider>
  </>
);

export default PageLayout;
