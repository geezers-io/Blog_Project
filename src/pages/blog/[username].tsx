import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { FavoriteBorder, ChatBubbleOutline } from '@mui/icons-material';
import { Typography, Box, Avatar, Chip, Card, CardContent, CardMedia, Divider } from '@mui/material';
import MiniPlayer from '@/components/blog/MiniPlayer';
import VisitorCounter from '@/components/blog/VisitorCounter';

export const getServerSideProps: GetServerSideProps = async context => {
  const { username } = context.params as { username: string };
  const API_URL = process.env.API_URL || 'http://localhost:8080/api';

  const res = await fetch(`${API_URL}/blog/${encodeURIComponent(username)}`);
  if (!res.ok) return { notFound: true };

  const data = await res.json();
  return {
    props: {
      blogUser: data.user,
      posts: data.posts,
      tags: data.tags,
    },
  };
};

const BlogPage = ({ blogUser, posts, tags }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: session } = useSession();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const color = blogUser.themeColor || '#ffa000';
  const isOwner = (session?.user as any)?.id === blogUser.id;

  const filteredPosts = selectedTag
    ? posts.filter(
        (p: any) =>
          p.tags &&
          p.tags
            .split(',')
            .map((t: string) => t.trim())
            .includes(selectedTag),
      )
    : posts;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Blog Header */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${color}15, ${color}08)`,
          borderRadius: 3,
          p: 4,
          mb: 4,
          border: `1px solid ${color}20`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -30,
            right: -30,
            width: 120,
            height: 120,
            borderRadius: '50%',
            backgroundColor: `${color}10`,
          }}
        />

        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, position: 'relative' }}>
          <Avatar
            src={blogUser.image}
            alt={blogUser.name}
            sx={{
              width: 80,
              height: 80,
              border: `3px solid ${color}`,
              boxShadow: `0 4px 12px ${color}30`,
            }}
          />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h2" sx={{ color }}>
              {blogUser.blogTitle || `${blogUser.name || '무제'}의 블로그`}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 500 }}>
              @{blogUser.username || blogUser.name}
            </Typography>
            {blogUser.bio && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {blogUser.bio}
              </Typography>
            )}
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <VisitorCounter today={blogUser.todayVisits} total={blogUser.totalVisits} themeColor={color} />
              {blogUser.bgmUrl && <MiniPlayer bgmUrl={blogUser.bgmUrl} themeColor={color} />}
            </Box>
          </Box>
        </Box>

        {isOwner && (
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Link href="/settings" style={{ textDecoration: 'none' }}>
              <Typography
                variant="caption"
                sx={{ color, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
              >
                블로그 설정
              </Typography>
            </Link>
          </Box>
        )}
      </Box>

      {/* Tags */}
      {tags.length > 0 && (
        <Box sx={{ mb: 3, display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
          <Chip
            label="전체"
            size="small"
            variant={!selectedTag ? 'filled' : 'outlined'}
            onClick={() => setSelectedTag(null)}
            sx={{
              cursor: 'pointer',
              ...(!selectedTag && { backgroundColor: color, color: '#fff' }),
            }}
          />
          {tags.map((tag: string) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              variant={selectedTag === tag ? 'filled' : 'outlined'}
              onClick={() => setSelectedTag(tag)}
              sx={{
                cursor: 'pointer',
                ...(selectedTag === tag && { backgroundColor: color, color: '#fff' }),
              }}
            />
          ))}
        </Box>
      )}

      {/* Stats */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" color="text.secondary">
          총 <strong>{filteredPosts.length}</strong>개의 포스트
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Posts */}
      {filteredPosts.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h4" color="text.secondary">
            아직 작성한 글이 없습니다
          </Typography>
        </Box>
      ) : (
        filteredPosts.map((post: any) => (
          <Link key={post.id} href={`/posts/${post.id}`}>
            <Card
              sx={{
                mb: 2.5,
                cursor: 'pointer',
                display: 'flex',
                overflow: 'hidden',
                '&:hover': {
                  borderColor: `${color}40`,
                },
              }}
            >
              <CardContent sx={{ flex: 1, p: 2.5 }}>
                {post.category && (
                  <Chip
                    label={post.category.name}
                    size="small"
                    sx={{ mb: 1, backgroundColor: `${color}15`, color, fontWeight: 500, fontSize: 11 }}
                  />
                )}
                <Typography variant="h5" sx={{ mb: 0.5 }}>
                  {post.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 1.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {post.content}
                </Typography>
                {post.tags && (
                  <Box sx={{ display: 'flex', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>
                    {post.tags.split(',').map((tag: string) => (
                      <Typography key={tag} variant="caption" sx={{ color }}>
                        #{tag.trim()}
                      </Typography>
                    ))}
                  </Box>
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                    <FavoriteBorder sx={{ fontSize: 13, color: '#999' }} />
                    <Typography variant="caption" color="text.secondary">
                      {post._count.likes}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                    <ChatBubbleOutline sx={{ fontSize: 13, color: '#999' }} />
                    <Typography variant="caption" color="text.secondary">
                      {post._count.comments}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
              {post.image && (
                <CardMedia
                  component="img"
                  image={post.image}
                  sx={{ width: 160, objectFit: 'cover', display: { xs: 'none', sm: 'block' } }}
                />
              )}
            </Card>
          </Link>
        ))
      )}
    </Box>
  );
};

export default BlogPage;
