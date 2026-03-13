import { useState, useRef, useEffect } from 'react';
import { PlayArrowRounded, PauseRounded, MusicNote } from '@mui/icons-material';
import { Box, IconButton, Typography, Slider } from '@mui/material';

interface MiniPlayerProps {
  bgmUrl: string;
  themeColor: string;
}

const MiniPlayer = ({ bgmUrl, themeColor }: MiniPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const audio = new Audio(bgmUrl);
    audioRef.current = audio;
    audio.loop = true;

    audio.addEventListener('timeupdate', () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    });

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [bgmUrl]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 2,
        py: 1,
        borderRadius: 3,
        backgroundColor: `${themeColor}10`,
        border: `1px solid ${themeColor}30`,
        maxWidth: 240,
      }}
    >
      <IconButton
        size="small"
        onClick={togglePlay}
        sx={{
          backgroundColor: themeColor,
          color: '#fff',
          width: 32,
          height: 32,
          '&:hover': { backgroundColor: themeColor, opacity: 0.85 },
        }}
      >
        {playing ? <PauseRounded sx={{ fontSize: 18 }} /> : <PlayArrowRounded sx={{ fontSize: 18 }} />}
      </IconButton>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <MusicNote sx={{ fontSize: 14, color: themeColor }} />
          <Typography variant="caption" noWrap sx={{ fontWeight: 500 }}>
            BGM
          </Typography>
        </Box>
        <Slider
          size="small"
          value={progress}
          sx={{
            py: 0,
            height: 3,
            '& .MuiSlider-thumb': { width: 8, height: 8 },
            color: themeColor,
          }}
        />
      </Box>
    </Box>
  );
};

export default MiniPlayer;
