import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { MailOutline } from '@mui/icons-material';
import { TextField, Button, Grid, Typography, Avatar, Box } from '@mui/material';

const AboutPage = () => {
  const { data: session } = useSession();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || '');
      setEmail(session.user.email || '');
      setImage(session.user.image || '');
    }
  }, [session]);

  const handleSave = async () => {
    try {
      const res = await fetch('/api/users/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName }),
      });
      if (res.ok) {
        const user = await res.json();
        setName(user.name);
        setIsEditing(false);
      }
    } catch {
      alert('저장에 실패했습니다.');
    }
  };

  const handleEdit = () => {
    setEditName(name);
    setIsEditing(true);
  };

  if (!session) {
    return (
      <Grid container justifyContent="center" height="100vh">
        <Grid item>
          <Typography sx={{ mt: 8 }}>로그인이 필요합니다.</Typography>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container justifyContent="center" height="100vh">
      <Grid item>
        <Grid sx={{ display: 'flex', alignItems: 'center', mt: 8 }}>
          <Avatar
            src={image}
            alt="프로필 사진"
            sx={{
              width: 200,
              height: 200,
              mr: 4,
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Box>
            {isEditing ? (
              <>
                <TextField
                  margin="normal"
                  fullWidth
                  label="이름"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                />
                <Button variant="contained" onClick={handleSave} sx={{ mt: 2, mr: 1 }}>
                  저장
                </Button>
                <Button variant="outlined" onClick={() => setIsEditing(false)} sx={{ mt: 2 }}>
                  취소
                </Button>
              </>
            ) : (
              <>
                <Typography component="h1" variant="h5">
                  {name || '이름 없음'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <MailOutline sx={{ mr: 1 }} />
                  <Typography variant="body2">{email}</Typography>
                </Box>
                <Button variant="contained" onClick={handleEdit} sx={{ mt: 2 }}>
                  프로필 편집
                </Button>
              </>
            )}
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AboutPage;
