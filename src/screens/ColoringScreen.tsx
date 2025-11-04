import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Modal, Dimensions } from 'react-native';
import { Svg, Path, SvgUri, G } from 'react-native-svg';

// Hooks
import { useRoute, useNavigation } from '@react-navigation/native';
import { useInteractiveSvg } from '../hooks/useInteractiveSvg';
import { useColorPalette } from '../hooks/useColorPalette';

// Components
import CrayonPalette from '../components/CrayonPalette';

// SVG assets
import HeaderColoring from '../assets/svg_img/HeaderColoring.svg';
import ReturnWithBackground from '../assets/svg_img/ReturnWithBackground.svg';
import ImgFrame from '../assets/svg_img/Img_frame.svg';

const { width } = Dimensions.get('window');

const ColoringScreen = () => {
  // Navigation setup
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { svgUri } = route.params;

  // Modal state for sample image preview
  const [isSampleVisible, setSampleVisible] = useState(false);

  // Generate colored reference image URI
  const coloredUri = svgUri.replace('_uncolored', '_colored');

  // Custom hooks for color palette and interactive SVG
  const { colors, selectedColor, setSelectedColor } = useColorPalette(coloredUri);
  const { paths, fillPath } = useInteractiveSvg(svgUri);

  // Navigation handler
  const handleReturnPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* ==================== HEADER SECTION ==================== */}
      <View style={styles.headerWrapper}>
        {/* Header background */}
        <HeaderColoring
          width="100%"
          height="15%"
          preserveAspectRatio="xMidYMid slice"
          style={StyleSheet.absoluteFill}
        />

        {/* Back button */}
        <TouchableOpacity onPress={handleReturnPress} style={styles.returnWrapper}>
          <ReturnWithBackground
            width={42}
            height={40}
            preserveAspectRatio="xMidYMid slice"
            style={StyleSheet.absoluteFill}
          />
        </TouchableOpacity>

        {/* Sample thumbnail - opens modal with full reference image */}
        <TouchableOpacity
          onPress={() => setSampleVisible(true)}
          style={styles.sampleThumbnail}
        >
          <ImgFrame width={55} height={55} style={styles.frame} />
          <SvgUri uri={coloredUri} width={45} height={45} />
        </TouchableOpacity>
      </View>

      {/* ==================== SAMPLE IMAGE MODAL ==================== */}
      <Modal
        transparent
        animationType="fade"
        visible={isSampleVisible}
        onRequestClose={() => setSampleVisible(false)}
      >
        <View style={styles.overlay}>
          {/* Touchable overlay to close modal */}
          <TouchableOpacity
            style={styles.overlayBackground}
            onPress={() => setSampleVisible(false)}
          />

          {/* Modal content with enlarged reference image */}
          <View style={styles.modalContent}>
            <View style={styles.sampleContainer}>
              <ImgFrame
                width={width * 0.8}
                height={width * 0.8}
                style={styles.frame}
              />
              <SvgUri
                uri={coloredUri}
                width={width * 0.7}
                height={width * 0.7}
                style={styles.svg}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* ==================== COLORING CANVAS ==================== */}
      <View style={styles.svgWrapper}>
        <Svg
          pointerEvents="box-none"
          width={width}
          height={width}
          viewBox="0 0 348 348"
        >
          {paths.map((p) => (
            <G key={p.id}>
              <Path
                d={p.d}
                // Visual debug: white fills shown as light red for visibility
                fill={p.fill === 'white' ? 'red' : p.fill}
                stroke="#000"
                strokeWidth={0.3}
                // Fill path on tap with selected color
                onPressIn={() => {
                  console.log(`Filling path ${p.id} with ${selectedColor}`);
                  fillPath(p.id, selectedColor);
                }}
                pointerEvents="auto"
              />
            </G>
          ))}
        </Svg>
      </View>

      {/* ==================== COLOR PALETTE ==================== */}
      <View style={styles.colorBar}>
        <CrayonPalette
          colors={colors}
          selectedColor={selectedColor}
          onSelect={setSelectedColor}/>

      {/* ====================  ==================== */}

      </View>
    </View>
  );
};

export default ColoringScreen;

// ==================== STYLES ====================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },

  // SVG canvas wrapper
  svgWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 150,
  },

  // Bottom color selection bar
  colorBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#FCE4EC',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingVertical: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  // Header section
  headerWrapper: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Back button positioning
  returnWrapper: {
    position: 'absolute',
    left: 30,
    top: 60,
  },

  // Sample thumbnail positioning
  sampleThumbnail: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Frame decoration for images
  frame: {
    position: 'absolute',
  },

  // Modal overlay
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Overlay touchable background
  overlayBackground: {
    ...StyleSheet.absoluteFill,
  },

  // Modal content centering
  modalContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },

  // Sample image container in modal
  sampleContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // SVG positioning in modal
  svg: {
    position: 'absolute',
    zIndex: 2,
  },
});