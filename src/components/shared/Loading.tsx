import React from 'react';
import { CircularProgress } from '@mui/material';

interface LoadingProps {
  size?: number;
}

const Loading: React.FC<LoadingProps> = ({ size = 100 }) => {
  return <CircularProgress size={size} />;
};

export default Loading;
