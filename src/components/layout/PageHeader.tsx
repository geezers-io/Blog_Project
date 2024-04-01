import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { DarkMode, LightMode, Search } from '@mui/icons-material';
import { Button, Grid, TextField } from '@mui/material';
import MusicPlayer from '@/components/MusicPlayler';
import * as S from '@/styles/layout/layout.style';

const PageHeader = () => {
  const [searchVisible, setSearchVisible] = useState(false);
  const { theme, setTheme } = useTheme();

  const sunIcon = theme === 'dark' ? <LightMode /> : <DarkMode />;

  return (
    <S.BGHeaderContainer>
      <Grid container justifyContent="center">
        <Grid item xs={12}>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            style={{ paddingLeft: '20px', paddingRight: '20px', paddingTop: '20px' }}
          >
            <Grid item>
              <img src="/logo.png" style={{ width: 100, height: 50 }} />
            </Grid>
            <Grid item>
              <MusicPlayer />
            </Grid>
          </Grid>
          <Grid container justifyContent="center" alignItems="center">
            <Grid item>
              <Button style={{ color: 'black' }}>
                <Link href="/">
                  <a style={{ textDecoration: 'none', color: 'black' }}>홈</a>
                </Link>
              </Button>
              <Button style={{ color: 'black' }}>
                <Link href="/about">
                  <a style={{ textDecoration: 'none', color: 'black' }}>내 소개</a>
                </Link>
              </Button>
              <Button style={{ color: 'black' }}>
                <Link href="/guestbook">
                  <a style={{ textDecoration: 'none', color: 'black' }}>방명록</a>
                </Link>
              </Button>
              <Button onClick={() => setSearchVisible(!searchVisible)}>
                <Search style={{ color: 'black' }} />
              </Button>
              <Button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} style={{ color: 'black' }}>
                {sunIcon}
              </Button>
            </Grid>
          </Grid>
          {searchVisible && (
            <Grid container justifyContent="center">
              <Grid item>
                <TextField
                  id="outlined-basic"
                  label="검색"
                  variant="outlined"
                  style={{ marginTop: '10px', width: '200px' }}
                />
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
    </S.BGHeaderContainer>
  );
};

export default PageHeader;
