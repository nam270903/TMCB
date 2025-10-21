import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import MainBtn from '../assets/svg_img/MainBtn.svg';
import SettingBtn from '../assets/svg_img/SettingBtn.svg';
import GalleryBtn from '../assets/svg_img/GalleryBtn.svg';

const BottomNav = () => {
  return (
    <View style={styles.bottomNavigatorContainer}>
      {Platform.OS === 'ios' ? (
        <BlurView
          style={styles.bottomNavigatorBlur}
          blurType='light' 
          blurAmount={20}
          reducedTransparencyFallbackColor="rgba(255, 255, 255, 0.5)">
          <View style={styles.bottomNavigatorContent}>
            
            <TouchableOpacity>
              <MainBtn/>
            </TouchableOpacity>

            <TouchableOpacity>
              <GalleryBtn />
            </TouchableOpacity>

            <TouchableOpacity>
              <SettingBtn />
            </TouchableOpacity>

          </View>
        </BlurView>
      ) : (
        <View style={styles.androidFallback}>
          <View style={styles.bottomNavigatorContent}>
            <TouchableOpacity>
              <MainBtn />
            </TouchableOpacity>
            <TouchableOpacity>
              <GalleryBtn />
            </TouchableOpacity>
            <TouchableOpacity>
              <SettingBtn />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default BottomNav;

const styles = StyleSheet.create({
  bottomNavigatorContainer: {
    position: 'absolute',
    bottom: 50,
    width: '85%',
    alignSelf: 'center',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#FFE8B9',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
  },

  bottomNavigatorBlur: {
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.5)', 
  },

  androidFallback: {
    width: '100%',
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    overflow: 'hidden',
  },

  bottomNavigatorContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 26,
  },
});
