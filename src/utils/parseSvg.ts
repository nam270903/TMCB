// src/utils/parseSvg.ts
import RNFS from 'react-native-fs';
import { PathData } from './scoreUtils';

/** 🧠 Đọc tất cả path + màu từ file SVG (kể cả khi không có id) */
export const getPathsFromSvg = async (svgPath: string): Promise<PathData[]> => {
  try {
    let svgContent = '';

    // Đọc SVG từ local file (file:/// hoặc /...)
    if (svgPath.startsWith('file://') || svgPath.startsWith('/')) {
      svgContent = await RNFS.readFile(svgPath.replace('file://', ''), 'utf8');
    } else {
      // Đọc SVG từ network URI hoặc bundle
      const response = await fetch(svgPath);
      svgContent = await response.text();
    }

    const results: PathData[] = [];
    const pathRegex =
      /<path\b[^>]*?(?:id="([^"]*)")?[^>]*?(?:fill="([^"]*)")?[^>]*?(?:style="[^"]*fill:([^;"]+)[^"]*")?[^>]*?>/g;

    let match;
    let index = 0;
    while ((match = pathRegex.exec(svgContent)) !== null) {
      const id = match[1] || `path-${index}`;
      const fill = match[2] || match[3] || '#ffffff'; // fill trực tiếp hoặc trong style
      results.push({ id, fill });
      index++;
    }

    console.log(`✅ Đọc ${results.length} path từ SVG mẫu`);
    return results;
  } catch (error) {
    console.error('❌ Lỗi đọc SVG mẫu:', error);
    return [];
  }
};
