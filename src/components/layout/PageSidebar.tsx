import Image from 'next/image';
import { CiMail } from 'react-icons/ci';
import { IoIosCall } from 'react-icons/io';
import { TiWorld } from 'react-icons/ti';
import * as C from '@/styles/common/common.style';
import * as S from '@/styles/layout/layout.style';

const PageSidebar = () => {
  return (
    <S.BGSidebarContainer>
      <S.ProfileContainer>
        <S.ImageContainer>
          <Image src="/Profile.jpg" alt="프로필 사진" width="500px" height="500px" objectFit="contain" />
        </S.ImageContainer>

        <S.ProfileDetailContainer>
          <C.CommonText size="20px">Heedyomy</C.CommonText>
          <S.DescriptionName>학생</S.DescriptionName> <br />
          <S.DescriptionName>
            내 소개를 할게 나는 히정이야 내 별명은 히됴미고 나는 ... 음... 노래 듣는 걸 좋아해 ... 😀
          </S.DescriptionName>
          <S.IconContainer>
            <S.IconStyle>
              <CiMail className="icon" />
            </S.IconStyle>
            <p>info@yourdomain.com</p>
          </S.IconContainer>
          <S.IconContainer>
            <S.IconStyle>
              <IoIosCall className="icon" />
            </S.IconStyle>
            <p>+1 (378) 400-1234</p>
          </S.IconContainer>
          <S.IconContainer>
            <S.IconStyle>
              <TiWorld className="icon" />
            </S.IconStyle>
            <p>www.yourdomain.com</p>
          </S.IconContainer>
        </S.ProfileDetailContainer>
      </S.ProfileContainer>
    </S.BGSidebarContainer>
  );
};

export default PageSidebar;
