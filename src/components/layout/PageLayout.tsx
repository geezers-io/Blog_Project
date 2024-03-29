import { FC, ReactNode } from 'react';
import * as S from '@/styles/layout/layout.style';
import PageHeader from './PageHeader';
import PageSidebar from './PageSidebar';

interface Props {
  children: ReactNode;
}

const PageLayout: FC<Props> = ({ children }) => {
  return (
    <>
      <PageHeader />
      <S.BGContainer>
        <PageSidebar />
        <S.BGContentsContainer>{children}</S.BGContentsContainer>
      </S.BGContainer>
    </>
  );
};

export default PageLayout;
