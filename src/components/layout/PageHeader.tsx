import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Search as SearchIcon } from '@mui/icons-material';
import { Grid, Button, TextField, InputAdornment } from '@mui/material';
import * as S from '@/styles/layout/layout.style';
import LoginComponent from './Login';

const PageHeader = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <S.BGHeaderContainer>
      <Grid container>
        <Grid item xs={12}>
          <Grid container style={{ paddingLeft: '20px', paddingRight: '20px', paddingTop: '20px' }}>
            <Grid container alignItems="center">
              <Grid item>
                <Link href="/">
                  <Image src="/logo.png" alt="logo" width={100} height={50} />
                </Link>
              </Grid>

              <Grid item xs={4} sx={{ mx: 2 }}>
                <form onSubmit={handleSearch}>
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="검색..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </form>
              </Grid>

              <Grid item xs justifyContent="flex-end">
                <Grid container justifyContent="flex-end">
                  <Button style={{ color: 'black', marginRight: '10px' }}>
                    <Link href="/about" style={{ textDecoration: 'none', color: 'black' }}>
                      프로필 정보
                    </Link>
                  </Button>
                  <Button variant="contained">
                    <Link href="/uploadpost" style={{ textDecoration: 'none', color: 'black' }}>
                      글쓰기
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
