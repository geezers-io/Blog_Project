import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { Search as SearchIcon, KeyboardArrowDown } from '@mui/icons-material';
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
  Typography,
} from '@mui/material';

const Header = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: '#fff',
        borderBottom: '1px solid #f1f3f5',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ height: 64, justifyContent: 'space-between' }}>
          {/* Logo */}
          <Link href="/">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #ffa000, #ff8f00)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 18 }}>B</Typography>
              </Box>
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  color: '#212529',
                  letterSpacing: '-0.02em',
                }}
              >
                velog
              </Typography>
            </Box>
          </Link>

          {/* Right section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Search */}
            {searchOpen ? (
              <Box
                component="form"
                onSubmit={handleSearch}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#f1f3f5',
                  borderRadius: '20px',
                  px: 2,
                  py: 0.5,
                  width: 280,
                  transition: 'all 0.2s',
                  '&:focus-within': {
                    backgroundColor: '#fff',
                    boxShadow: '0 0 0 2px rgba(255,160,0,0.3)',
                  },
                }}
              >
                <InputBase
                  autoFocus
                  placeholder="검색어를 입력하세요"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onBlur={() => !searchQuery && setSearchOpen(false)}
                  sx={{ flex: 1, fontSize: 14 }}
                />
                <SearchIcon sx={{ color: '#868e96', fontSize: 20 }} />
              </Box>
            ) : (
              <IconButton onClick={() => setSearchOpen(true)} sx={{ color: '#868e96' }}>
                <SearchIcon />
              </IconButton>
            )}

            {session ? (
              <>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => router.push('/write')}
                  sx={{
                    borderRadius: '20px',
                    px: 2.5,
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  새 글 작성
                </Button>
                <Box
                  onClick={e => setAnchorEl(e.currentTarget)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    ml: 0.5,
                    borderRadius: '20px',
                    '&:hover': { backgroundColor: '#f8f9fa' },
                    py: 0.5,
                    px: 0.5,
                  }}
                >
                  <Avatar src={session.user?.image || ''} sx={{ width: 28, height: 28 }} />
                  <KeyboardArrowDown sx={{ fontSize: 18, color: '#868e96' }} />
                </Box>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      minWidth: 200,
                      borderRadius: 2,
                      boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                      border: '1px solid #f1f3f5',
                    },
                  }}
                >
                  <Box sx={{ px: 2.5, py: 1.5 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: 14, color: '#212529' }}>
                      {session.user?.name}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: '#868e96', mt: 0.25 }}>{session.user?.email}</Typography>
                  </Box>
                  <Divider />
                  <MenuItem
                    onClick={() => {
                      setAnchorEl(null);
                      const name = session.user?.name;
                      if (name) router.push(`/blog/${encodeURIComponent(name)}`);
                    }}
                    sx={{ py: 1.5, fontSize: 14 }}
                  >
                    내 블로그
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setAnchorEl(null);
                      router.push('/settings');
                    }}
                    sx={{ py: 1.5, fontSize: 14 }}
                  >
                    설정
                  </MenuItem>
                  <Divider />
                  <MenuItem
                    onClick={() => {
                      setAnchorEl(null);
                      signOut();
                    }}
                    sx={{ py: 1.5, fontSize: 14, color: '#868e96' }}
                  >
                    로그아웃
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                variant="outlined"
                size="small"
                onClick={() => router.push('/login')}
                sx={{
                  borderRadius: '20px',
                  borderColor: '#212529',
                  color: '#212529',
                  fontWeight: 700,
                  '&:hover': { borderColor: '#212529', backgroundColor: '#f8f9fa' },
                }}
              >
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
