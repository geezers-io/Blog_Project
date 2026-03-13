import Link from 'next/link';
import { FavoriteBorder } from '@mui/icons-material';
import { Card, CardContent, CardMedia, Typography, Box, Avatar } from '@mui/material';

interface PostCardProps {
  id: string;
  title: string;
  content: string;
  image: string | null;
  createdAt: string;
  author: { name: string | null; username: string | null; image: string | null };
  category: { name: string } | null;
  _count: { comments: number; likes: number };
}

const PostCard = ({ id, title, content, image, createdAt, author, category, _count }: PostCardProps) => {
  return (
    <Link href={`/posts/${id}`}>
      <Card
        sx={{
          cursor: 'pointer',
          overflow: 'hidden',
          backgroundColor: '#fff',
          borderRadius: '4px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
        }}
      >
        {image && <CardMedia component="img" height={167} image={image} alt={title} sx={{ objectFit: 'cover' }} />}
        <CardContent sx={{ p: 2.5 }}>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: '1rem',
              lineHeight: 1.5,
              mb: 0.5,
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              color: '#212529',
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              fontSize: '0.8125rem',
              lineHeight: 1.6,
              color: '#495057',
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {content}
          </Typography>
          {category && (
            <Typography
              sx={{
                display: 'inline-block',
                fontSize: '0.75rem',
                color: '#e65100',
                fontWeight: 600,
                mb: 1.5,
              }}
            >
              {category.name}
            </Typography>
          )}
          <Box sx={{ fontSize: '0.75rem', color: '#868e96' }}>
            {new Date(createdAt).toLocaleDateString('ko-KR')} · {_count.comments}개의 댓글
          </Box>
        </CardContent>
        {/* Bottom author bar */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2.5,
            py: 1.25,
            borderTop: '1px solid #f1f3f5',
          }}
        >
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}
            onClick={e => {
              const slug = author.username || author.name;
              if (slug) {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = `/blog/${encodeURIComponent(slug)}`;
              }
            }}
          >
            <Avatar src={author.image || ''} sx={{ width: 22, height: 22 }} />
            <Typography
              sx={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#212529',
                '&:hover': { color: '#e65100' },
              }}
            >
              by <strong>{author.name || '익명'}</strong>
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
              <FavoriteBorder sx={{ fontSize: 13, color: '#adb5bd' }} />
              <Typography sx={{ fontSize: '0.75rem', color: '#adb5bd' }}>{_count.likes}</Typography>
            </Box>
          </Box>
        </Box>
      </Card>
    </Link>
  );
};

export default PostCard;
