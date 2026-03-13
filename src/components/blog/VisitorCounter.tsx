import { Box, Typography } from '@mui/material';

interface VisitorCounterProps {
  today: number;
  total: number;
  themeColor: string;
}

const VisitorCounter = ({ today, total, themeColor }: VisitorCounterProps) => {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 2,
        px: 2,
        py: 0.75,
        borderRadius: 2,
        backgroundColor: '#f5f5f5',
        fontSize: 13,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Typography variant="caption" color="text.secondary">
          TODAY
        </Typography>
        <Typography variant="caption" sx={{ fontWeight: 700, color: themeColor }}>
          {today}
        </Typography>
      </Box>
      <Box sx={{ width: 1, height: 12, backgroundColor: '#ddd' }} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Typography variant="caption" color="text.secondary">
          TOTAL
        </Typography>
        <Typography variant="caption" sx={{ fontWeight: 700 }}>
          {total}
        </Typography>
      </Box>
    </Box>
  );
};

export default VisitorCounter;
