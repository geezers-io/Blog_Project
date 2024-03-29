import * as S from '@/styles/layout/layout.style';

const PageSidebar = () => {
  return (
    <S.BGSidebarContainer>
      <S.ProfileContainer>
        <div style={{ width: '150px', backgroundColor: 'yellow', margin: ' 20px auto', height: '200px' }}>picture</div>
        <S.ProfileDetailContainer>descriptions</S.ProfileDetailContainer>
      </S.ProfileContainer>
    </S.BGSidebarContainer>
  );
};

export default PageSidebar;
