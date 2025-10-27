import { useEffect, useState } from 'react';
import RNFS from 'react-native-fs';

/**
 * Hook sinh bảng màu từ file SVG colored.
 * Nếu không có SVG colored, dùng fallback mặc định.
 */
export function useColorPalette(coloredSvgUri?: string) {
  const [colors, setColors] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>('#000000');

  useEffect(() => {
    const extractColorsFromSvg = async () => {
      if (!coloredSvgUri) {
        setColors(DEFAULT_COLORS);
        return;
      }

      try {
        const path = coloredSvgUri.replace('file://', '');
        const svgContent = await RNFS.readFile(path, 'utf8');

        // Regex lấy tất cả fill="#xxxxxx" hoặc fill='rgb(...)'
        const fillRegex = /fill="(#[0-9A-Fa-f]{3,6}|rgb\([^)]+\))"/g;
        const matches = svgContent.match(fillRegex);

        if (matches && matches.length > 0) {
          const uniqueColors = Array.from(
            new Set(
              matches
                .map((m) => m.replace(/fill=|"/g, ''))
                .filter((c) => c !== 'none' && c !== '#fff' && c !== '#ffffff')
            )
          );
          setColors(uniqueColors.slice(0, 20)); // chỉ lấy tối đa 12 màu
          setSelectedColor(uniqueColors[0]);
        } else {
          setColors(DEFAULT_COLORS);
          setSelectedColor(DEFAULT_COLORS[0]);
        }
      } catch (error) {
        console.warn('⚠️ Không thể đọc màu từ SVG:', error);
        setColors(DEFAULT_COLORS);
      }
    };

    extractColorsFromSvg();
  }, [coloredSvgUri]);

  return { colors, selectedColor, setSelectedColor };
}

// 🎨 fallback màu mặc định
const DEFAULT_COLORS = [
  '#E53935', // đỏ
  '#FDD835', // vàng
  '#43A047', // xanh lá
  '#1E88E5', // xanh dương
  '#8E24AA', // tím
  '#F48FB1', // hồng
  '#A1887F', // nâu nhạt
  '#757575', // xám
  '#000000', // đen
  '#FFFFFF', // trắng
];
