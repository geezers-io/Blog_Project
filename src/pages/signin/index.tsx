import { useState } from 'react';
import { TextField, Button, Grid, Typography, Link } from '@mui/material';
import * as C from '@/styles/common/common.style';
import * as S from '@/styles/sign/signIn.style';

const SignInPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
    console.log('Username:', username);
    console.log('Password:', password);
  };

  return (
    <S.BGContainer>
      <C.CommonText size="20px">로그인</C.CommonText>

      <S.SignUpContainer>
        <Grid container spacing={2} direction="column">
          <Grid item>
            <Typography variant="body1">아이디</Typography>
            <TextField
              id="username"
              label="아이디"
              variant="outlined"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </Grid>

          <Grid item>
            <Typography variant="body1">비밀번호</Typography>
            <TextField
              id="password"
              label="비밀번호"
              variant="outlined"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </Grid>
        </Grid>

        <Button variant="contained" onClick={handleSignIn}>
          로그인
        </Button>
      </S.SignUpContainer>

      <Link href="/forgot-password" color="inherit">
        아이디/비밀번호 찾기
      </Link>
      <Link href="/signup" color="inherit">
        회원가입
      </Link>

      <Typography variant="body1">소셜 로그인</Typography>
      <Button variant="outlined">카카오 로그인</Button>
      <Button variant="outlined">네이버 로그인</Button>
    </S.BGContainer>
  );
};

export default SignInPage;
