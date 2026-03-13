import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Close as CloseIcon, CloudUpload as UploadIcon, Add as AddIcon } from '@mui/icons-material';
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
  Chip,
} from '@mui/material';
import { api } from '@/lib/api';

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
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const isEdit = Boolean(router.query.edit);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  useEffect(() => {
    api.getCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    const editId = router.query.edit as string;
    if (editId) {
      api
        .getPost(editId)
        .then(post => {
          setTitle(post.title);
          setContent(post.content);
          setCategoryId(post.categoryId || '');
          if (post.tags) setTags(post.tags.split(',').map((t: string) => t.trim()));
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
        const { url } = await api.uploadFile(selectedFile);
        imageUrl = url;
      }

      const editId = router.query.edit as string;
      const postData = {
        title,
        content,
        image: imageUrl,
        categoryId: categoryId || undefined,
        tags: tags.length > 0 ? tags.join(',') : undefined,
      };

      const post = editId ? await api.updatePost(editId, postData) : await api.createPost(postData);
      router.push(`/posts/${post.id}`);
    } catch (e: any) {
      alert(e.message || '오류가 발생했습니다.');
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
          <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mb: 1 }}>
            {tags.map(tag => (
              <Chip key={tag} label={tag} size="small" onDelete={() => setTags(prev => prev.filter(t => t !== tag))} />
            ))}
          </Box>
          <TextField
            size="small"
            placeholder="태그를 입력하고 Enter (쉼표로 구분 가능)"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault();
                const newTags = tagInput
                  .split(',')
                  .map(t => t.trim())
                  .filter(t => t && !tags.includes(t));
                if (newTags.length > 0) {
                  setTags(prev => [...prev, ...newTags]);
                }
                setTagInput('');
              }
            }}
            InputProps={{
              endAdornment: (
                <IconButton
                  size="small"
                  onClick={() => {
                    const newTags = tagInput
                      .split(',')
                      .map(t => t.trim())
                      .filter(t => t && !tags.includes(t));
                    if (newTags.length > 0) {
                      setTags(prev => [...prev, ...newTags]);
                    }
                    setTagInput('');
                  }}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              ),
            }}
            sx={{ width: '100%', maxWidth: 360 }}
          />
        </Box>

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
