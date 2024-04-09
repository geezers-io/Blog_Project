import { useState } from 'react';
import { LockOutlined as LockOutlinedIcon } from '@mui/icons-material';
import {
  TextField,
  Button,
  Grid,
  Typography,
  Link,
  Avatar,
  Box,
  FormControlLabel,
  Checkbox,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { color } from '@/styles/theme/color';

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSignUp = () => {
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Confirm Password:', confirmPassword);
    console.log('Name:', name);
    console.log('Birthday:', birthday);
    console.log('Gender:', gender);
    console.log('Phone Number:', phoneNumber);
    console.log('Agree to Terms:', agreeTerms);
  };

  return (
    <Grid container justifyContent="center" height="100vh">
      <Grid item>
        <Grid sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            회원가입
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <Box sx={{ maxWidth: 'sm' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="이메일"
                name="email"
                autoFocus
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="비밀번호"
                type="password"
                id="password"
                autoComplete="new-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="비밀번호 확인"
                type="password"
                id="confirmPassword"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="이름"
                name="name"
                value={name}
                onChange={e => setName(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="birthday"
                label="생년월일(8자리)"
                name="birthday"
                value={birthday}
                onChange={e => setBirthday(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="phoneNumber"
                label="휴대전화번호"
                name="phoneNumber"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
              />

              <ToggleButtonGroup
                value={gender}
                exclusive
                onChange={(e, value) => setGender(value)}
                aria-label="gender"
                sx={{ mt: 2 }}
              >
                <ToggleButton
                  value="male"
                  aria-label="male"
                  sx={{ bgcolor: gender === 'male' ? color.primary.main : '#07d7e6', color: '#fff' }}
                >
                  남자
                </ToggleButton>
                <ToggleButton
                  value="female"
                  aria-label="female"
                  sx={{ bgcolor: gender === 'female' ? color.secondary.main : '#ee6dd9', color: '#fff' }}
                >
                  여자
                </ToggleButton>
              </ToggleButtonGroup>

              <Button fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }} onClick={handleSignUp}>
                회원가입
              </Button>
              <FormControlLabel
                control={<Checkbox checked={agreeTerms} onChange={() => setAgreeTerms(!agreeTerms)} />}
                label="약관에 동의합니다."
                sx={{ justifyContent: 'flex-end' }}
              />
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="/signin" variant="body2">
                    이미 계정이 있으신가요? 로그인
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SignUpPage;
