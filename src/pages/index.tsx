import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { useState, useCallback } from 'react';
import { AccessTime, LocalFireDepartment } from '@mui/icons-material';
import { Typography, Button, Chip, Box, Grid } from '@mui/material';
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

interface Category {
  id: string;
  name: string;
  _count: { posts: number };
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
  categories,
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

  const filterByCategory = (categoryName: string | null) => {
    if (categoryName) {
      navigate({ category: categoryName, sort: filters.sort });
    } else {
      navigate({ sort: filters.sort });
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 5, maxWidth: 1200, mx: 'auto' }}>
      {/* Main Feed */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {/* Search results */}
        {filters.search && (
          <Box sx={{ mb: 3, pt: 1 }}>
            <Typography sx={{ fontSize: '0.9375rem', color: '#64748b' }}>
              <strong style={{ color: '#1e293b' }}>&quot;{filters.search}&quot;</strong> 검색 결과 {total}건
            </Typography>
          </Box>
        )}

        {/* Feed tabs */}
        {!filters.search && (
          <Box sx={{ display: 'flex', gap: 0.5, mb: 3, pt: 1 }}>
            <FeedTab
              icon={<LocalFireDepartment sx={{ fontSize: 16 }} />}
              label="추천"
              active={filters.sort === 'recent' || !filters.sort}
              onClick={() => navigate({ sort: 'recent' })}
            />
            <FeedTab
              icon={<AccessTime sx={{ fontSize: 16 }} />}
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
                <Box sx={{ fontSize: '3.5rem', mb: 2 }}>&#x270D;&#xFE0F;</Box>
                <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#1e293b', mb: 1 }}>
                  아직 게시물이 없습니다
                </Typography>
                <Typography sx={{ color: '#64748b', mb: 3, fontSize: '0.9375rem' }}>
                  첫 번째 글을 작성해보세요!
                </Typography>
                <Button variant="contained" onClick={() => router.push('/write')} sx={{ px: 3 }}>
                  글쓰기
                </Button>
              </Box>
            ) : (
              <Typography sx={{ textAlign: 'center', py: 5, color: '#94a3b8', fontSize: '0.875rem' }}>
                모든 포스트를 불러왔습니다
              </Typography>
            )
          }
        >
          <Grid container spacing={2.5}>
            {posts.map((post: Post) => (
              <Grid item xs={12} sm={6} key={post.id}>
                <PostCard {...post} />
              </Grid>
            ))}
          </Grid>
        </InfiniteScroll>
      </Box>

      {/* Sidebar */}
      <Box
        sx={{
          width: 280,
          flexShrink: 0,
          display: { xs: 'none', md: 'block' },
          pt: 1,
        }}
      >
        {/* Categories */}
        <Box
          sx={{
            p: 2.5,
            borderRadius: '12px',
            border: '1px solid #f1f5f9',
            mb: 2.5,
          }}
        >
          <Typography
            sx={{ fontWeight: 700, fontSize: '0.8125rem', color: '#1e293b', mb: 1.5, letterSpacing: '0.05em' }}
          >
            카테고리
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
            <Chip
              label="전체"
              size="small"
              onClick={() => filterByCategory(null)}
              sx={{
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.75rem',
                backgroundColor: !filters.category ? '#f59e0b' : '#f8fafc',
                color: !filters.category ? '#fff' : '#64748b',
                border: !filters.category ? 'none' : '1px solid #e2e8f0',
                '&:hover': { opacity: 0.85 },
              }}
            />
            {categories.map((cat: Category) => (
              <Chip
                key={cat.id}
                label={`${cat.name}`}
                size="small"
                onClick={() => filterByCategory(cat.name)}
                sx={{
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  backgroundColor: filters.category === cat.name ? '#f59e0b' : '#f8fafc',
                  color: filters.category === cat.name ? '#fff' : '#64748b',
                  border: filters.category === cat.name ? 'none' : '1px solid #e2e8f0',
                  '&:hover': { opacity: 0.85 },
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Trending tags placeholder */}
        <Box
          sx={{
            p: 2.5,
            borderRadius: '12px',
            border: '1px solid #f1f5f9',
          }}
        >
          <Typography
            sx={{ fontWeight: 700, fontSize: '0.8125rem', color: '#1e293b', mb: 1.5, letterSpacing: '0.05em' }}
          >
            인기 태그
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
            {['기술', '일상', '개발', 'React', 'Next.js'].map(tag => (
              <Chip
                key={tag}
                label={`#${tag}`}
                size="small"
                sx={{
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  backgroundColor: '#f8fafc',
                  color: '#64748b',
                  border: '1px solid #e2e8f0',
                  '&:hover': { borderColor: '#f59e0b', color: '#d97706' },
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const FeedTab = ({
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
      gap: 0.5,
      px: 2,
      py: 0.75,
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 600,
      fontSize: '0.8125rem',
      color: active ? '#d97706' : '#64748b',
      backgroundColor: active ? '#fffbeb' : 'transparent',
      transition: 'all 0.15s',
      '&:hover': {
        backgroundColor: active ? '#fffbeb' : '#f8fafc',
      },
    }}
  >
    {icon}
    {label}
  </Box>
);

export default HomePage;
