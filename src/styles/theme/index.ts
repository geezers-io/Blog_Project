import { createTheme } from '@mui/material/styles';
import { color } from '@/styles/theme/color';

const theme = createTheme({
  palette: {
    mode: 'light',
    ...color,
  },
  typography: {
    fontFamily: ['-apple-system', '"Apple SD Gothic Neo"', 'Pretendard', '"Segoe UI Emoji"', 'sans-serif'].join(','),
  },
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: 'contained' },
          style: {
            color: 'black',
            borderRadius: '20px',
            backgroundColor: '#ffcc80',
            padding: '10px 20px',
            marginRight: '10px',
          },
        },
      ],
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          width: '100%',
          minHeight: '100vh',
          margin: 0,
          padding: 0,
        },
      },
    },
  },
});

export default theme;

export type TColors = typeof color;
