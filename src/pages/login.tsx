import { signIn } from 'next-auth/react';
import { Google as GoogleIcon } from '@mui/icons-material';
import { Typography, Button, Box, Paper } from '@mui/material';

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
      <Paper
        elevation={0}
        sx={{
          p: 5,
          maxWidth: 400,
          width: '100%',
          textAlign: 'center',
          border: '1px solid #eee',
          borderRadius: 3,
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            backgroundColor: 'rgba(255,160,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2,
          }}
        >
          <Typography sx={{ fontSize: 28 }}>B</Typography>
        </Box>
        <Typography variant="h3" sx={{ mb: 1 }}>
          로그인
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          소셜 계정으로 간편하게 시작하세요
        </Typography>
        <Button
          fullWidth
          variant="outlined"
          size="large"
          startIcon={<GoogleIcon />}
          onClick={() => signIn('google', { callbackUrl: '/' })}
          sx={{
            py: 1.5,
            borderColor: '#ddd',
            color: '#333',
            '&:hover': {
              borderColor: '#bbb',
              backgroundColor: '#fafafa',
            },
          }}
        >
          Google로 계속하기
        </Button>
      </Paper>
    </Box>
  );
};

export default LoginPage;
