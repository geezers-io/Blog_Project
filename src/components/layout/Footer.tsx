import { Box, Typography, Container } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        mt: 'auto',
        borderTop: '1px solid #eee',
        backgroundColor: '#fff',
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          &copy; {new Date().getFullYear()} Blog. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
