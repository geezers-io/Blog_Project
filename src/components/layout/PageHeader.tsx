import { Search } from '@mui/icons-material';
import { Button, ButtonGroup, Grid, TextField } from '@mui/material';
import * as S from '@/styles/layout/layout.style';

const PageHeader = () => {
  return (
    <S.BGHeaderContainer>
      <Grid container spacing={2}>
        <Grid item md={7} xs={6}>
          <S.LOGO>BLOG</S.LOGO>
        </Grid>
        <Grid item md={5} xs={6}>
          <ButtonGroup variant="text" color="primary">
            <Button>홈</Button>
            <Button>내 소개</Button>
            <Button>방명록</Button>
            <Search style={{ margin: 'auto 3px' }} />
            <TextField id="outlined-basic" label="검색" variant="outlined" style={{ margin: '5px' }} />
          </ButtonGroup>
        </Grid>
      </Grid>
    </S.BGHeaderContainer>
  );
};

export default PageHeader;
