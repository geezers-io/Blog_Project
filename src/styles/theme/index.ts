import { createTheme } from '@mui/material/styles';
import colors from '@/styles/theme/color';

const theme = createTheme({
  palette: {
    mode: 'light',
    ...colors,
  },
  typography: {
    fontFamily: ['-apple-system', '"Apple SD Gothic Neo"', 'Pretendard', '"Segoe UI Emoji"', 'sans-serif'].join(','),
  },
  components: {
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

export type TColors = typeof colors;
