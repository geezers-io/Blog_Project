import { useSession, signOut, signIn } from 'next-auth/react';
import Button from '@mui/material/Button';

export default function LoginComponent() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        <Button style={{ color: 'black', marginRight: '10px' }} onClick={() => signOut()}>
          <a style={{ textDecoration: 'none', color: 'black' }}>임시 로그아웃</a>
        </Button>
      </>
    );
  }
  return (
    <>
      <Button style={{ color: 'black', marginRight: '10px' }} onClick={() => signIn()}>
        <a style={{ textDecoration: 'none', color: 'black' }}>임시 로그인</a>
      </Button>
    </>
  );
}
