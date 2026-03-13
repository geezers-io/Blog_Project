import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Favorite, FavoriteBorder, ChatBubbleOutline } from '@mui/icons-material';
import { Typography, Box, Button, TextField, CardMedia, Avatar, Chip, Divider, Paper } from '@mui/material';
import prisma from '@/lib/prisma';

export const getServerSideProps: GetServerSideProps = async context => {
  const { id } = context.params as { id: string };

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true, image: true, email: true } },
      category: true,
      comments: {
        include: { author: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: 'desc' },
      },
      _count: { select: { likes: true } },
    },
  });

  if (!post) {
    return { notFound: true };
  }

  return {
    props: { post: JSON.parse(JSON.stringify(post)) },
  };
};

const PostDetailPage = ({ post }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [comments, setComments] = useState(post.comments);
  const [commentText, setCommentText] = useState('');
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post._count.likes);

  const isAuthor = (session?.user as any)?.id === post.author.id;

  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    const res = await fetch(`/api/posts/${post.id}`, { method: 'DELETE' });
    if (res.ok) router.push('/');
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    const res = await fetch(`/api/posts/${post.id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: commentText }),
    });
    if (res.ok) {
      const comment = await res.json();
      setComments([comment, ...comments]);
      setCommentText('');
    }
  };

  const handleLike = async () => {
    const res = await fetch(`/api/posts/${post.id}/likes`, { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      setLiked(data.liked);
      setLikeCount(prev => (data.liked ? prev + 1 : prev - 1));
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
