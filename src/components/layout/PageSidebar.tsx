import { FC, ReactNode } from 'react';
import * as S from '@/styles/layout/layout.style';

interface Props {
  children: ReactNode;
}

const PageSidebar: FC<Props> = ({ children }) => {
  return (
    <S.BGContainer>
      <S.BGSidebarContainer>ss</S.BGSidebarContainer>
      <S.BGContentsContainer>{children}</S.BGContentsContainer>
    </S.BGContainer>
  );
};

export default PageSidebar;
