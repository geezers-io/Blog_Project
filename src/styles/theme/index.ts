import { createTheme } from '@mui/material/styles';
import { color } from '@/styles/theme/color';

const theme = createTheme({
  palette: {
    mode: 'light',
    ...color,
  },
  typography: {
    fontFamily: ['Pretendard', '-apple-system', '"Apple SD Gothic Neo"', '"Segoe UI"', 'sans-serif'].join(','),
    h1: { fontWeight: 700, fontSize: '2.25rem', lineHeight: 1.3 },
    h2: { fontWeight: 700, fontSize: '1.75rem', lineHeight: 1.3 },
    h3: { fontWeight: 600, fontSize: '1.5rem', lineHeight: 1.4 },
    h4: { fontWeight: 600, fontSize: '1.25rem', lineHeight: 1.4 },
    h5: { fontWeight: 600, fontSize: '1.125rem', lineHeight: 1.5 },
    h6: { fontWeight: 600, fontSize: '1rem', lineHeight: 1.5 },
    body1: { fontSize: '1rem', lineHeight: 1.7 },
    body2: { fontSize: '0.875rem', lineHeight: 1.6 },
    caption: { fontSize: '0.75rem', color: color.text.secondary },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          padding: '8px 20px',
        },
        contained: {
          backgroundColor: color.primary.main,
          color: color.primary.contrastText,
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: color.primary.dark,
            boxShadow: 'none',
          },
        },
        outlined: {
          borderColor: '#e5e7eb',
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
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          border: '1px solid #f0f0f0',
          transition: 'box-shadow 0.2s ease, transform 0.2s ease',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 6,
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
          backgroundColor: '#fafafa',
          margin: 0,
          padding: 0,
        },
      },
    },
  },
});

export default theme;

export type TColors = typeof color;
