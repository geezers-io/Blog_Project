import { createContext, FC, ReactNode, useMemo, useState } from 'react';
import { PaletteMode } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

interface Props {
  children: ReactNode;
}
export const ColorModeContext = createContext({ toggleColorMode: () => {} });
export const Provider: FC<Props> = ({ children }) => {
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
          // ...(mode === 'dark' && {
          //   background: {
          //     default: '#4D5053',
          //     paper: '#0000',
          //   },
          // }),
          // ...(mode === 'light' && {
          //   background: {
          //     default: '#0000',
          //     paper: '#4D5053',
          //   },
          // }),
          // ...(mode === 'dark' && {
          //   background: {
          //     default: deepOrange[900],
          //     paper: deepOrange[900],
          //   },
          // }),
          // text: {
          //   ...(mode === 'light'
          //     ? {
          //         primary: grey[900],
          //         secondary: grey[800],
          //       }
          //     : {
          //         primary: '#fff',
          //         secondary: grey[500],
          //       }),
          // },
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
