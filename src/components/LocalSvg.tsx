// LocalSvg.tsx
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { SvgXml } from 'react-native-svg';
import RNFS from 'react-native-fs';

const svgCache = new Map<string, string>(); // global in-memory cache

const LocalSvg = ({ path, width, height }: { path: string; width: number; height: number }) => {
  const [xml, setXml] = useState<string | null>(() => {
    // if cached already, use it immediately
    const normalized = path.startsWith('file://') ? path.replace('file://', '') : path;
    return svgCache.get(normalized) ?? null;
  });
  const [loading, setLoading] = useState(!xml);

  useEffect(() => {
    let mounted = true;
    const normalizedPath = path.startsWith('file://') ? path.replace('file://', '') : path;

    // if cached, set and return
    if (svgCache.has(normalizedPath)) {
      setXml(svgCache.get(normalizedPath) as string);
      setLoading(false);
      return;
    }

    // Async read and cache
    const load = async () => {
      try {
        setLoading(true);
        const content = await RNFS.readFile(normalizedPath, 'utf8');
        svgCache.set(normalizedPath, content);
        if (mounted) {
          setXml(content);
        }
      } catch (err) {
        console.error('❌ Lỗi đọc SVG:', err, normalizedPath);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [path]);

  // Show nothing or a small loader while xml not ready.
  if (!xml) {
    // Keep the frame visible behind; we only render a small indicator so user sees immediate feedback.
    return (
      <View style={{ width, height, alignItems: 'center', justifyContent: 'center' }}>
        {loading ? <ActivityIndicator size="small" /> : null}
      </View>
    );
  }

  return <SvgXml xml={xml} width={width} height={height} />;
};

export default LocalSvg;
