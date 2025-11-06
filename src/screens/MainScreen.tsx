import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CategoryBar from '../components/CategoryBar';
import Loading_BG from '../assets/svg_img/Loading_BG.svg';
import BottomNav from '../components/BottomNav';
import HeaderFrame from '../assets/svg_img/Header_Frame.svg';
import Logo from '../assets/svg_img/Logo.svg';

const MainScreen = () => {
  const navigation = useNavigation<any>();
  const [activeFilter, setActiveFilter] = useState('all');
  const [language, setLanguage] = useState<'VIE' | 'ENG'>('VIE');

  const handleSelectCategory = (category: string) => {
    setActiveFilter(category);
    navigation.navigate('MemoryColoringScreen', { filter: category });
  };

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'VIE' ? 'ENG' : 'VIE'));
  };

  return (
    <View style={styles.container}>
      {/* 🌤 Background */}
      <Loading_BG width="100%" height="100%" style={StyleSheet.absoluteFill} />

      {/* 🌈 Logo */}
      <View style={styles.logoWrapper}>
        <Logo width={220} height={80} />
      </View>

      {/* 🌍 Language Switch
      <TouchableOpacity style={styles.langToggle} onPress={toggleLanguage}>
        <View style={styles.langContainer}>
          <Text style={[styles.langText, language === 'VIE' && styles.langActive]}>VIE</Text>
          <Text style={styles.langDivider}>|</Text>
          <Text style={[styles.langText, language === 'ENG' && styles.langActive]}>ENG</Text>
        </View>
      </TouchableOpacity> */}

      {/* 🎀 Main Frame */}
      <View style={styles.mainFrame}>
        <View style={styles.innerFrame}>
          <Text style={styles.title}>CHỌN LĨNH VỰC</Text>
          <CategoryBar activeFilter={activeFilter} onSelectCategory={handleSelectCategory} />
        </View>
      </View>

      {/* 🧭 Bottom Navigation */}
      <BottomNav />
    </View>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B3E5FC',
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoWrapper: {
    position: 'absolute',
    top: 130,
    alignItems: 'center',
    zIndex: 2,
  },

  // langToggle: {
  //   position: 'absolute',
  //   top: 60,
  //   right: 20,
  //   backgroundColor: '#FFFFFF',
  //   borderRadius: 30,
  //   paddingHorizontal: 14,
  //   paddingVertical: 6,
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   elevation: 4,
  //   shadowColor: '#FA477C',
  //   shadowOpacity: 0.2,
  //   shadowRadius: 4,
  // },
  // langContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  // },
  // langText: {
  //   fontSize: 14,
  //   fontWeight: '800',
  //   color: '#FA477C',
  // },
  // langActive: {
  //   backgroundColor: '#FA477C',
  //   color: '#FFF',
  //   paddingHorizontal: 6,
  //   borderRadius: 12,
  // },
  // langDivider: {
  //   color: '#FA477C',
  //   fontWeight: '800',
  //   marginHorizontal: 5,
  // },

  mainFrame: {
    width: '85%',
    backgroundColor: '#FFEAF1',
    borderRadius: 40,
    borderWidth: 10,
    borderColor: '#FA477C',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 10,
    overflow: 'hidden',
  },

  headerFrameBg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },

  innerFrame: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    paddingBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FA477C',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Nunito-Black',
  },
});
