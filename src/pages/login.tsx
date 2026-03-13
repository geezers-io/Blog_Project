import { signIn } from 'next-auth/react';
import { Google as GoogleIcon } from '@mui/icons-material';
import { Typography, Button, Box } from '@mui/material';

const LoginPage = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 200px)',
      }}
    >
      <Box sx={{ maxWidth: 380, width: '100%', textAlign: 'center' }}>
        {/* Logo */}
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #ffa000, #ff8f00)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
          }}
        >
          <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 32 }}>B</Typography>
        </Box>

        <Typography sx={{ fontWeight: 800, fontSize: '1.75rem', color: '#212529', mb: 0.5 }}>환영합니다!</Typography>
        <Typography sx={{ fontSize: '1rem', color: '#868e96', mb: 4 }}>소셜 계정으로 간편하게 시작하세요</Typography>

        <Button
          fullWidth
          variant="outlined"
          size="large"
          startIcon={<GoogleIcon />}
          onClick={() => signIn('google', { callbackUrl: '/' })}
          sx={{
            py: 1.5,
            borderColor: '#dee2e6',
            borderRadius: '12px',
            color: '#212529',
            fontWeight: 600,
            fontSize: '0.9375rem',
            backgroundColor: '#fff',
            '&:hover': {
              borderColor: '#ffa000',
              backgroundColor: '#fffbf0',
            },
          }}
        >
          Google로 계속하기
        </Button>

        <Typography sx={{ mt: 4, fontSize: '0.75rem', color: '#adb5bd' }}>
          로그인함으로써 서비스 이용약관에 동의합니다.
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginPage;
