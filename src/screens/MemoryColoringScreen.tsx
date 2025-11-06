import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Dimensions, Text, ScrollView } from 'react-native';
import { SvgUri } from 'react-native-svg';
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

  // 🧩 Lọc ảnh offline theo category
  const svgFiles = useLocalSvgFiles()
    .filter(uri => uri.includes('_uncolored'))
    .filter(uri => {
      if (activeFilter === 'all') return true;
      const match = uri.match(/\/([a-zA-Z]+)_/);
      if (!match) return false;
      const categoryFromFile = match[1].toLowerCase();
      const variants = [categoryFromFile, categoryFromFile + 's', categoryFromFile.replace(/s$/, '')];
      return variants.includes(activeFilter.toLowerCase());
    });

  const handleImagePress = (svgUri: string) => {
    navigation.navigate('ColoringScreen', { svgUri });
  };

  return (
    <View style={styles.container}>
      {/* 🌈 Background */}
      <Loading_BG width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={StyleSheet.absoluteFill} />

      {/* 🩷 Header */}
      <View style={styles.header}>
        <HeaderFrame width="100%" height={150} preserveAspectRatio="xMidYMid slice" />
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backBtn}>
            <Return />
          </TouchableOpacity>
          <Text style={styles.title}>Tô màu trí nhớ</Text>
          <Text style={styles.subtitle}>Giúp trẻ nâng cao khả năng ghi nhớ</Text>
        </View>
      </View>

      {/* 🩷 Category Scroll Bar */}
      <View style={styles.categoryScroll}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScrollContent}>
          <CategoryBar activeFilter={activeFilter} onSelectCategory={setActiveFilter} />
        </ScrollView>
      </View>

      {/* 🎨 Grid ảnh */}
      <FlatList
        data={svgFiles}
        numColumns={2}
        keyExtractor={(item) => item}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.imageBox} onPress={() => handleImagePress(item)}>
            <View style={styles.imageFrameWrapper}>
              <ImgFrame width={width * 0.42} height={width * 0.42} />
              <SvgUri uri={item} width={width * 0.35} height={width * 0.35} style={styles.svg} />
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
  svg: {
    position: 'absolute',
    zIndex: 2,
  },
  imageLabel: {
    marginTop: 6,
    color: '#FA477C',
    fontWeight: '800',
    fontSize: 15,
    textAlign: 'center',
  },
});
