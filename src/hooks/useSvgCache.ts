import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import RNFS from 'react-native-fs';

const COLLECTIONS = ['svg_img_uncolored', 'svg_img_colored'];

export function useSvgCache() {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const cacheAll = async () => {
      try {
        let totalDocs = 0;
        let cached = 0;

        // Đếm tổng số document trước
        const counts = await Promise.all(
          COLLECTIONS.map(async (name) => {
            const snap = await firestore().collection(name).get();
            return snap.docs.length;
          })
        );
        totalDocs = counts.reduce((a, b) => a + b, 0);

        // Tải dữ liệu từng collection
        for (const collectionName of COLLECTIONS) {
          const snapshot = await firestore().collection(collectionName).get();

          // Chạy Promise.all để tải song song nhanh hơn
          await Promise.all(
            snapshot.docs.map(async (doc) => {
              const data = doc.data();
              const svgContent = data?.svgContent || '';
              const version = (data?.version || '1').toString();
              const docId = doc.id;

              if (!svgContent) {
                console.warn(`⚠️ Document ${docId} không có svgContent, bỏ qua.`);
                cached++;
                setProgress(Math.round((cached / totalDocs) * 100));
                return;
              }

              const localVersionKey = `${docId}_version`;
              const localVersion = await AsyncStorage.getItem(localVersionKey);

              if (localVersion !== version) {
                const filePath = `${RNFS.DocumentDirectoryPath}/${docId}.svg`;

                await RNFS.writeFile(filePath, svgContent, 'utf8');
                await AsyncStorage.setItem(localVersionKey, version);

                console.log(`✅ Cached ${docId} (${collectionName})`);
              }

              cached++;
              setProgress(Math.round((cached / totalDocs) * 100));
            })
          );
        }

        setIsDone(true);
        console.log('🎉 All SVGs cached successfully!');
      } catch (error) {
        console.error('🔥 Error caching SVGs:', error);
      }
    };

    cacheAll();
  }, []);

  return { progress, isDone };
}
