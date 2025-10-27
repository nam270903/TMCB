import RNFS from 'react-native-fs';
import { useState, useEffect } from 'react';

export function useLocalSvgFiles() {
  const [svgFiles, setSvgFiles] = useState<string[]>([]);

  useEffect(() => {
    const loadLocalFiles = async () => {
      try {
        const files = await RNFS.readDir(RNFS.DocumentDirectoryPath);
        const svgPaths = files
          .filter((f) => f.name.endsWith('.svg'))
          .map((f) => 'file://' + f.path);
        setSvgFiles(svgPaths);
      } catch (error) {
        console.error('❌ Lỗi đọc file SVG:', error);
      }
    };

    loadLocalFiles();
  }, []);

  return svgFiles;
}
