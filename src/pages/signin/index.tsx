import Image from 'next/image';
import { useState } from 'react';
import { LockOutlined as LockOutlinedIcon } from '@mui/icons-material';
import { TextField, Button, Grid, Typography, Link, Avatar, Box } from '@mui/material';

const SignInPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
    console.log('Username:', username);
    console.log('Password:', password);
  };

  const kakaoLogo = '/kakao.png';
  const naverLogo = '/naver.png';

  return (
    <Grid container justifyContent="center" height="100vh">
      <Grid item>
        <Grid sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            로그인
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="아이디"
              name="username"
              autoFocus
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="비밀번호"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <Button fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }} onClick={handleSignIn}>
              로그인
            </Button>
            <Grid container spacing={2}>
              <Grid item xs>
                <Link href="#" variant="body2">
                  비밀번호를 잊으셨나요?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2">
                  회원가입
                </Link>
              </Grid>
            </Grid>
            <Typography variant="body1" sx={{ mt: 3 }}>
              소셜 로그인
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button fullWidth variant="outlined">
                  <Image src={kakaoLogo} width={100} height={40} />
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button fullWidth variant="outlined">
                  <Image src={naverLogo} width={100} height={40} />
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SignInPage;
