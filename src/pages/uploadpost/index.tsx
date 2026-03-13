import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Grid,
  Box,
  Card,
  CardMedia,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';

interface Category {
  id: string;
  name: string;
}

const BlogWritePage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

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

  const handleUpload = async () => {
    if (!session) {
      alert('로그인이 필요합니다.');
      return;
    }
    if (!title || !content) {
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
        alert(error.message || '게시물 저장에 실패했습니다.');
      }
    } catch {
      alert('오류가 발생했습니다.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Grid container justifyContent="center" mt={10}>
      <Grid item xs={12} md={8}>
        <TextField
          fullWidth
          margin="normal"
          label="게시글 제목"
          variant="outlined"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>카테고리</InputLabel>
          <Select value={categoryId} label="카테고리" onChange={e => setCategoryId(e.target.value)}>
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
          margin="normal"
          label="게시글 내용"
          variant="outlined"
          multiline
          rows={10}
          value={content}
          onChange={e => setContent(e.target.value)}
        />
        <Box mt={2}>
          <input type="file" accept="image/*,video/*,audio/*" onChange={handleFileChange} />
          {selectedFile && (
            <Card sx={{ maxWidth: 345, mt: 1 }}>
              {selectedFile.type?.startsWith('image/') && (
                <CardMedia component="img" height="140" image={URL.createObjectURL(selectedFile)} alt="Selected File" />
              )}
              {selectedFile.type?.startsWith('video/') && (
                <CardMedia
                  component="video"
                  controls
                  height="140"
                  src={URL.createObjectURL(selectedFile)}
                  title="Selected File"
                />
              )}
              {selectedFile.type?.startsWith('audio/') && (
                <audio controls>
                  <source src={URL.createObjectURL(selectedFile)} type={selectedFile.type} />
                </audio>
              )}
            </Card>
          )}
        </Box>
        <Box mt={2}>
          <Button variant="contained" onClick={handleUpload} disabled={uploading}>
            {uploading ? '업로드 중...' : router.query.edit ? '게시물 수정' : '게시물 업로드'}
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default BlogWritePage;
