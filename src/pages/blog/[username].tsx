import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { FavoriteBorder, ChatBubbleOutline, Settings as SettingsIcon } from '@mui/icons-material';
import { Typography, Box, Avatar, Chip, Divider, IconButton } from '@mui/material';
import MiniPlayer from '@/components/blog/MiniPlayer';
import VisitorCounter from '@/components/blog/VisitorCounter';

export const getServerSideProps: GetServerSideProps = async context => {
  const { username } = context.params as { username: string };
  const API_URL = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api`;

  try {
    const res = await fetch(`${API_URL}/blog/${encodeURIComponent(username)}`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return { notFound: true };

    const data = await res.json();
    return {
      props: {
        blogUser: data.user,
        posts: data.posts || [],
        tags: data.tags || [],
      },
    };
  } catch {
    return { notFound: true };
  }
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
    <Box sx={{ maxWidth: 768, mx: 'auto' }}>
      {/* === Cyworld-inspired Profile Section === */}
      <Box
        sx={{
          position: 'relative',
          borderRadius: '16px',
          overflow: 'hidden',
          mb: 5,
        }}
      >
        {/* Banner gradient */}
        <Box
          sx={{
            height: 120,
            background: `linear-gradient(135deg, ${color}, ${color}cc, ${color}88)`,
            position: 'relative',
          }}
        >
          {/* Decorative circles (Cyworld feel) */}
          <Box
            sx={{
              position: 'absolute',
              top: -20,
              right: 40,
              width: 100,
              height: 100,
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.1)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: -10,
              right: 120,
              width: 60,
              height: 60,
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.08)',
            }}
          />
        </Box>

        {/* Profile info */}
        <Box
          sx={{
            backgroundColor: '#fff',
            px: 4,
            pb: 3,
            pt: 0,
            position: 'relative',
          }}
        >
          {/* Avatar overlapping banner */}
          <Avatar
            src={blogUser.image}
            alt={blogUser.name}
            sx={{
              width: 96,
              height: 96,
              border: '4px solid #fff',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              position: 'relative',
              top: -48,
              mb: -5,
            }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: '1.5rem', color: '#212529' }}>
                {blogUser.blogTitle || `${blogUser.name || '무제'}의 블로그`}
              </Typography>
              <Typography sx={{ fontSize: '0.875rem', color: '#868e96', mt: 0.25 }}>
                @{blogUser.username || blogUser.name}
              </Typography>
              {blogUser.bio && (
                <Typography sx={{ fontSize: '0.9375rem', color: '#495057', mt: 1.5, lineHeight: 1.7 }}>
                  {blogUser.bio}
                </Typography>
              )}
            </Box>
            {isOwner && (
              <Link href="/settings">
                <IconButton sx={{ color: '#adb5bd' }}>
                  <SettingsIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </Link>
            )}
          </Box>

          {/* Cyworld-style widgets */}
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <VisitorCounter today={blogUser.todayVisits} total={blogUser.totalVisits} themeColor={color} />
            {blogUser.bgmUrl && <MiniPlayer bgmUrl={blogUser.bgmUrl} themeColor={color} />}
          </Box>
        </Box>
      </Box>

      {/* === Separator === */}
      <Divider sx={{ mb: 4 }} />

      {/* === Tags (velog style) === */}
      {tags.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, color: '#212529', mb: 1.5 }}>태그</Typography>
          <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
            <Chip
              label={`전체 (${posts.length})`}
              size="small"
              onClick={() => setSelectedTag(null)}
              sx={{
                cursor: 'pointer',
                fontWeight: 600,
                backgroundColor: !selectedTag ? color : 'transparent',
                color: !selectedTag ? '#fff' : '#495057',
                border: !selectedTag ? 'none' : '1px solid #dee2e6',
                '&:hover': { opacity: 0.85 },
              }}
            />
            {tags.map((tag: string) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                onClick={() => setSelectedTag(tag)}
                sx={{
                  cursor: 'pointer',
                  fontWeight: 600,
                  backgroundColor: selectedTag === tag ? color : 'transparent',
                  color: selectedTag === tag ? '#fff' : '#495057',
                  border: selectedTag === tag ? 'none' : '1px solid #dee2e6',
                  '&:hover': { opacity: 0.85 },
                }}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* === Post list (velog style) === */}
      <Box sx={{ mb: 2 }}>
        <Typography sx={{ fontSize: '0.8125rem', color: '#868e96' }}>
          총 <strong style={{ color: '#212529' }}>{filteredPosts.length}</strong>개의 포스트
        </Typography>
      </Box>

      {filteredPosts.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography sx={{ color: '#adb5bd', fontSize: '1rem' }}>아직 작성한 글이 없습니다</Typography>
        </Box>
      ) : (
        filteredPosts.map((post: any, index: number) => (
          <Box key={post.id}>
            <Link href={`/posts/${post.id}`}>
              <Box
                sx={{
                  py: 3,
                  cursor: 'pointer',
                  '&:hover h3': { color },
                  transition: 'all 0.15s',
                }}
              >
                <Box sx={{ display: 'flex', gap: 3 }}>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      component="h3"
                      sx={{
                        fontWeight: 700,
                        fontSize: '1.125rem',
                        color: '#212529',
                        mb: 0.75,
                        transition: 'color 0.15s',
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {post.title}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '0.875rem',
                        color: '#495057',
                        lineHeight: 1.6,
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
                      <Box sx={{ display: 'flex', gap: 0.5, mb: 1.5, flexWrap: 'wrap' }}>
                        {post.tags.split(',').map((tag: string) => (
                          <Typography
                            key={tag}
                            sx={{
                              fontSize: '0.75rem',
                              color,
                              fontWeight: 600,
                              backgroundColor: `${color}12`,
                              px: 1,
                              py: 0.25,
                              borderRadius: '4px',
                            }}
                          >
                            {tag.trim()}
                          </Typography>
                        ))}
                      </Box>
                    )}
                    <Box
                      sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontSize: '0.75rem', color: '#adb5bd' }}
                    >
                      <span>{new Date(post.createdAt).toLocaleDateString('ko-KR')}</span>
                      <span>·</span>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                        <FavoriteBorder sx={{ fontSize: 13 }} />
                        {post._count.likes}
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                        <ChatBubbleOutline sx={{ fontSize: 13 }} />
                        {post._count.comments}
                      </Box>
                    </Box>
                  </Box>
                  {post.image && (
                    <Box
                      sx={{
                        width: 150,
                        height: 100,
                        borderRadius: '8px',
                        overflow: 'hidden',
                        flexShrink: 0,
                        display: { xs: 'none', sm: 'block' },
                      }}
                    >
                      <img src={post.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Box>
                  )}
                </Box>
              </Box>
            </Link>
            {index < filteredPosts.length - 1 && <Divider />}
          </Box>
        ))
      )}
    </Box>
  );
};

export default BlogPage;
