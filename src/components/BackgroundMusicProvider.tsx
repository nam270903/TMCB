import React, { useEffect } from 'react';
import { AppState } from 'react-native';
import { useMusicController } from '../hooks/useMusicController';

const BackgroundMusicProvider = () => {
  const { musicRef } = useMusicController();

  // Theo dõi app background/foreground
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      const music = musicRef.current;
      if (!music) return;
      if (state === 'background') {
        console.log('⏸ App vào nền → dừng nhạc');
        music.pause();
      } else if (state === 'active') {
        console.log('▶️ App trở lại → phát nhạc');
        music.play();
      }
    });

    return () => sub.remove();
  }, [musicRef]);

  return null;
};

export default BackgroundMusicProvider;
