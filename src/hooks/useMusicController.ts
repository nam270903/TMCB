// src/hooks/useMusicController.ts
import { useRef, useState, useEffect } from 'react';
import Sound from 'react-native-sound';

Sound.setCategory('Playback', true);

let globalMusic: Sound | null = null;

export const useMusicController = () => {
  const [volume, setVolume] = useState(0.5);
  const musicRef = useRef<Sound | null>(null);

  useEffect(() => {
    // Nếu nhạc đã được load global thì dùng lại
    if (globalMusic) {
      musicRef.current = globalMusic;
      return;
    }

    const music = new Sound('background.mp3', Sound.MAIN_BUNDLE, (err) => {
      if (err) {
        console.log('❌ Lỗi load nhạc:', err);
        return;
      }
      console.log('✅ Nhạc nền load thành công!');
      music.setNumberOfLoops(-1);
      music.setVolume(volume);
      music.play();
      globalMusic = music;
    });

    musicRef.current = music;

    return () => {
      music.stop(() => music.release());
      globalMusic = null;
    };
  }, []);

  const setMusicVolume = (v: number) => {
    setVolume(v);
    musicRef.current?.setVolume(v);
  };

  return { volume, setMusicVolume, musicRef };
};
