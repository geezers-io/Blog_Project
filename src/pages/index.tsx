import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useCallback } from 'react';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import {
  Typography,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Box,
} from '@mui/material';
import InfiniteScroll from '@/components/shared/InfiniteScroll';
import prisma from '@/lib/prisma';

interface Post {
  id: string;
  title: string;
  content: string;
  image: string | null;
  createdAt: string;
  author: { id: string; name: string | null; image: string | null };
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
  const pageNum = parseInt(page as string, 10);
  const limit = 10;

  const where: any = { published: true };
  if (category && typeof category === 'string') {
    where.category = { name: category };
  }
  if (search && typeof search === 'string') {
    where.OR = [{ title: { contains: search } }, { content: { contains: search } }];
  }

  const orderBy: any = {};
  if (sort === 'oldest') {
    orderBy.createdAt = 'asc';
  } else {
    orderBy.createdAt = 'desc';
  }

  const [posts, total, categories] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy,
      skip: (pageNum - 1) * limit,
      take: limit,
      include: {
        author: { select: { id: true, name: true, image: true } },
        category: true,
        _count: { select: { comments: true, likes: true } },
      },
    }),
    prisma.post.count({ where }),
    prisma.category.findMany({
      include: { _count: { select: { posts: true } } },
      orderBy: { name: 'asc' },
    }),
  ]);

  return {
    props: {
      posts: JSON.parse(JSON.stringify(posts)),
      total,
      currentPage: pageNum,
      totalPages: Math.ceil(total / limit),
      categories: JSON.parse(JSON.stringify(categories)),
      filters: {
        category: (category as string) || null,
        sort: (sort as string) || 'recent',
        search: (search as string) || '',
      },
    },
  };
};

const IndexPage = ({
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
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

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

  const sortPosts = (sortType: string) => {
    navigate({ sort: sortType, ...(filters.category ? { category: filters.category } : {}) });
  };

  const filterByCategory = (categoryName: string | null) => {
    if (categoryName) {
      navigate({ category: categoryName, sort: filters.sort });
    } else {
      navigate({ sort: filters.sort });
    }
  };

  return (
    <main>
      <div style={{ padding: '2rem 1rem' }}>
        <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip label="전체" color={!filters.category ? 'primary' : 'default'} onClick={() => filterByCategory(null)} />
          {categories.map((cat: Category) => (
            <Chip
              key={cat.id}
              label={`${cat.name} (${cat._count.posts})`}
              color={filters.category === cat.name ? 'primary' : 'default'}
              onClick={() => filterByCategory(cat.name)}
            />
          ))}
        </Box>

        <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1bh-content" id="panel1bh-header">
            <Typography>정렬</Typography>
          </AccordionSummary>
          <AccordionDetails style={{ flexDirection: 'column', alignItems: 'center' }}>
            <Button
              variant={filters.sort === 'recent' ? 'contained' : 'outlined'}
              color="primary"
              onClick={() => sortPosts('recent')}
              style={{ marginBottom: '1rem', marginRight: '0.5rem' }}
            >
              최신순
            </Button>
            <Button
              variant={filters.sort === 'oldest' ? 'contained' : 'outlined'}
              color="primary"
              onClick={() => sortPosts('oldest')}
              style={{ marginBottom: '1rem' }}
            >
              오래된순
            </Button>
          </AccordionDetails>
        </Accordion>

        {filters.search && (
          <Typography sx={{ my: 2 }}>
            &quot;{filters.search}&quot; 검색 결과: {total}건
          </Typography>
        )}

        <InfiniteScroll
          load={loadMore}
          hasMore={hasMore}
          endMessage={posts.length === 0 ? '게시물이 없습니다.' : '더 이상 게시물이 없습니다.'}
        >
          {posts.map((post: Post) => (
            <Card key={post.id} style={{ marginBottom: '2rem' }}>
              <Link href={`/posts/${post.id}`} style={{ textDecoration: 'none' }}>
                <CardActionArea>
                  {post.image && <CardMedia component="img" height="200" image={post.image} alt={post.title} />}
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      {post.category && <Chip label={post.category.name} size="small" />}
                      <Typography variant="caption" color="textSecondary">
                        {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                      </Typography>
                    </Box>
                    <Typography gutterBottom variant="h5" component="h2">
                      {post.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                      {post.content.substring(0, 150)}...
                    </Typography>
                    <Box sx={{ mt: 1, display: 'flex', gap: 2 }}>
                      <Typography variant="caption">{post.author.name || '익명'}</Typography>
                      <Typography variant="caption">댓글 {post._count.comments}</Typography>
                      <Typography variant="caption">좋아요 {post._count.likes}</Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Link>
            </Card>
          ))}
        </InfiniteScroll>
      </div>
    </main>
  );
};

export default IndexPage;
