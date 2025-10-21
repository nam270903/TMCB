import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import Loading_BG from '../assets/svg_img/Loading_BG.svg';
import Header from '../assets/svg_img/Header.svg';
import PinkButton from '../components/PinkButton';
import BottomNav from '../components/BottomNav';
import { useNavigation } from '@react-navigation/native';

const MainScreen = () => {
  
  const navigation = useNavigation<any>();

  const handleMemoryColoring = () => {
    navigation.navigate('MemoryColoringScreen');
  }

  return (
    <View style={styles.container}>
      {/* Background */}
      <Loading_BG 
        width="100%" 
        height="100%" 
        preserveAspectRatio="xMidYMid slice"
        style={styles.background} />

      {/* Header */}
      <Header 
        width="100%"
        style={styles.header}/>

      {/* Tabs Menu */}
      <View style={styles.tabs}>
        <TouchableOpacity onPress={handleMemoryColoring} >
          <PinkButton label="Tô màu trí nhớ" /> 
        </TouchableOpacity>

        <PinkButton label="Tô màu động" /> 

        <PinkButton label="Tô màu tự do" />
      </View>

      {/* Bottom Navigator */}
      <View style={styles.bottomNavigator}>
       <BottomNav/> 
      </View>

    </View>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    position: 'absolute',
    zIndex: -1,
  },
  header: {
    position: 'absolute',
    top: 60,
  },
  tabs: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,  
  },
  bottomNavigator: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    alignItems: 'center',
  },
});
