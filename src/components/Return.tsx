import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import ReturnBtn from '../assets/svg_img/Return.svg';
import { useNavigation } from '@react-navigation/native';

const Return = () => {
  const navigation = useNavigation<any>();
  
  const handleReturn = () => {
    navigation.goBack();
  }

  return (
    <TouchableOpacity onPress={handleReturn} style={styles.container}>
      <ReturnBtn />
    </TouchableOpacity>
  );
};

export default Return;

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
  }
});
