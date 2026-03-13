import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { useState, useCallback } from 'react';
import { SortRounded } from '@mui/icons-material';
import { Typography, Button, Chip, Box, Grid, ToggleButton, ToggleButtonGroup } from '@mui/material';
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

  const API_URL = process.env.API_URL || 'http://localhost:8080/api';

  const [postsRes, catsRes] = await Promise.all([
    fetch(`${API_URL}/posts?${params.toString()}`),
    fetch(`${API_URL}/categories`),
  ]);

  const postsData = await postsRes.json();
  const categories = await catsRes.json();

  return {
    props: {
      posts: postsData.posts || [],
      total: postsData.total || 0,
      currentPage: parseInt(page as string, 10),
      totalPages: postsData.totalPages || 1,
      categories,
      filters: {
        category: (category as string) || null,
        sort: (sort as string) || 'recent',
        search: (search as string) || '',
      },
    },
  };
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

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
    const res = await fetch(`${apiUrl}/posts?${params.toString()}`);
    const data = await res.json();

    setPosts(prev => [...prev, ...data.posts]);
    setPage(nextPage);
    setHasMore(nextPage < data.totalPages);
  }, [page, filters]);

  const navigate = (params: Record<string, string>) => {
    const query = new URLSearchParams(params);
    router.push(`/?${query.toString()}`);
  };

  const handleSort = (_: React.MouseEvent<HTMLElement>, value: string | null) => {
    if (!value) return;
    navigate({ sort: value, ...(filters.category ? { category: filters.category } : {}) });
  };

  const filterByCategory = (categoryName: string | null) => {
    if (categoryName) {
      navigate({ category: categoryName, sort: filters.sort });
    } else {
      navigate({ sort: filters.sort });
    }
  };

  return (
    <>
      {filters.search && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h3">
            &quot;{filters.search}&quot;{' '}
            <Typography component="span" variant="h3" color="text.secondary">
              검색 결과 {total}건
            </Typography>
          </Typography>
        </Box>
      )}

      <Box
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 1 }}
      >
        <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
          <Chip
            label="전체"
            variant={!filters.category ? 'filled' : 'outlined'}
            color={!filters.category ? 'primary' : 'default'}
            onClick={() => filterByCategory(null)}
            sx={{ cursor: 'pointer' }}
          />
          {categories.map((cat: Category) => (
            <Chip
              key={cat.id}
              label={cat.name}
              variant={filters.category === cat.name ? 'filled' : 'outlined'}
              color={filters.category === cat.name ? 'primary' : 'default'}
              onClick={() => filterByCategory(cat.name)}
              sx={{ cursor: 'pointer' }}
            />
          ))}
        </Box>

        <ToggleButtonGroup value={filters.sort} exclusive onChange={handleSort} size="small">
          <ToggleButton value="recent" sx={{ px: 2, fontSize: 13 }}>
            <SortRounded sx={{ fontSize: 16, mr: 0.5 }} />
            최신순
          </ToggleButton>
          <ToggleButton value="oldest" sx={{ px: 2, fontSize: 13 }}>
            오래된순
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <InfiniteScroll
        load={loadMore}
        hasMore={hasMore}
        endMessage={
          posts.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h4" color="text.secondary" sx={{ mb: 1 }}>
                아직 게시물이 없습니다
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                첫 번째 글을 작성해보세요!
              </Typography>
              <Button variant="contained" onClick={() => router.push('/write')}>
                글쓰기
              </Button>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              모든 게시물을 불러왔습니다
            </Typography>
          )
        }
      >
        <Grid container spacing={2.5}>
          {posts.map((post: Post) => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <PostCard {...post} />
            </Grid>
          ))}
        </Grid>
      </InfiniteScroll>
    </>
  );
};

export default HomePage;
