import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import PinkBtn from '../assets/PinkBtn.svg';

interface PinkButtonProps {
  label: string;
  onPress?: () => void;
}

const PinkButton: React.FC<PinkButtonProps> = ({ label, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <View style={styles.container}>
        {/* SVG nền */}
        <PinkBtn width="100%" height="100%" style={styles.svg} />

        {/* Text ở giữa */}
        <Text style={styles.label}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default PinkButton;

const styles = StyleSheet.create({
  container: {
    width: 300,       // đúng theo kích thước Figma
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  label: {
    fontFamily: 'Nunito-VariableFont_wght',
    fontSize: 28,
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(116, 0, 70, 0.25)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    fontWeight: '900',
    lineHeight: 32,
  },
});
