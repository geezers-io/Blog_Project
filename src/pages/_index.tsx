import { createContext, FC, ReactNode, useMemo, useState } from 'react';
import { PaletteMode } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

interface Props {
  children: ReactNode;
}
export const ColorModeContext = createContext({
  toggleColorMode: () => {
    return;
  },
});
const Provider: FC<Props> = ({ children }) => {
  const [mode, setMode] = useState<PaletteMode>('light');
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = useMemo(
    () =>
      createTheme({
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
        },
        palette: {
          mode,
          primary: {
            light: '#ffc107',
            main: '#ffa000',
            dark: '#ff6f00',
          },
          secondary: {
            main: '#ffb300',
          },
          error: {
            main: '#DA1E28',
          },
        },
      }),
    [mode],
  );
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default Provider;
