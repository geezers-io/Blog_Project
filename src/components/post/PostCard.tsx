import Link from 'next/link';
import { FavoriteBorder, ChatBubbleOutline } from '@mui/icons-material';
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
  const readTime = Math.max(1, Math.ceil(content.length / 500));

  return (
    <Link href={`/posts/${id}`}>
      <Card
        sx={{
          cursor: 'pointer',
          overflow: 'hidden',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          '&:hover': {
            borderColor: '#e2e8f0',
            boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
          },
          '&:hover .card-title': {
            color: '#d97706',
          },
        }}
      >
        {image && <CardMedia component="img" height={180} image={image} alt={title} sx={{ objectFit: 'cover' }} />}
        <CardContent sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column' }}>
          {category && (
            <Typography
              sx={{
                display: 'inline-block',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#d97706',
                backgroundColor: '#fffbeb',
                px: 1,
                py: 0.25,
                borderRadius: '6px',
                mb: 1,
                width: 'fit-content',
              }}
            >
              {category.name}
            </Typography>
          )}
          <Typography
            className="card-title"
            sx={{
              fontWeight: 700,
              fontSize: '1.0625rem',
              lineHeight: 1.4,
              color: '#1e293b',
              mb: 0.75,
              transition: 'color 0.15s',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              fontSize: '0.8125rem',
              lineHeight: 1.6,
              color: '#64748b',
              mb: 2,
              flex: 1,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {content}
          </Typography>

          {/* Author + meta */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
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
              <Avatar src={author.image || ''} sx={{ width: 24, height: 24 }} />
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1e293b' }}>
                {author.name || '익명'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#94a3b8', fontSize: '0.75rem' }}>
              <span>{new Date(createdAt).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}</span>
              <span>·</span>
              <span>{readTime}분 읽기</span>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                <FavoriteBorder sx={{ fontSize: 14 }} />
                {_count.likes}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                <ChatBubbleOutline sx={{ fontSize: 14 }} />
                {_count.comments}
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Link>
  );
};

export default PostCard;
