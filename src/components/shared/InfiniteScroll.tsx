import React, { useCallback, useEffect, useRef } from 'react';
import { Box, CircularProgress } from '@mui/material';

interface InfiniteScrollProps {
  load: () => void;
  hasMore: boolean;
  endMessage?: React.ReactNode;
  children?: React.ReactNode;
}

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({ children, load, hasMore, endMessage }) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const observedRef = useRef<HTMLDivElement | null>(null);

  const handleIntersect: IntersectionObserverCallback = useCallback(
    entries => {
      if (entries[0].isIntersecting && hasMore) {
        load();
      }
    },
    [load, hasMore],
  );

  useEffect(() => {
    observerRef.current = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: '0px',
      threshold: 0.8,
    });

    if (observedRef.current) {
      observerRef.current.observe(observedRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleIntersect]);

  useEffect(() => {
    if (observerRef.current && observedRef.current) {
      observerRef.current.disconnect();
      observerRef.current.observe(observedRef.current);
    }
  }, [hasMore]);

  return (
    <Box>
      {children}
      <Box
        ref={observedRef}
        sx={{
          py: 4,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {hasMore ? <CircularProgress size={32} sx={{ color: 'primary.main' }} /> : endMessage}
      </Box>
    </Box>
  );
};

export default InfiniteScroll;
