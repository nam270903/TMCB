import { useEffect, useState } from 'react';
import RNFS from 'react-native-fs';

interface SvgPath {
  id: number;
  d: string;
  fill: string;
}

export function useInteractiveSvg(svgUri: string) {
  const [paths, setPaths] = useState<SvgPath[]>([]);

  // Hàm load SVG và parse path
  const loadSvg = async () => {
    try {
      console.log('🟢 [useInteractiveSvg] Loading SVG:', svgUri);

      // Bỏ prefix file:// (RNFS cần đường dẫn nội bộ)
      const filePath = svgUri.replace('file://', '');

      // Đọc nội dung SVG
      const content = await RNFS.readFile(filePath, 'utf8');
      if (!content) {
        console.warn('⚠️ Empty SVG file');
        return;
      }

      // Regex lấy tất cả các path trong SVG
      const regex = /<path[^>]*d="([^"]+)"[^>]*?(?:fill="([^"]*)")?[^>]*\/?>/g;
      let match;
      const extractedPaths: SvgPath[] = [];

      while ((match = regex.exec(content))) {
        const d = match[1];
        const fill = match[2] || 'white'; // Mặc định là trắng
        extractedPaths.push({
          id: extractedPaths.length,
          d,
          fill,
        });
      }

      console.log(`✅ Parsed ${extractedPaths.length} paths from SVG.`);
      setPaths(extractedPaths);
    } catch (error) {
      console.error('❌ Error parsing SVG:', error);
    }
  };


  const fillPath = (id: number, color: string) => {
    setPaths((prev) =>
      prev.map((p) => (p.id === id ? { ...p, fill: color } : p))
    );
  };

  useEffect(() => {
    loadSvg();
  }, [svgUri]);

  return { paths, fillPath };
}
