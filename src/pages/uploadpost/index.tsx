import { useRouter } from 'next/router';
import { useState } from 'react';
import { TextField, Button, Grid, Box, Card, CardMedia } from '@mui/material';

const BlogWritePage = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = event => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = () => {
    const postData = {
      title,
      content,
      selectedFile,
    };
    console.log(postData);

    router.push('/');
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
            <Card sx={{ maxWidth: 345 }}>
              {selectedFile.type && selectedFile.type.startsWith('image/') && (
                <CardMedia component="img" height="140" image={URL.createObjectURL(selectedFile)} alt="Selected File" />
              )}
              {selectedFile.type && selectedFile.type.startsWith('video/') && (
                <CardMedia
                  component="video"
                  controls
                  height="140"
                  src={URL.createObjectURL(selectedFile)}
                  title="Selected File"
                />
              )}
              {selectedFile.type && selectedFile.type.startsWith('audio/') && (
                <audio controls>
                  <source src={URL.createObjectURL(selectedFile)} type={selectedFile.type} />
                  귀하의 브라우저는 오디오 요소를 지원하지 않습니다.
                </audio>
              )}
            </Card>
          )}
        </Box>
        <Box mt={2}>
          <Button variant="contained" onClick={handleUpload}>
            게시물 업로드
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default BlogWritePage;
