import { TextField } from '@mui/material';
import * as C from '@/styles/common/common.style';
import * as S from '@/styles/sign/signIn.style';
const SignInPage = () => (
  <S.BGContainer>
    <C.CommonText size="20px">회원가입</C.CommonText>
    <S.SignUpContainer>
      <C.CommonText size="15px">아이디</C.CommonText>
      <TextField id="outlined-basic" label="아이디" variant="outlined" />
    </S.SignUpContainer>
  </S.BGContainer>
);

export default SignInPage;
