import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Loading_BG from '../assets/Loading_BG.svg';
import Header from '../assets/Header.svg';
import PinkButton from '../components/PinkButton';

const MainScreen = () => {
  return (
    <View style={styles.container}>
      {/* Background */}
      <Loading_BG 
        width="100%" 
        height="100%" 
        preserveAspectRatio="xMidYMid slice"
        style={styles.background} 
      />

      {/* Header */}
      <Header 
        width="100%"
        style={styles.header}
      />

      {/* Tabs Menu */}
      <View style={styles.tabs}>
        <PinkButton label="Tô màu trí nhớ" /> 
        <PinkButton label="Tô màu động" /> 
        <PinkButton label="Tô màu tự do" />
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
    top: 40,
  },
  tabs: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,  
  },
});
