import { createTheme } from '@mui/material/styles';
import { color } from '@/styles/theme/color';

const theme = createTheme({
  palette: {
    mode: 'light',
    ...color,
  },
  typography: {
    fontFamily: ['Pretendard', '-apple-system', '"Apple SD Gothic Neo"', '"Segoe UI"', 'sans-serif'].join(','),
    h1: { fontWeight: 800, fontSize: '2.25rem', lineHeight: 1.2, letterSpacing: '-0.025em' },
    h2: { fontWeight: 700, fontSize: '1.5rem', lineHeight: 1.3, letterSpacing: '-0.015em' },
    h3: { fontWeight: 700, fontSize: '1.25rem', lineHeight: 1.4 },
    h4: { fontWeight: 600, fontSize: '1.125rem', lineHeight: 1.4 },
    h5: { fontWeight: 600, fontSize: '1rem', lineHeight: 1.5 },
    h6: { fontWeight: 600, fontSize: '0.875rem', lineHeight: 1.5 },
    body1: { fontSize: '1rem', lineHeight: 1.75, color: color.text.primary },
    body2: { fontSize: '0.875rem', lineHeight: 1.6, color: color.text.secondary },
    caption: { fontSize: '0.75rem', color: color.text.secondary },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 9999,
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
          borderColor: '#e2e8f0',
          color: color.text.primary,
          '&:hover': {
            borderColor: color.primary.main,
            backgroundColor: 'rgba(245, 158, 11, 0.04)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          border: '1px solid #f1f5f9',
          borderRadius: 12,
          transition: 'border-color 0.2s, box-shadow 0.2s',
          '&:hover': {
            borderColor: '#e2e8f0',
            boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 9999,
          fontSize: '0.8125rem',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#ffffff',
          margin: 0,
          padding: 0,
        },
      },
    },
  },
});

export default theme;

export type TColors = typeof color;
