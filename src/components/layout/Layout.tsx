import { FC, ReactNode } from 'react';
import { Box, Container } from '@mui/material';
import Footer from './Footer';
import Header from './Header';

interface Props {
  children: ReactNode;
}

const Layout: FC<Props> = ({ children }) => {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Box component="main" sx={{ flex: 1, py: 4 }}>
        <Container maxWidth="lg">{children}</Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
