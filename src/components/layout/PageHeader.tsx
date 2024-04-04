import Image from 'next/image';
import Link from 'next/link';
import { useContext, useState } from 'react';
import { DarkMode, LightMode, Search } from '@mui/icons-material';
import { Button, Grid, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MusicPlayer from '@/components/MusicPlayler';
import { ColorModeContext } from '@/pages/_index';
import * as S from '@/styles/layout/layout.style';

const PageHeader = () => {
  const [searchVisible, setSearchVisible] = useState(false);
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  console.log(theme);

  return (
    <S.BGHeaderContainer>
      <Grid container>
        <Grid item xs={12}>
          <Grid container style={{ paddingLeft: '20px', paddingRight: '20px', paddingTop: '20px' }}>
            <Grid container>
              <Grid item>
                <Image src="/logo.png" alt="logo" width={100} height={50} />
              </Grid>

              <Grid item marginLeft="36%">
                <Grid container justifyContent="center">
                  <Button style={{ color: 'black' }}>
                    <Link href="/">
                      <a style={{ textDecoration: 'none', color: 'black' }}>홈</a>
                    </Link>
                  </Button>
                  <Button style={{ color: 'black' }}>
                    <Link href="/about" passHref>
                      <a style={{ textDecoration: 'none', color: 'black' }}>내 소개</a>
                    </Link>
                  </Button>
                  <Button style={{ color: 'black' }}>
                    <Link href="/guestbook" passHref>
                      <a style={{ textDecoration: 'none', color: 'black' }}>방명록</a>
                    </Link>
                  </Button>
                  <Button onClick={() => setSearchVisible(!searchVisible)}>
                    <Search style={{ color: 'black' }} />
                  </Button>
                </Grid>
              </Grid>
              {searchVisible && <TextField id="outlined-basic" label="검색" variant="outlined" />}
            </Grid>

            <Grid container justifyContent="flex-end">
              <Grid item>
                <MusicPlayer />
              </Grid>
            </Grid>
            <Button onClick={colorMode.toggleColorMode} style={{ color: 'black' }}>
              {theme.palette.mode === 'dark' ? <DarkMode /> : <LightMode />}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </S.BGHeaderContainer>
  );
};

export default PageHeader;
