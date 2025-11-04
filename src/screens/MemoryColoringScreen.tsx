import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { useLocalSvgFiles } from '../hooks/useLocalSvgFiles';

// Assets
import Loading_BG from '../assets/svg_img/Loading_BG.svg';
import ImgFrame from '../assets/svg_img/Img_frame.svg';
import HeaderFrame from '../assets/svg_img/Header_Frame.svg';

// Components
import CategoryBar from '../components/CategoryBar';
import Return from '../components/Return';

const { width } = Dimensions.get('window');

const MemoryColoringScreen = () => {
  const svgFiles = useLocalSvgFiles().filter(uri => uri.includes('_uncolored'));
  const navigation = useNavigation<any>();

  const handleImagePress = (svgUri: string) => {
    navigation.navigate('ColoringScreen', { svgUri });
  };

  return (
    <View style={styles.container}>
      {/* Background */}
      <Loading_BG width="100%" height="100%" 
        preserveAspectRatio="xMidYMid slice" 
        style={StyleSheet.absoluteFill}/>

      {/* Header */}
      <View style={styles.headerWrapper}>
        <HeaderFrame width="100%" height={150} preserveAspectRatio="xMidYMid slice" />
        <View style={styles.returnWrapper}>
          <Return />
        </View>
      </View>

      {/* Category Bar
      <View style={styles.categoryWrapper}>
        <CategoryBar />
      </View> */}

      {/* Image Grid */}
      <FlatList
        data={svgFiles}
        numColumns={2}
        columnWrapperStyle={styles.row}
        keyExtractor={(item) => item}
        style={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.imageContainer}
            onPress={() => handleImagePress(item)}>

            <ImgFrame width={width * 0.4} height={width * 0.4} style={styles.frame} />

            <SvgUri
              uri={item}
              width={width * 0.3}
              height={width * 0.4}
              style={styles.svg}/>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}/>

    </View>
  );
};

export default MemoryColoringScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B3E5FC',
  },

  headerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  returnWrapper: {
    position: 'absolute',
    left: 16,
    top: 50,
  },

  categoryWrapper: {
    marginTop: -10,
    marginBottom: 10,
    zIndex: 10,
  },
  list: {
    flex: 1,
    gap: 12,
  },

  listContainer: {
    paddingHorizontal: 24,
    paddingBottom: 60,
    paddingTop: 15, 
  },

  row: {
    justifyContent: 'space-between',
  },

  imageContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },

  frame: {
    position: 'absolute',
    zIndex: 1,
  },

  svg: {
    zIndex: 2,
    marginTop: 8,
  },
});
