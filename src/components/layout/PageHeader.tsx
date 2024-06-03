import Image from 'next/image';
import Link from 'next/link';
import { Grid, Button } from '@mui/material';
import * as S from '@/styles/layout/layout.style';
import LoginComponent from './Login';

const PageHeader = () => {
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
                  <Button style={{ color: 'black', marginRight: '10px' }}>
                    <Link href="/about">
                      <a style={{ textDecoration: 'none', color: 'black' }}>프로필 정보 </a>
                    </Link>
                  </Button>
                  <Button variant="contained">
                    <Link href="/uploadpost" passHref>
                      <a style={{ textDecoration: 'none', color: 'black' }}>글쓰기</a>
                    </Link>
                  </Button>
                  <LoginComponent />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </S.BGHeaderContainer>
  );
};

export default PageHeader;
