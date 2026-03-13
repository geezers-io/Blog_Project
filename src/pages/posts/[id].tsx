import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import {
  Typography,
  Box,
  Button,
  TextField,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  Chip,
  IconButton,
  Divider,
} from '@mui/material';
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
    props: {
      post: JSON.parse(JSON.stringify(post)),
    },
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
    if (res.ok) {
      router.push('/');
    }
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
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      {post.category && <Chip label={post.category.name} sx={{ mb: 2 }} />}

      <Typography variant="h4" gutterBottom>
        {post.title}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Avatar src={post.author.image} alt={post.author.name} />
        <Box>
          <Typography variant="subtitle1">{post.author.name || '익명'}</Typography>
          <Typography variant="caption" color="textSecondary">
            {new Date(post.createdAt).toLocaleDateString('ko-KR')}
          </Typography>
        </Box>
        {isAuthor && (
          <Box sx={{ ml: 'auto' }}>
            <Button size="small" onClick={() => router.push(`/uploadpost?edit=${post.id}`)}>
              수정
            </Button>
            <Button size="small" color="error" onClick={handleDelete}>
              삭제
            </Button>
          </Box>
        )}
      </Box>

      {post.image && (
        <CardMedia
          component="img"
          image={post.image}
          alt={post.title}
          sx={{ borderRadius: 2, mb: 3, maxHeight: 500, objectFit: 'cover' }}
        />
      )}

      <Typography variant="body1" sx={{ mb: 4, whiteSpace: 'pre-wrap' }}>
        {post.content}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
        <IconButton onClick={handleLike} color={liked ? 'error' : 'default'}>
          {liked ? <Favorite /> : <FavoriteBorder />}
        </IconButton>
        <Typography>{likeCount}</Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Typography variant="h6" gutterBottom>
        댓글 ({comments.length})
      </Typography>

      {session && (
        <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="댓글을 작성해주세요..."
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleComment()}
          />
          <Button variant="contained" onClick={handleComment}>
            작성
          </Button>
        </Box>
      )}

      {comments.map((comment: any) => (
        <Card key={comment.id} sx={{ mb: 1 }}>
          <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Avatar src={comment.author.image} sx={{ width: 24, height: 24 }} />
              <Typography variant="subtitle2">{comment.author.name || '익명'}</Typography>
              <Typography variant="caption" color="textSecondary">
                {new Date(comment.createdAt).toLocaleDateString('ko-KR')}
              </Typography>
            </Box>
            <Typography variant="body2">{comment.content}</Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default PostDetailPage;
