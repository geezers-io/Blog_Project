import Link from 'next/link';
import { useState } from 'react';
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
} from '@mui/material';

const IndexPage: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState([
    {
      id: 1,
      title: 'First Article Title',
      image: 'https://via.placeholder.com/300',
    },
    {
      id: 2,
      title: 'Second Article Title',
      image: 'https://via.placeholder.com/300',
    },
  ]);

  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const addNewPost = () => {
    const newPost = {
      id: blogPosts.length + 1,
      title: `New Article ${blogPosts.length + 1} Title`,
      image: 'https://via.placeholder.com/300',
    };
    setBlogPosts([...blogPosts, newPost]);
  };

  const sortPosts = (filter: string) => {
    const sortedPosts = [...blogPosts];
    if (filter === 'recent') {
      sortedPosts.sort((a, b) => b.id - a.id);
    } else if (filter === 'popular') {
    } else if (filter === 'oldest') {
      sortedPosts.sort((a, b) => a.id - b.id);
    }
    setBlogPosts(sortedPosts);
  };

  return (
    <main>
      <div style={{ padding: '8rem 0 6rem' }}>
        <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1bh-content" id="panel1bh-header">
            <Typography>필터</Typography>
          </AccordionSummary>
          <AccordionDetails style={{ flexDirection: 'column', alignItems: 'center' }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => sortPosts('recent')}
              style={{ marginBottom: '1rem' }}
            >
              최신순
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => sortPosts('popular')}
              style={{ marginBottom: '1rem' }}
            >
              인기많은순
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => sortPosts('oldest')}
              style={{ marginBottom: '1rem' }}
            >
              오래된순
            </Button>
          </AccordionDetails>
        </Accordion>
        {blogPosts.map(post => (
          <Card key={post.id} style={{ marginBottom: '2rem' }}>
            <Link href={`/blogs/article${post.id}`} passHref>
              <CardActionArea>
                <CardMedia component="img" height="200" image={post.image} alt={`Article ${post.id}`} />
                <CardContent>
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
      </div>
    </main>
  );
};

export default IndexPage;
