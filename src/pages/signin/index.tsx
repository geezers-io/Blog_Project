import { signIn } from 'next-auth/react';
import { LockOutlined as LockOutlinedIcon } from '@mui/icons-material';
import { Google as GoogleIcon } from '@mui/icons-material';
import { Button, Grid, Typography, Avatar, Box } from '@mui/material';

const SignInPage = () => {
  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' });
  };

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
          <Box sx={{ mt: 3, width: '100%', maxWidth: 400 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleSignIn}
              sx={{ py: 1.5 }}
            >
              Google로 로그인
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SignInPage;
