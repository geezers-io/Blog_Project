import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Close as CloseIcon, Image as ImageIcon } from '@mui/icons-material';
import {
  TextField,
  Button,
  Box,
  Card,
  CardMedia,
  MenuItem,
  Select,
  FormControl,
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
    <Box sx={{ maxWidth: 768, mx: 'auto', pt: 2 }}>
      {/* Title input - velog style large */}
      <TextField
        fullWidth
        placeholder="제목을 입력하세요"
        variant="standard"
        value={title}
        onChange={e => setTitle(e.target.value)}
        InputProps={{
          disableUnderline: true,
          sx: {
            fontSize: '2.5rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            py: 1,
          },
        }}
        sx={{ mb: 1 }}
      />

      {/* Divider bar */}
      <Box sx={{ width: 64, height: 6, backgroundColor: '#f59e0b', borderRadius: 3, mb: 3 }} />

      {/* Tags */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mb: tags.length > 0 ? 1 : 0 }}>
          {tags.map(tag => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              onDelete={() => setTags(prev => prev.filter(t => t !== tag))}
              sx={{
                backgroundColor: 'rgba(255,160,0,0.08)',
                color: '#f59e0b',
                fontWeight: 600,
                '& .MuiChip-deleteIcon': { color: '#f59e0b' },
              }}
            />
          ))}
        </Box>
        <TextField
          size="small"
          placeholder="태그를 입력하세요 (Enter로 추가)"
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
          variant="standard"
          InputProps={{
            disableUnderline: true,
            sx: { fontSize: '1rem' },
          }}
          sx={{ width: '100%', maxWidth: 320 }}
        />
      </Box>

      {/* Category + Image upload toolbar */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <Select
            displayEmpty
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
            sx={{
              borderRadius: '8px',
              fontSize: '0.875rem',
              backgroundColor: '#fff',
            }}
          >
            <MenuItem value="">카테고리 선택</MenuItem>
            {categories.map(cat => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <IconButton
          component="label"
          sx={{
            border: '1px solid #dee2e6',
            borderRadius: '8px',
            width: 40,
            height: 40,
          }}
        >
          <ImageIcon sx={{ fontSize: 20, color: '#868e96' }} />
          <input
            type="file"
            accept="image/*,video/*,audio/*"
            hidden
            onChange={e => setSelectedFile(e.target.files?.[0] || null)}
          />
        </IconButton>
      </Box>

      {/* File preview */}
      {selectedFile && (
        <Card sx={{ mb: 3, maxWidth: 400, position: 'relative', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <IconButton
            size="small"
            onClick={() => setSelectedFile(null)}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'rgba(0,0,0,0.5)',
              color: '#fff',
              zIndex: 1,
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
          {selectedFile.type?.startsWith('image/') && (
            <CardMedia component="img" height={200} image={URL.createObjectURL(selectedFile)} alt="미리보기" />
          )}
          {selectedFile.type?.startsWith('video/') && (
            <CardMedia component="video" controls height={200} src={URL.createObjectURL(selectedFile)} />
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

      {/* Content editor */}
      <TextField
        fullWidth
        multiline
        minRows={16}
        placeholder="당신의 이야기를 적어보세요..."
        variant="standard"
        value={content}
        onChange={e => setContent(e.target.value)}
        InputProps={{
          disableUnderline: true,
          sx: {
            fontSize: '1.125rem',
            lineHeight: 1.8,
          },
        }}
        sx={{ mb: 4 }}
      />

      {/* Bottom action bar */}
      <Box
        sx={{
          position: 'sticky',
          bottom: 0,
          py: 2,
          backgroundColor: '#f8f9fa',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid #f1f3f5',
        }}
      >
        <Button sx={{ color: '#868e96', fontWeight: 600 }} onClick={() => router.back()}>
          &#x2190; 나가기
        </Button>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button variant="outlined" sx={{ borderRadius: '20px', borderColor: '#dee2e6', color: '#868e96' }}>
            임시저장
          </Button>
          <Button variant="contained" onClick={handleSubmit} disabled={uploading} sx={{ borderRadius: '20px', px: 3 }}>
            {uploading ? '저장 중...' : isEdit ? '수정하기' : '출간하기'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default WritePage;
