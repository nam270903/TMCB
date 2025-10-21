import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Loading_BG from '../assets/svg_img/Loading_BG.svg';
import Return from '../components/Return.tsx';

interface MemoryColoringScreenProps {}

const MemoryColoringScreen = (props: MemoryColoringScreenProps) => {
  return (
    <View style={styles.container}>
        {/* Background */}
        <Loading_BG 
          width="100%" 
          height="100%" 
          preserveAspectRatio="xMidYMid slice"
          style={styles.background} />

        {/* Header */}
        <View style={styles.returnBtn}>
        <Return />
        </View>
    </View>
  );
};

export default MemoryColoringScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background:{
    position: 'absolute',
    zIndex: -1,
  },
  returnBtn: {  
    marginTop: 50,
    marginLeft: 20,
  },
});
