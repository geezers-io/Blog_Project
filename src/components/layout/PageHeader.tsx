import Image from 'next/image';
import Link from 'next/link';
import { useContext } from 'react';
import { DarkMode, LightMode } from '@mui/icons-material';
import { ToggleButton, ToggleButtonGroup, Grid, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ColorModeContext } from '@/pages/_index';
import * as S from '@/styles/layout/layout.style';

const PageHeader = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  const handleModeToggle = () => {
    colorMode.toggleColorMode();
  };

  return (
    <S.BGHeaderContainer>
      <Grid container>
        <Grid item xs={12}>
          <Grid container style={{ paddingLeft: '20px', paddingRight: '20px', paddingTop: '20px' }}>
            <Grid container>
              <Grid item>
                <Link href="/" passHref>
                  <a>
                    <Image src="/logo.png" alt="logo" width={100} height={50} />
                  </a>
                </Link>
              </Grid>

              <Grid item xs justifyContent="flex-end">
                <Grid container justifyContent="flex-end">
                  <Button style={{ color: 'black' }}>
                    <Link href="/about">
                      <a style={{ textDecoration: 'none', color: 'black' }}>프로필 정보</a>
                    </Link>
                  </Button>
                  <Button style={{ color: 'black' }}>
                    <Link href="/signin" passHref>
                      <a style={{ textDecoration: 'none', color: 'black' }}>로그인</a>
                    </Link>
                  </Button>
                  <Button style={{ color: 'black' }}>
                    <Link href="/guestbook" passHref>
                      <a style={{ textDecoration: 'none', color: 'black' }}>글쓰기</a>
                    </Link>
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <ToggleButtonGroup
              value={theme.palette.mode}
              exclusive
              onChange={handleModeToggle}
              aria-label="text alignment"
              style={{ color: 'black', marginTop: '14%' }}
            >
              <ToggleButton value="dark">{theme.palette.mode === 'dark' ? <LightMode /> : <DarkMode />}</ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        </Grid>
      </Grid>
    </S.BGHeaderContainer>
  );
};

export default PageHeader;
