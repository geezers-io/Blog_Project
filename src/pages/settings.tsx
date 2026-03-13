import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { CloudUpload as UploadIcon, MusicNote } from '@mui/icons-material';
import { Typography, TextField, Button, Box, Avatar, Paper, Alert } from '@mui/material';
import ThemePicker from '@/components/blog/ThemePicker';
import { api } from '@/lib/api';

const SettingsPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [settings, setSettings] = useState({
    username: '',
    name: '',
    bio: '',
    blogTitle: '',
    themeColor: '#ffa000',
    bgmUrl: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
      return;
    }
    api
      .getBlogSettings()
      .then(data => {
        setSettings({
          username: data.username || '',
          name: data.name || '',
          bio: data.bio || '',
          blogTitle: data.blogTitle || '',
          themeColor: data.themeColor || '#ffa000',
          bgmUrl: data.bgmUrl || '',
        });
      })
      .catch(console.error);
  }, [status, router]);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      await api.updateBlogSettings(settings);
      setMessage('저장되었습니다!');
      setTimeout(() => setMessage(''), 3000);
    } catch (e: any) {
      setMessage(e.message || '오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleBgmUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { url } = await api.uploadFile(file);
      setSettings(prev => ({ ...prev, bgmUrl: url }));
    } catch (err) {
      console.error('BGM upload failed:', err);
    }
  };

  if (status === 'loading') return null;

  return (
    <Box sx={{ maxWidth: 640, mx: 'auto' }}>
      <Typography variant="h2" sx={{ mb: 3 }}>
        블로그 설정
      </Typography>

      {message && (
        <Alert severity={message.includes('저장') ? 'success' : 'error'} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      {/* 미리보기 */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          background: `linear-gradient(135deg, ${settings.themeColor}15, ${settings.themeColor}08)`,
          border: `1px solid ${settings.themeColor}20`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={session?.user?.image || ''}
            sx={{ width: 56, height: 56, border: `2px solid ${settings.themeColor}` }}
          />
          <Box>
            <Typography variant="h4" sx={{ color: settings.themeColor }}>
              {settings.blogTitle || `${settings.name || '무제'}의 블로그`}
            </Typography>
            <Typography variant="caption">@{settings.username || settings.name || 'username'}</Typography>
            {settings.bio && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {settings.bio}
              </Typography>
            )}
          </Box>
        </Box>
      </Paper>

      {/* 기본 정보 */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid #eee', borderRadius: 2 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          기본 정보
        </Typography>
        <TextField
          fullWidth
          size="small"
          label="블로그 아이디"
          placeholder="URL에 사용됩니다 (예: myblog)"
          value={settings.username}
          onChange={e => setSettings(prev => ({ ...prev, username: e.target.value }))}
          sx={{ mb: 2 }}
          helperText={settings.username ? `blog/${settings.username}` : ''}
        />
        <TextField
          fullWidth
          size="small"
          label="이름"
          value={settings.name}
          onChange={e => setSettings(prev => ({ ...prev, name: e.target.value }))}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          size="small"
          label="블로그 제목"
          placeholder="나만의 블로그 제목"
          value={settings.blogTitle}
          onChange={e => setSettings(prev => ({ ...prev, blogTitle: e.target.value }))}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          size="small"
          label="자기소개"
          multiline
          minRows={3}
          placeholder="자기소개를 작성해보세요"
          value={settings.bio}
          onChange={e => setSettings(prev => ({ ...prev, bio: e.target.value }))}
        />
      </Paper>

      {/* 테마 */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid #eee', borderRadius: 2 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          테마
        </Typography>
        <ThemePicker
          selected={settings.themeColor}
          onChange={color => setSettings(prev => ({ ...prev, themeColor: color }))}
        />
      </Paper>

      {/* BGM */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid #eee', borderRadius: 2 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          BGM 설정
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          블로그 방문자에게 들려줄 배경음악을 설정하세요
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <Button component="label" variant="outlined" startIcon={<UploadIcon />} size="small">
            음악 파일 업로드
            <input type="file" accept="audio/*" hidden onChange={handleBgmUpload} />
          </Button>
          {settings.bgmUrl && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: settings.themeColor }}>
              <MusicNote sx={{ fontSize: 16 }} />
              <Typography variant="caption">BGM 설정됨</Typography>
              <Button size="small" color="error" onClick={() => setSettings(prev => ({ ...prev, bgmUrl: '' }))}>
                삭제
              </Button>
            </Box>
          )}
        </Box>
        <TextField
          fullWidth
          size="small"
          label="또는 URL 직접 입력"
          placeholder="https://example.com/music.mp3"
          value={settings.bgmUrl}
          onChange={e => setSettings(prev => ({ ...prev, bgmUrl: e.target.value }))}
          sx={{ mt: 2 }}
        />
      </Paper>

      {/* 저장 */}
      <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          onClick={() => {
            const name = settings.username || settings.name;
            if (name) router.push(`/blog/${name}`);
          }}
        >
          내 블로그 보기
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
          sx={{ backgroundColor: settings.themeColor }}
        >
          {saving ? '저장 중...' : '저장'}
        </Button>
      </Box>
    </Box>
  );
};

export default SettingsPage;
