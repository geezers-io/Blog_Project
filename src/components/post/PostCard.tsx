import Link from 'next/link';
import { ChatBubbleOutline, FavoriteBorder } from '@mui/icons-material';
import { Card, CardContent, CardMedia, Typography, Box, Chip, Avatar } from '@mui/material';

interface PostCardProps {
  id: string;
  title: string;
  content: string;
  image: string | null;
  createdAt: string;
  author: { name: string | null; image: string | null };
  category: { name: string } | null;
  _count: { comments: number; likes: number };
}

const PostCard = ({ id, title, content, image, createdAt, author, category, _count }: PostCardProps) => {
  return (
    <Link href={`/posts/${id}`}>
      <Card sx={{ cursor: 'pointer', overflow: 'hidden' }}>
        {image && <CardMedia component="img" height={200} image={image} alt={title} sx={{ objectFit: 'cover' }} />}
        <CardContent sx={{ p: 2.5 }}>
          {category && (
            <Chip
              label={category.name}
              size="small"
              sx={{
                mb: 1,
                backgroundColor: 'rgba(255,160,0,0.1)',
                color: '#e65100',
                fontWeight: 500,
                fontSize: 12,
              }}
            />
          )}
          <Typography variant="h5" sx={{ mb: 0.5 }}>
            {title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {content}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar src={author.image || ''} sx={{ width: 24, height: 24 }} />
              <Typography variant="caption" sx={{ fontWeight: 500 }}>
                {author.name || '익명'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(createdAt).toLocaleDateString('ko-KR')}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                <FavoriteBorder sx={{ fontSize: 14, color: '#999' }} />
                <Typography variant="caption" color="text.secondary">
                  {_count.likes}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                <ChatBubbleOutline sx={{ fontSize: 14, color: '#999' }} />
                <Typography variant="caption" color="text.secondary">
                  {_count.comments}
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Link>
  );
};

export default PostCard;
