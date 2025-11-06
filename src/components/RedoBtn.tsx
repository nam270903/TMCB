import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import RedoBtn from '../assets/svg_img/RedoBtn.svg';

interface RedoBtnProps {}

const Redo = (props: RedoBtnProps) => {
  return (
    <TouchableOpacity style={styles.container}>
        <RedoBtn width={50} height={50} />
    </TouchableOpacity>
  );
};

export default RedoBtn;

const styles = StyleSheet.create({
  container: {}
});
