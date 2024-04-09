import Link from 'next/link';
import React, { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Menu,
  MenuItem,
} from '@mui/material';

const IndexPage: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState([
    {
      id: 1,
      title: 'First Article Title',
      image:
        'https://mblogthumb-phinf.pstatic.net/MjAxNzEyMTVfMTIg/MDAxNTEzMzE3MTU0NjI3.wnTv2ShU8mXs9WeyhTEeFkCaFGfXsNnILB9wfJuXpv8g.o5hDm5FhQFIbCc-JQF-hebciiDi9LXWP6zS6SlgiLXMg.PNG.nubgood/2017-12-15_14%3B44%3B53.PNG?type=w800',
    },
    {
      id: 2,
      title: 'Second Article Title',
      image:
        'https://mblogthumb-phinf.pstatic.net/MjAxNzEyMTVfMTIg/MDAxNTEzMzE3MTU0NjI3.wnTv2ShU8mXs9WeyhTEeFkCaFGfXsNnILB9wfJuXpv8g.o5hDm5FhQFIbCc-JQF-hebciiDi9LXWP6zS6SlgiLXMg.PNG.nubgood/2017-12-15_14%3B44%3B53.PNG?type=w800',
    },
  ]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleFilterButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const addNewPost = () => {
    const newPost = {
      id: blogPosts.length + 1,
      title: `New Article ${blogPosts.length + 1} Title`,
      image:
        'https://mblogthumb-phinf.pstatic.net/MjAxNzEyMTVfMTIg/MDAxNTEzMzE3MTU0NjI3.wnTv2ShU8mXs9WeyhTEeFkCaFGfXsNnILB9wfJuXpv8g.o5hDm5FhQFIbCc-JQF-hebciiDi9LXWP6zS6SlgiLXMg.PNG.nubgood/2017-12-15_14%3B44%3B53.PNG?type=w800',
    };
    setBlogPosts([...blogPosts, newPost]);
  };

  return (
    <main>
      <div style={{ padding: '8rem 0 6rem' }}>
        <Container maxWidth="md">
          <div style={{ marginBottom: '1rem' }}>
            <Button variant="outlined" color="primary" onClick={handleFilterButtonClick}>
              Filter
            </Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleFilterClose}>
              <MenuItem onClick={handleFilterClose}>최신순</MenuItem>
              <MenuItem onClick={handleFilterClose}>댓글 많은 순</MenuItem>
              <MenuItem onClick={handleFilterClose}>오래된 순</MenuItem>
              <MenuItem onClick={handleFilterClose}>인기많은 순</MenuItem>
            </Menu>

            <Button variant="contained">
              <Link href="/guestbook" passHref>
                <a style={{ textDecoration: 'none', color: 'black' }}>글쓰기</a>
              </Link>
            </Button>
          </div>
          {blogPosts.map(post => (
            <Card key={post.id} style={{ marginBottom: '2rem' }}>
              <Link href={`/blogs/article${post.id}`}>
                <CardActionArea style={{ display: 'flex' }}>
                  <CardMedia component="img" height="200" image={post.image} alt={`Article ${post.id}`} />
                  <CardContent style={{ flex: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {post.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                      Example
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Link>
            </Card>
          ))}
          <div style={{ marginTop: '4rem', textAlign: 'center' }}>
            <Button variant="outlined" color="primary" onClick={addNewPost}>
              Add New Article
            </Button>
          </div>
        </Container>
      </div>
    </main>
  );
};

export default IndexPage;
