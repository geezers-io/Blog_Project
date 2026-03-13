import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { MailOutline, Edit as EditIcon } from '@mui/icons-material';
import { Typography, TextField, Button, Box, Avatar, Paper, Divider } from '@mui/material';

const ProfilePage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

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

  if (status === 'loading') return null;

  if (!session) {
    return (
      <Box sx={{ textAlign: 'center', py: 10 }}>
        <Typography variant="h4" color="text.secondary">
          로그인이 필요합니다
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <Paper elevation={0} sx={{ p: 4, border: '1px solid #eee', borderRadius: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
          <Avatar
            src={image}
            alt={name}
            sx={{
              width: 100,
              height: 100,
              border: '3px solid #fff',
              boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
            }}
          />
          <Box sx={{ flex: 1 }}>
            {isEditing ? (
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                  size="small"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  placeholder="이름"
                  autoFocus
                  sx={{ flex: 1 }}
                />
                <Button size="small" variant="contained" onClick={handleSave}>
                  저장
                </Button>
                <Button size="small" variant="outlined" onClick={() => setIsEditing(false)}>
                  취소
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h3">{name || '이름 없음'}</Typography>
                <IconBtn
                  onClick={() => {
                    setEditName(name);
                    setIsEditing(true);
                  }}
                />
              </Box>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1 }}>
          <MailOutline sx={{ fontSize: 20, color: '#999' }} />
          <Typography variant="body1" color="text.secondary">
            {email}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

const IconBtn = ({ onClick }: { onClick: () => void }) => (
  <Box
    component="button"
    onClick={onClick}
    sx={{
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      p: 0.5,
      borderRadius: 1,
      display: 'flex',
      alignItems: 'center',
      color: '#999',
      '&:hover': { color: '#666', backgroundColor: '#f5f5f5' },
    }}
  >
    <EditIcon sx={{ fontSize: 18 }} />
  </Box>
);

export default ProfilePage;
