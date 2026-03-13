import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { Typography, Box, Button, TextField, CardMedia, Avatar, Divider } from '@mui/material';
import { api } from '@/lib/api';

export const getServerSideProps: GetServerSideProps = async context => {
  const { id } = context.params as { id: string };
  const API_URL = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api`;

  try {
    const res = await fetch(`${API_URL}/posts/${id}`, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return { notFound: true };

    const post = await res.json();
    return { props: { post } };
  } catch {
    return { notFound: true };
  }
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
    <Box sx={{ maxWidth: 768, mx: 'auto' }}>
      {/* Title */}
      <Typography
        sx={{
          fontWeight: 800,
          fontSize: { xs: '2rem', md: '2.75rem' },
          lineHeight: 1.2,
          letterSpacing: '-0.02em',
          color: '#212529',
          mb: 3,
          mt: 2,
        }}
      >
        {post.title}
      </Typography>

      {/* Meta info */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Link href={`/blog/${encodeURIComponent(post.author.username || post.author.name || '')}`}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '0.9375rem',
                color: '#212529',
                cursor: 'pointer',
                '&:hover': { color: '#d97706' },
              }}
            >
              {post.author.name || '익명'}
            </Typography>
          </Link>
          <Typography sx={{ color: '#adb5bd' }}>·</Typography>
          <Typography sx={{ fontSize: '0.9375rem', color: '#868e96' }}>
            {new Date(post.createdAt).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Typography>
        </Box>
        {isAuthor && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              sx={{ color: '#868e96', fontSize: '0.8125rem' }}
              onClick={() => router.push(`/write?edit=${post.id}`)}
            >
              수정
            </Button>
            <Button size="small" sx={{ color: '#868e96', fontSize: '0.8125rem' }} onClick={handleDelete}>
              삭제
            </Button>
          </Box>
        )}
      </Box>

      {/* Tags */}
      {post.tags && (
        <Box sx={{ display: 'flex', gap: 0.75, mb: 4, flexWrap: 'wrap' }}>
          {post.tags.split(',').map((tag: string) => (
            <Box
              key={tag}
              sx={{
                px: 1.5,
                py: 0.5,
                backgroundColor: '#f8f9fa',
                borderRadius: '12px',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#d97706',
              }}
            >
              {tag.trim()}
            </Box>
          ))}
        </Box>
      )}

      <Divider sx={{ mb: 4, borderColor: '#f1f3f5' }} />

      {/* Cover image */}
      {post.image && (
        <CardMedia
          component="img"
          image={post.image}
          alt={post.title}
          sx={{ borderRadius: '8px', mb: 4, maxHeight: 480, objectFit: 'cover' }}
        />
      )}

      {/* Content */}
      <Typography
        sx={{
          fontSize: '1.125rem',
          lineHeight: 1.9,
          color: '#212529',
          mb: 6,
          whiteSpace: 'pre-wrap',
          wordBreak: 'keep-all',
        }}
      >
        {post.content}
      </Typography>

      {/* Author card */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2.5,
          p: 3,
          mb: 4,
          borderRadius: '12px',
          backgroundColor: '#f8f9fa',
        }}
      >
        <Link href={`/blog/${encodeURIComponent(post.author.username || post.author.name || '')}`}>
          <Avatar src={post.author.image} sx={{ width: 64, height: 64, cursor: 'pointer' }} />
        </Link>
        <Box>
          <Link href={`/blog/${encodeURIComponent(post.author.username || post.author.name || '')}`}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '1.125rem',
                color: '#212529',
                cursor: 'pointer',
                '&:hover': { color: '#d97706' },
              }}
            >
              {post.author.name || '익명'}
            </Typography>
          </Link>
          <Typography sx={{ fontSize: '0.875rem', color: '#868e96', mt: 0.25 }}>
            {post.author.bio || '소개가 없습니다.'}
          </Typography>
        </Box>
      </Box>

      {/* Like button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 5 }}>
        <Box
          onClick={handleLike}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 3,
            py: 1.5,
            borderRadius: '20px',
            border: liked ? '1px solid #f59e0b' : '1px solid #dee2e6',
            backgroundColor: liked ? 'rgba(255,160,0,0.06)' : '#fff',
            cursor: 'pointer',
            transition: 'all 0.15s',
            '&:hover': { borderColor: '#f59e0b', backgroundColor: 'rgba(255,160,0,0.04)' },
          }}
        >
          {liked ? (
            <Favorite sx={{ fontSize: 22, color: '#d97706' }} />
          ) : (
            <FavoriteBorder sx={{ fontSize: 22, color: '#adb5bd' }} />
          )}
          <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: liked ? '#f59e0b' : '#868e96' }}>
            {likeCount}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 4, borderColor: '#f1f3f5' }} />

      {/* Comments */}
      <Box sx={{ mb: 4 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '1.125rem', color: '#212529', mb: 3 }}>
          {comments.length}개의 댓글
        </Typography>

        {session ? (
          <Box sx={{ mb: 4 }}>
            <TextField
              fullWidth
              multiline
              minRows={3}
              placeholder="댓글을 작성하세요"
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              sx={{
                mb: 1.5,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#fff',
                  borderRadius: '8px',
                },
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                onClick={handleComment}
                disabled={!commentText.trim()}
                sx={{ borderRadius: '20px', px: 3 }}
              >
                댓글 작성
              </Button>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              p: 3,
              mb: 4,
              textAlign: 'center',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
            }}
          >
            <Typography sx={{ fontSize: '0.9375rem', color: '#868e96' }}>
              댓글을 작성하려면{' '}
              <Box
                component="span"
                onClick={() => router.push('/login')}
                sx={{ color: '#d97706', cursor: 'pointer', fontWeight: 700 }}
              >
                로그인
              </Box>
              해주세요
            </Typography>
          </Box>
        )}

        {comments.length === 0 ? (
          <Typography sx={{ textAlign: 'center', py: 3, color: '#adb5bd', fontSize: '0.875rem' }}>
            아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
          </Typography>
        ) : (
          comments.map((comment: any, index: number) => (
            <Box key={comment.id}>
              <Box sx={{ py: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Avatar src={comment.author.image} sx={{ width: 32, height: 32 }} />
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', color: '#212529' }}>
                      {comment.author.name || '익명'}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#adb5bd' }}>
                      {new Date(comment.createdAt).toLocaleDateString('ko-KR')}
                    </Typography>
                  </Box>
                </Box>
                <Typography sx={{ fontSize: '0.9375rem', lineHeight: 1.7, color: '#212529', pl: 5.5 }}>
                  {comment.content}
                </Typography>
              </Box>
              {index < comments.length - 1 && <Divider sx={{ borderColor: '#f1f3f5' }} />}
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};

export default PostDetailPage;
