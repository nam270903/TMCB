import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Dimensions, Text, ScrollView, ActivityIndicator } from 'react-native';
import { SvgXml } from 'react-native-svg';
import RNFS from 'react-native-fs';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useLocalSvgFiles } from '../hooks/useLocalSvgFiles';
import Loading_BG from '../assets/svg_img/Loading_BG.svg';
import ImgFrame from '../assets/svg_img/Img_frame.svg';
import HeaderFrame from '../assets/svg_img/Header_Frame.svg';
import Return from '../components/Return';
import CategoryBar from '../components/CategoryBar';

const { width } = Dimensions.get('window');

const MemoryColoringScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const initialFilter = route.params?.filter || 'all';
  const [activeFilter, setActiveFilter] = useState(initialFilter);
  
  // ⭐ Cache SVG content
  const [svgCache, setSvgCache] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  // 🧩 Lấy tất cả SVG files
  const allSvgFiles = useLocalSvgFiles().filter(uri => uri.includes('_uncolored'));

  // 🧩 Lọc theo category
  const filteredSvgFiles = allSvgFiles.filter(uri => {
    if (activeFilter === 'all') return true;
    const match = uri.match(/\/([a-zA-Z]+)_/);
    if (!match) return false;
    const categoryFromFile = match[1].toLowerCase();
    const variants = [categoryFromFile, categoryFromFile + 's', categoryFromFile.replace(/s$/, '')];
    return variants.includes(activeFilter.toLowerCase());
  });

  // ⭐ Preload tất cả SVG khi component mount
  useEffect(() => {
    const preloadSvgs = async () => {
      setIsLoading(true);
      const cache: Record<string, string> = {};
      
      try {
        await Promise.all(
          allSvgFiles.map(async (path) => {
            try {
              const normalizedPath = path.startsWith('file://') ? path.replace('file://', '') : path;
              const content = await RNFS.readFile(normalizedPath, 'utf8');
              cache[path] = content;
            } catch (err) {
              console.error('❌ Lỗi đọc SVG:', path, err);
            }
          })
        );
        
        setSvgCache(cache);
      } catch (error) {
        console.error('❌ Lỗi preload SVGs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (allSvgFiles.length > 0) {
      preloadSvgs();
    }
  }, [allSvgFiles.length]);

  const handleImagePress = (svgUri: string) => {
    navigation.navigate('ColoringScreen', { svgUri });
  };

  // 🎨 Loading Screen
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Loading_BG width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={StyleSheet.absoluteFill} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFF" />
          <Text style={styles.loadingText}>Đang tải hình ảnh...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 🌈 Background */}
      <Loading_BG width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={StyleSheet.absoluteFill} />

      {/* 🩷 Header */}
      <View style={styles.header}>
        <HeaderFrame width="100%" height={150} preserveAspectRatio="xMidYMid slice" />
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Return />
          </TouchableOpacity>
          <Text style={styles.title}>Tô màu trí nhớ</Text>
          <Text style={styles.subtitle}>Giúp trẻ nâng cao khả năng ghi nhớ</Text>
        </View>
      </View>

      {/* 🩷 Category Scroll Bar */}
      <View style={styles.categoryScroll}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScrollContent}>
          <CategoryBar activeFilter={activeFilter} onSelectCategory={setActiveFilter} />
        </ScrollView>
      </View>

      {/* 🎨 Grid ảnh */}
      <FlatList
        data={filteredSvgFiles}
        numColumns={2}
        keyExtractor={(item) => item}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.imageBox} onPress={() => handleImagePress(item)}>
            <View style={styles.imageFrameWrapper}>
              <ImgFrame width={width * 0.42} height={width * 0.42} />
              <View style={styles.svgWrapper}>
                {/* ⭐ Render từ cache - instant! */}
                {svgCache[item] && (
                  <SvgXml 
                    xml={svgCache[item]} 
                    width={width * 0.35} 
                    height={width * 0.35} 
                  />
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default MemoryColoringScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B3E5FC',
  },

  // 🎨 Loading Screen
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    fontFamily: 'Nunito-Bold',
  },

  // 🌸 Header
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  headerContent: {
    position: 'absolute',
    top: 55,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFF',
    fontFamily: 'Nunito-Black',
  },
  subtitle: {
    fontSize: 14,
    color: '#FFE3EE',
    fontWeight: '600',
  },
  backBtn: {
    position: 'absolute',
    left: 25,
    top: 10,
  },

  // 🧩 Category Scroll
  categoryScroll: {
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  categoryScrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 10,
  },

  // 🖼️ Grid ảnh
  row: {
    justifyContent: 'space-between',
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 80,
    paddingTop: 10,
  },
  imageBox: {
    width: width * 0.42,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  imageFrameWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  svgWrapper: {
    position: 'absolute',
    zIndex: 2,
  },
});