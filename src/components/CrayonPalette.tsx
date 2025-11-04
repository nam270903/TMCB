import React from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import Crayon from './Crayon';
import { ColorItem } from '../hooks/useColorPalette';

interface CrayonPaletteProps {
  colors: ColorItem[];
  selectedColor: string;
  onSelect: (color: string) => void;
}

const CrayonPalette: React.FC<CrayonPaletteProps> = ({
  colors,
  selectedColor,
  onSelect,
}) => {
  // Limit to first 12 colors
  const displayedColors = colors.slice(0, 12);

  return (
    <View style={styles.container}>
      {displayedColors.map((item, index) => {
        const isSelected = selectedColor === item.color;

        return (
          <TouchableOpacity
            key={item.id || index}
            onPress={() => onSelect(item.color)}
            style={styles.buttonWrapper}            
            >
            <Animated.View
              style={[
                styles.crayonWrapper,
                isSelected && styles.selectedCrayonWrapper,]}>
              <Crayon color={item.color}/>
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CrayonPalette;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    backgroundColor: '#FFE6F0',
    paddingVertical: 10,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
buttonWrapper: {
  marginHorizontal: -22, 
  left: 18,
  padding: 0,
  alignItems: 'center',
  justifyContent: 'flex-end',
  //For testing purposes
  // backgroundColor: 'red', 
  // borderWidth: 1,
},
crayonWrapper: {
  transform: [{ translateY: 0 }],
  padding: 0,
  margin: 0,
},
  selectedCrayonWrapper: {
    transform: [{ translateY: -40 }],
  },
});
