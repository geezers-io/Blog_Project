import Image from 'next/image';
import { useState } from 'react';
import { CiMail } from 'react-icons/ci';
import { IoIosCall } from 'react-icons/io';
import { TiWorld } from 'react-icons/ti';
import * as C from '@/styles/common/common.style';
import * as S from '@/styles/layout/layout.style';

const AboutPage = () => {
  const [name] = useState('Heedyomy');
  const [occupation] = useState('학생');
  const [introduction, setIntroduction] = useState(
    '내 소개를 할게 나는 히정이야 내 별명은 히됴미고 나는 ... 음... 노래 듣는 걸 좋아해 ... 😀',
  );
  const [email, setEmail] = useState('info@yourdomain.com');
  const [phoneNumber, setPhoneNumber] = useState('+1 (378) 400-1234');
  const [website, setWebsite] = useState('www.yourdomain.com');
  const [profilePicture, setProfilePicture] = useState('/Profile.jpg');
  const [isEditing, setIsEditing] = useState(false);

  const handleProfilePictureChange = event => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePicture(reader.result as string);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleIntroductionChange = event => {
    setIntroduction(event.target.value);
  };

  const handleEmailChange = event => {
    setEmail(event.target.value);
  };

  const handlePhoneNumberChange = event => {
    setPhoneNumber(event.target.value);
  };

  const handleWebsiteChange = event => {
    setWebsite(event.target.value);
  };

  const handleEditButtonClick = () => {
    setIsEditing(!isEditing);
  };

  return (
    <S.BGSidebarContainer>
      <S.ProfileContainer>
        <S.ImageContainer>
          <Image src={profilePicture} alt="프로필 사진" width="500px" height="500px" objectFit="contain" />
        </S.ImageContainer>

        <S.ProfileDetailContainer>
          <C.CommonText size="20px">{name}</C.CommonText>
          <S.DescriptionName>{occupation}</S.DescriptionName> <br />
          {isEditing ? (
            <>
              <textarea value={introduction} onChange={handleIntroductionChange} />
              <input type="text" value={email} onChange={handleEmailChange} />
              <input type="text" value={phoneNumber} onChange={handlePhoneNumberChange} />
              <input type="text" value={website} onChange={handleWebsiteChange} />
            </>
          ) : (
            <>
              <p>{introduction}</p>
              <div>
                <S.IconContainer>
                  <S.IconStyle>
                    <CiMail className="icon" />
                  </S.IconStyle>
                  <p>{email}</p>
                </S.IconContainer>
              </div>
              <div>
                <S.IconContainer>
                  <S.IconStyle>
                    <IoIosCall className="icon" />
                  </S.IconStyle>
                  <p>{phoneNumber}</p>
                </S.IconContainer>
              </div>
              <div>
                <S.IconContainer>
                  <S.IconStyle>
                    <TiWorld className="icon" />
                  </S.IconStyle>
                  <p>{website}</p>
                </S.IconContainer>
              </div>
            </>
          )}
          <input type="file" accept="image/*" onChange={handleProfilePictureChange} />
          <button onClick={handleEditButtonClick}>{isEditing ? '저장' : '프로필 편집'}</button>
        </S.ProfileDetailContainer>
      </S.ProfileContainer>
    </S.BGSidebarContainer>
  );
};

export default AboutPage;
