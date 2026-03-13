import { createTheme } from '@mui/material/styles';
import { color } from '@/styles/theme/color';

const theme = createTheme({
  palette: {
    mode: 'light',
    ...color,
  },
  typography: {
    fontFamily: ['Pretendard', '-apple-system', '"Apple SD Gothic Neo"', '"Segoe UI"', 'sans-serif'].join(','),
    h1: { fontWeight: 800, fontSize: '2.5rem', lineHeight: 1.2, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, fontSize: '1.75rem', lineHeight: 1.3, letterSpacing: '-0.01em' },
    h3: { fontWeight: 700, fontSize: '1.375rem', lineHeight: 1.4 },
    h4: { fontWeight: 600, fontSize: '1.125rem', lineHeight: 1.4 },
    h5: { fontWeight: 600, fontSize: '1rem', lineHeight: 1.5 },
    h6: { fontWeight: 600, fontSize: '0.875rem', lineHeight: 1.5 },
    body1: { fontSize: '1rem', lineHeight: 1.8, color: color.text.primary },
    body2: { fontSize: '0.875rem', lineHeight: 1.6, color: color.text.secondary },
    caption: { fontSize: '0.75rem', color: color.text.secondary },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          padding: '8px 20px',
          fontSize: '0.875rem',
        },
        contained: {
          backgroundColor: color.primary.main,
          color: '#fff',
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: color.primary.dark,
            boxShadow: 'none',
          },
        },
        outlined: {
          borderColor: '#dee2e6',
          color: color.text.primary,
          '&:hover': {
            borderColor: color.primary.main,
            backgroundColor: 'rgba(255, 160, 0, 0.04)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          border: 'none',
          borderRadius: 4,
          transition: 'transform 0.12s ease, box-shadow 0.12s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 12,
          fontSize: '0.8125rem',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#f8f9fa',
          margin: 0,
          padding: 0,
        },
      },
    },
  },
});

export default theme;

export type TColors = typeof color;
