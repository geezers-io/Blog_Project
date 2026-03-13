import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { useState, useCallback } from 'react';
import { TrendingUp, AccessTime } from '@mui/icons-material';
import { Typography, Button, Box, Grid } from '@mui/material';
import PostCard from '@/components/post/PostCard';
import InfiniteScroll from '@/components/shared/InfiniteScroll';

interface Post {
  id: string;
  title: string;
  content: string;
  image: string | null;
  createdAt: string;
  author: { id: string; name: string | null; username: string | null; image: string | null };
  category: { id: string; name: string } | null;
  _count: { comments: number; likes: number };
}

export const getServerSideProps: GetServerSideProps = async context => {
  const { category, sort, search, page = '1' } = context.query;
  const params = new URLSearchParams();
  if (category && typeof category === 'string') params.set('category', category);
  if (sort && typeof sort === 'string') params.set('sort', sort);
  if (search && typeof search === 'string') params.set('search', search);
  params.set('page', page as string);
  params.set('limit', '12');

  const API_URL = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api`;

  try {
    const fetchOpts = { signal: AbortSignal.timeout(5000) };
    const [postsRes, catsRes] = await Promise.all([
      fetch(`${API_URL}/posts?${params.toString()}`, fetchOpts),
      fetch(`${API_URL}/categories`, fetchOpts),
    ]);

    const postsData = await postsRes.json();
    const categories = await catsRes.json();

    return {
      props: {
        posts: postsData.posts || [],
        total: postsData.total || 0,
        currentPage: parseInt(page as string, 10),
        totalPages: postsData.totalPages || 1,
        categories: Array.isArray(categories) ? categories : [],
        filters: {
          category: (category as string) || null,
          sort: (sort as string) || 'recent',
          search: (search as string) || '',
        },
      },
    };
  } catch {
    return {
      props: {
        posts: [],
        total: 0,
        currentPage: 1,
        totalPages: 1,
        categories: [],
        filters: {
          category: (category as string) || null,
          sort: (sort as string) || 'recent',
          search: (search as string) || '',
        },
      },
    };
  }
};

const HomePage = ({
  posts: initialPosts,
  total,
  currentPage,
  totalPages,
  filters,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [page, setPage] = useState(currentPage);
  const [hasMore, setHasMore] = useState(currentPage < totalPages);

  const loadMore = useCallback(async () => {
    const nextPage = page + 1;
    const params = new URLSearchParams();
    params.set('page', nextPage.toString());
    if (filters.category) params.set('category', filters.category);
    if (filters.sort) params.set('sort', filters.sort);
    if (filters.search) params.set('search', filters.search);

    const res = await fetch(`/api/posts?${params.toString()}`);
    const data = await res.json();

    setPosts(prev => [...prev, ...data.posts]);
    setPage(nextPage);
    setHasMore(nextPage < data.totalPages);
  }, [page, filters]);

  const navigate = (params: Record<string, string>) => {
    const query = new URLSearchParams(params);
    router.push(`/?${query.toString()}`);
  };

  return (
    <>
      {/* Search results header */}
      {filters.search && (
        <Box sx={{ mb: 4, pt: 2 }}>
          <Typography sx={{ fontSize: '1.125rem', color: '#868e96' }}>
            총 <strong style={{ color: '#212529' }}>{total}개</strong>의 포스트를 찾았습니다.
          </Typography>
        </Box>
      )}

      {/* Tab navigation - velog style */}
      {!filters.search && (
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            mb: 4,
            pt: 1,
            borderBottom: '2px solid #f1f3f5',
          }}
        >
          <TabItem
            icon={<TrendingUp sx={{ fontSize: 18 }} />}
            label="트렌딩"
            active={filters.sort !== 'oldest'}
            onClick={() => navigate({ sort: 'recent' })}
          />
          <TabItem
            icon={<AccessTime sx={{ fontSize: 18 }} />}
            label="최신"
            active={filters.sort === 'oldest'}
            onClick={() => navigate({ sort: 'oldest' })}
          />
        </Box>
      )}

      <InfiniteScroll
        load={loadMore}
        hasMore={hasMore}
        endMessage={
          posts.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 10 }}>
              <Typography sx={{ fontSize: '3rem', mb: 2 }}>&#x1F4DD;</Typography>
              <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#212529', mb: 1 }}>
                아직 게시물이 없습니다
              </Typography>
              <Typography sx={{ fontSize: '0.9375rem', color: '#868e96', mb: 3 }}>
                첫 번째 글을 작성해보세요!
              </Typography>
              <Button variant="contained" onClick={() => router.push('/write')} sx={{ borderRadius: '20px', px: 3 }}>
                새 글 작성
              </Button>
            </Box>
          ) : (
            <Typography sx={{ textAlign: 'center', py: 5, color: '#adb5bd', fontSize: '0.875rem' }}>
              모든 포스트를 불러왔습니다
            </Typography>
          )
        }
      >
        <Grid container spacing={2}>
          {posts.map((post: Post) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={post.id}>
              <PostCard {...post} />
            </Grid>
          ))}
        </Grid>
      </InfiniteScroll>
    </>
  );
};

const TabItem = ({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <Box
    onClick={onClick}
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 0.75,
      pb: 1.5,
      px: 0.5,
      cursor: 'pointer',
      fontWeight: 700,
      fontSize: '0.9375rem',
      color: active ? '#212529' : '#868e96',
      borderBottom: active ? '2px solid #212529' : '2px solid transparent',
      mb: '-2px',
      transition: 'color 0.15s',
      '&:hover': { color: '#212529' },
    }}
  >
    {icon}
    {label}
  </Box>
);

export default HomePage;
