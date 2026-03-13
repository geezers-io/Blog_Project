import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { Search as SearchIcon, Edit as EditIcon } from '@mui/icons-material';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  InputBase,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Container,
} from '@mui/material';

const Header = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: '#fff',
        borderBottom: '1px solid #eee',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ height: 64, gap: 2 }}>
          <Link href="/">
            <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <Image src="/logo.png" alt="logo" width={80} height={40} />
            </Box>
          </Link>

          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{
              flex: 1,
              maxWidth: 480,
              mx: 'auto',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#f5f5f5',
              borderRadius: 2,
              px: 1.5,
              py: 0.5,
              transition: 'all 0.2s',
              '&:focus-within': {
                backgroundColor: '#fff',
                boxShadow: '0 0 0 2px rgba(255,160,0,0.3)',
              },
            }}
          >
            <SearchIcon sx={{ color: '#999', mr: 1, fontSize: 20 }} />
            <InputBase
              placeholder="검색어를 입력하세요..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              sx={{ flex: 1, fontSize: 14 }}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {session ? (
              <>
                <Button variant="contained" size="small" startIcon={<EditIcon />} onClick={() => router.push('/write')}>
                  글쓰기
                </Button>
                <IconButton onClick={handleMenuOpen} sx={{ ml: 0.5 }}>
                  <Avatar
                    src={session.user?.image || ''}
                    alt={session.user?.name || ''}
                    sx={{ width: 32, height: 32 }}
                  />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  PaperProps={{
                    sx: { mt: 1, minWidth: 180, borderRadius: 2 },
                  }}
                >
                  <Box sx={{ px: 2, py: 1 }}>
                    <Box sx={{ fontWeight: 600, fontSize: 14 }}>{session.user?.name}</Box>
                    <Box sx={{ fontSize: 12, color: '#999' }}>{session.user?.email}</Box>
                  </Box>
                  <Divider />
                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      const name = session.user?.name;
                      if (name) router.push(`/blog/${encodeURIComponent(name)}`);
                    }}
                  >
                    내 블로그
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      router.push('/settings');
                    }}
                  >
                    블로그 설정
                  </MenuItem>
                  <Divider />
                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      signOut();
                    }}
                    sx={{ color: '#ef4444' }}
                  >
                    로그아웃
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button variant="outlined" size="small" onClick={() => router.push('/login')}>
                로그인
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
