import { Box, Typography, Container } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        mt: 'auto',
        borderTop: '1px solid #f1f5f9',
      }}
    >
      <Container maxWidth="xl">
        <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center' }}>
          &copy; {new Date().getFullYear()} Blog. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
