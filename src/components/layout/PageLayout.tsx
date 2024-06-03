import { useSession } from 'next-auth/react';
import { FC, ReactNode } from 'react';
import AuthProvider from '@/pages/api/auth/provider';
import * as S from '@/styles/layout/layout.style';
import PageHeader from './PageHeader';
import PageSidebar from './PageSidebar';

interface Props {
  children: ReactNode;
}

const PageLayout: FC<Props> = ({ children }) => {
  const { data: session } = useSession();

  return (
    <>
      <AuthProvider>
        <PageHeader />
        <S.BGContainer>
          {session && <PageSidebar />}
          <S.BGContentsContainer>{children}</S.BGContentsContainer>
        </S.BGContainer>
      </AuthProvider>
    </>
  );
};

export default PageLayout;
