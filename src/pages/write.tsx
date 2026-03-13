import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Close as CloseIcon, CloudUpload as UploadIcon } from '@mui/icons-material';
import {
  Typography,
  TextField,
  Button,
  Box,
  Card,
  CardMedia,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Paper,
  IconButton,
} from '@mui/material';

interface Category {
  id: string;
  name: string;
}

const WritePage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const isEdit = Boolean(router.query.edit);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  useEffect(() => {
    const editId = router.query.edit as string;
    if (editId) {
      fetch(`/api/posts/${editId}`)
        .then(res => res.json())
        .then(post => {
          setTitle(post.title);
          setContent(post.content);
          setCategoryId(post.categoryId || '');
        })
        .catch(console.error);
    }
  }, [router.query.edit]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleSubmit = async () => {
    if (!session) return;
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    setUploading(true);
    try {
      let imageUrl: string | undefined;
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
        if (uploadRes.ok) {
          const { url } = await uploadRes.json();
          imageUrl = url;
        }
      }

      const editId = router.query.edit as string;
      const method = editId ? 'PUT' : 'POST';
      const url = editId ? `/api/posts/${editId}` : '/api/posts';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          image: imageUrl,
          categoryId: categoryId || undefined,
        }),
      });

      if (res.ok) {
        const post = await res.json();
        router.push(`/posts/${post.id}`);
      } else {
        const error = await res.json();
        alert(error.message || '저장에 실패했습니다.');
      }
    } catch {
      alert('오류가 발생했습니다.');
    } finally {
      setUploading(false);
    }
  };

  if (status === 'loading') return null;

  return (
    <Box sx={{ maxWidth: 720, mx: 'auto' }}>
      <Typography variant="h2" sx={{ mb: 3 }}>
        {isEdit ? '글 수정' : '새 글 작성'}
      </Typography>

      <Paper elevation={0} sx={{ p: 3, border: '1px solid #eee', borderRadius: 2 }}>
        <TextField
          fullWidth
          placeholder="제목을 입력하세요"
          variant="standard"
          value={title}
          onChange={e => setTitle(e.target.value)}
          InputProps={{
            disableUnderline: true,
            sx: { fontSize: '1.5rem', fontWeight: 600, pb: 1 },
          }}
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel>카테고리 선택</InputLabel>
          <Select value={categoryId} label="카테고리 선택" onChange={e => setCategoryId(e.target.value)}>
            <MenuItem value="">선택 안함</MenuItem>
            {categories.map(cat => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          multiline
          minRows={12}
          placeholder="내용을 작성하세요..."
          variant="outlined"
          value={content}
          onChange={e => setContent(e.target.value)}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              fontSize: '1rem',
              lineHeight: 1.8,
            },
          }}
        />

        <Box sx={{ mb: 2 }}>
          <Button component="label" variant="outlined" startIcon={<UploadIcon />} sx={{ borderStyle: 'dashed' }}>
            파일 첨부
            <input type="file" accept="image/*,video/*,audio/*" hidden onChange={handleFileChange} />
          </Button>
          {selectedFile && (
            <Card sx={{ mt: 1.5, maxWidth: 320, position: 'relative' }}>
              <IconButton
                size="small"
                onClick={() => setSelectedFile(null)}
                sx={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  color: '#fff',
                  '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
              {selectedFile.type?.startsWith('image/') && (
                <CardMedia component="img" height={180} image={URL.createObjectURL(selectedFile)} alt="미리보기" />
              )}
              {selectedFile.type?.startsWith('video/') && (
                <CardMedia component="video" controls height={180} src={URL.createObjectURL(selectedFile)} />
              )}
              {selectedFile.type?.startsWith('audio/') && (
                <Box sx={{ p: 2 }}>
                  <audio controls style={{ width: '100%' }}>
                    <source src={URL.createObjectURL(selectedFile)} type={selectedFile.type} />
                  </audio>
                </Box>
              )}
            </Card>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={() => router.back()}>
            취소
          </Button>
          <Button variant="contained" onClick={handleSubmit} disabled={uploading}>
            {uploading ? '저장 중...' : isEdit ? '수정 완료' : '발행'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default WritePage;
