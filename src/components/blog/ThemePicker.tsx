import { Check } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';

const THEME_COLORS = [
  { name: '앰버', value: '#ffa000' },
  { name: '코랄', value: '#ff6b6b' },
  { name: '민트', value: '#20c997' },
  { name: '스카이', value: '#339af0' },
  { name: '퍼플', value: '#7950f2' },
  { name: '핑크', value: '#e64980' },
  { name: '라임', value: '#82c91e' },
  { name: '다크', value: '#495057' },
];

interface ThemePickerProps {
  selected: string;
  onChange: (color: string) => void;
}

const ThemePicker = ({ selected, onChange }: ThemePickerProps) => {
  return (
    <Box>
      <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 600 }}>
        테마 컬러
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {THEME_COLORS.map(color => (
          <Box
            key={color.value}
            onClick={() => onChange(color.value)}
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: color.value,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.15s',
              border: selected === color.value ? '3px solid #fff' : 'none',
              boxShadow: selected === color.value ? `0 0 0 2px ${color.value}` : '0 1px 3px rgba(0,0,0,0.15)',
              '&:hover': { transform: 'scale(1.1)' },
            }}
          >
            {selected === color.value && <Check sx={{ color: '#fff', fontSize: 18 }} />}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export { THEME_COLORS };
export default ThemePicker;
