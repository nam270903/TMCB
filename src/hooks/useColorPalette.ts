import { useState, useEffect } from 'react';
import RNFS from 'react-native-fs';

export interface ColorItem {
  id: string;
  color: string;
}

export function useColorPalette(coloredSvgUri: string) {
  const [colors, setColors] = useState<ColorItem[]>([]);
const [selectedColor, setSelectedColor] = useState<string | null>(null);

  useEffect(() => {
    const loadColors = async () => {
      try {
        const path = coloredSvgUri.replace('file://', '');
        const content = await RNFS.readFile(path, 'utf8');

        // 🎯 Regex: bắt tất cả fill dạng hex, rgb, rgba, hsl, hsla
        const regex =
          /fill=(?:"|')((#[0-9A-Fa-f]{3,8})|(rgb[a]?\([^)]+\))|(hsl[a]?\([^)]+\)))(?:"|')/g;

        const colorCounts = new Map<string, number>();
        let match;

        while ((match = regex.exec(content))) {
          const color = match[1].trim().toLowerCase();
          if (color !== 'none') {
            colorCounts.set(color, (colorCounts.get(color) || 0) + 1);
          }
        }

        // Sắp xếp màu theo tần suất xuất hiện (giảm dần) và lấy top 20
        const colorList = Array.from(colorCounts.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 12)
          .map(([color], i) => ({
            id: `color_${i}`,
            color,
          }));

        setColors(colorList);
        setSelectedColor(colorList[0]?.color || '#000');
      } catch (err) {
        console.error('❌ Error loading color palette:', err);
      }
    };

    loadColors();
  }, [coloredSvgUri]);

  return { colors, selectedColor, setSelectedColor };
}
