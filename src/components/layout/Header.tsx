import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { Search as SearchIcon, KeyboardArrowDown, CreateOutlined } from '@mui/icons-material';
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
        borderBottom: '1px solid #f1f5f9',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ height: 60, justifyContent: 'space-between' }}>
          {/* Logo */}
          <Link href="/">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}>
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: '6px',
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>B</Typography>
              </Box>
              <Typography sx={{ fontWeight: 700, fontSize: '1.125rem', color: '#1e293b' }}>Blog</Typography>
            </Box>
          </Link>

          {/* Right section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {/* Search */}
            {searchOpen ? (
              <Box
                component="form"
                onSubmit={handleSearch}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  px: 1.5,
                  py: 0.5,
                  width: 260,
                  '&:focus-within': {
                    borderColor: '#f59e0b',
                    boxShadow: '0 0 0 3px rgba(245,158,11,0.1)',
                  },
                }}
              >
                <SearchIcon sx={{ color: '#94a3b8', fontSize: 20, mr: 0.5 }} />
                <InputBase
                  autoFocus
                  placeholder="검색어를 입력하세요"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onBlur={() => !searchQuery && setSearchOpen(false)}
                  sx={{ flex: 1, fontSize: '0.875rem' }}
                />
              </Box>
            ) : (
              <IconButton onClick={() => setSearchOpen(true)} sx={{ color: '#64748b' }}>
                <SearchIcon sx={{ fontSize: 22 }} />
              </IconButton>
            )}

            {session ? (
              <>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<CreateOutlined sx={{ fontSize: 18 }} />}
                  onClick={() => router.push('/write')}
                  sx={{ ml: 1, px: 2.5, py: 0.75, fontSize: '0.8125rem' }}
                >
                  글쓰기
                </Button>
                <Box
                  onClick={e => setAnchorEl(e.currentTarget)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    ml: 1,
                    p: 0.5,
                    borderRadius: '10px',
                    '&:hover': { backgroundColor: '#f8fafc' },
                  }}
                >
                  <Avatar src={session.user?.image || ''} sx={{ width: 32, height: 32, border: '2px solid #f1f5f9' }} />
                  <KeyboardArrowDown sx={{ fontSize: 18, color: '#94a3b8', ml: 0.25 }} />
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
                      minWidth: 220,
                      borderRadius: '12px',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                      border: '1px solid #f1f5f9',
                    },
                  }}
                >
                  <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', color: '#1e293b' }}>
                      {session.user?.name}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8' }}>{session.user?.email}</Typography>
                  </Box>
                  <Divider sx={{ borderColor: '#f1f5f9' }} />
                  <MenuItem
                    onClick={() => {
                      setAnchorEl(null);
                      const name = session.user?.name;
                      if (name) router.push(`/blog/${encodeURIComponent(name)}`);
                    }}
                    sx={{ py: 1.25, fontSize: '0.875rem' }}
                  >
                    내 블로그
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setAnchorEl(null);
                      router.push('/settings');
                    }}
                    sx={{ py: 1.25, fontSize: '0.875rem' }}
                  >
                    설정
                  </MenuItem>
                  <Divider sx={{ borderColor: '#f1f5f9' }} />
                  <MenuItem
                    onClick={() => {
                      setAnchorEl(null);
                      signOut();
                    }}
                    sx={{ py: 1.25, fontSize: '0.875rem', color: '#ef4444' }}
                  >
                    로그아웃
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                variant="contained"
                size="small"
                onClick={() => router.push('/login')}
                sx={{ ml: 1, px: 2.5, py: 0.75 }}
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
