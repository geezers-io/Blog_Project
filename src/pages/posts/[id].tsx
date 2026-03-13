import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Favorite, FavoriteBorder, ChatBubbleOutline } from '@mui/icons-material';
import { Typography, Box, Button, TextField, CardMedia, Avatar, Chip, Divider, Paper } from '@mui/material';
import { api } from '@/lib/api';

export const getServerSideProps: GetServerSideProps = async context => {
  const { id } = context.params as { id: string };
  const API_URL = process.env.API_URL || 'http://localhost:8080/api';

  const res = await fetch(`${API_URL}/posts/${id}`);
  if (!res.ok) return { notFound: true };

  const post = await res.json();
  return { props: { post } };
};

const PostDetailPage = ({ post }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [comments, setComments] = useState(post.comments || []);
  const [commentText, setCommentText] = useState('');
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post._count?.likes || 0);

  const isAuthor = (session?.user as any)?.id === post.author.id;

  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await api.deletePost(post.id);
      router.push('/');
    } catch (e) {
      console.error('Delete failed:', e);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    try {
      const comment = await api.createComment(post.id, { content: commentText });
      setComments([comment, ...comments]);
      setCommentText('');
    } catch (e) {
      console.error('Comment failed:', e);
    }
  };

  const handleLike = async () => {
    try {
      const data = await api.toggleLike(post.id);
      setLiked(data.liked);
      setLikeCount((prev: number) => (data.liked ? prev + 1 : prev - 1));
    } catch (e) {
      console.error('Like failed:', e);
    }
  };

  return (
    <Box sx={{ maxWidth: 720, mx: 'auto' }}>
      {/* Header */}
      {post.category && (
        <Chip
          label={post.category.name}
          size="small"
          sx={{
            mb: 2,
            backgroundColor: 'rgba(255,160,0,0.1)',
            color: '#e65100',
            fontWeight: 500,
          }}
        />
      )}

      <Typography variant="h1" sx={{ mb: 2 }}>
        {post.title}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
        <Avatar src={post.author.image} alt={post.author.name} sx={{ width: 36, height: 36 }} />
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {post.author.name || '익명'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {new Date(post.createdAt).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Typography>
        </Box>
        {isAuthor && (
          <Box sx={{ ml: 'auto', display: 'flex', gap: 0.5 }}>
            <Button size="small" variant="outlined" onClick={() => router.push(`/write?edit=${post.id}`)}>
              수정
            </Button>
            <Button size="small" variant="outlined" color="error" onClick={handleDelete}>
              삭제
            </Button>
          </Box>
        )}
      </Box>

      {/* Content */}
      {post.image && (
        <CardMedia
          component="img"
          image={post.image}
          alt={post.title}
          sx={{ borderRadius: 2, mb: 4, maxHeight: 480, objectFit: 'cover' }}
        />
      )}

      <Typography variant="body1" sx={{ mb: 5, whiteSpace: 'pre-wrap', lineHeight: 1.9 }}>
        {post.content}
      </Typography>

      {/* Actions */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          mb: 4,
          py: 2,
          borderTop: '1px solid #eee',
          borderBottom: '1px solid #eee',
        }}
      >
        <Box
          onClick={handleLike}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            cursor: 'pointer',
            px: 1.5,
            py: 0.75,
            borderRadius: 2,
            transition: 'all 0.15s',
            '&:hover': { backgroundColor: '#fef2f2' },
          }}
        >
          {liked ? (
            <Favorite sx={{ fontSize: 20, color: '#ef4444' }} />
          ) : (
            <FavoriteBorder sx={{ fontSize: 20, color: '#999' }} />
          )}
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {likeCount}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#999' }}>
          <ChatBubbleOutline sx={{ fontSize: 20 }} />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {comments.length}
          </Typography>
        </Box>
      </Box>

      {/* Comments */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          댓글
        </Typography>

        {session ? (
          <Box sx={{ display: 'flex', gap: 1.5, mb: 3, alignItems: 'flex-start' }}>
            <Avatar src={session.user?.image || ''} sx={{ width: 32, height: 32, mt: 0.5 }} />
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                size="small"
                multiline
                minRows={2}
                placeholder="댓글을 작성해주세요..."
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                <Button size="small" variant="contained" onClick={handleComment} disabled={!commentText.trim()}>
                  등록
                </Button>
              </Box>
            </Box>
          </Box>
        ) : (
          <Paper elevation={0} sx={{ p: 2.5, mb: 3, textAlign: 'center', backgroundColor: '#f9f9f9', borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">
              댓글을 작성하려면{' '}
              <Box
                component="span"
                onClick={() => router.push('/login')}
                sx={{ color: 'primary.main', cursor: 'pointer', fontWeight: 600 }}
              >
                로그인
              </Box>
              해주세요
            </Typography>
          </Paper>
        )}

        {comments.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
            아직 댓글이 없습니다
          </Typography>
        ) : (
          comments.map((comment: any, index: number) => (
            <Box key={comment.id}>
              <Box sx={{ display: 'flex', gap: 1.5, py: 2 }}>
                <Avatar src={comment.author.image} sx={{ width: 28, height: 28, mt: 0.3 }} />
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.3 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {comment.author.name || '익명'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(comment.createdAt).toLocaleDateString('ko-KR')}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                    {comment.content}
                  </Typography>
                </Box>
              </Box>
              {index < comments.length - 1 && <Divider />}
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};

export default PostDetailPage;
