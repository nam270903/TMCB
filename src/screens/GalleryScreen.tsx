import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading_BG from '../assets/svg_img/Loading_BG.svg';
import HeaderFrame from '../assets/svg_img/Header_Frame.svg';
import ImgFrame from '../assets/svg_img/Img_frame.svg';
import Return from '../components/Return';
import BottomNav from '../components/BottomNav';


interface SavedImage {
  uri: string;
  date: number;
}

const GalleryScreen = () => {
  const [images, setImages] = React.useState<SavedImage[]>([]);

  React.useEffect(() => {
    const loadGallery = async () => {
      try {
        const data = await AsyncStorage.getItem('app_gallery');
        if (data) setImages(JSON.parse(data));
      } catch (error) {
        console.error('Lỗi khi đọc gallery:', error);
      }
    };
    loadGallery();
  }, []);

  if (images.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        
        <Text style={styles.emptyText}>📁 Chưa có tranh nào được lưu</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Background */}
      <Loading_BG
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={styles.headerWrapper}>
        <HeaderFrame width="100%" height={150} preserveAspectRatio="xMidYMid meet" />
        <View style={styles.returnWrapper}>
          <Return />
        </View>
      </View>

      {/* Gallery list */}
      <FlatList
        data={images}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.frameWrapper}>
            <ImgFrame width={200} height={185} style={styles.frameSvg} />
            <Image
              source={{ uri: item.uri }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        )}
      />

      <View style={styles.bottomNavigator}>
        <BottomNav />
      </View>
    </View>
  );
};

export default GalleryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B3E5FC',
  },

  headerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  returnWrapper: {
    position: 'absolute',
    left: 16,
    top: 70,
  },

  listContainer: {
    paddingHorizontal: 12,
    paddingBottom: 30,
    justifyContent: 'center',
  },

  frameWrapper: {
    width: 180,
    height: 180,
    margin: 6,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  frameSvg: {
    position: 'absolute',
  },

  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
    zIndex: 2,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },

  emptyText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '500',
  },

  bottomNavigator: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    alignItems: 'center',
  },
});
