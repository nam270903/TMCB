import React, { useRef, useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Modal, Dimensions } from 'react-native';
import { Svg, Path, G } from 'react-native-svg';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import ViewShot from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import { SvgXml } from 'react-native-svg';

import { useRoute, useNavigation } from '@react-navigation/native';
import { useInteractiveSvg } from '../hooks/useInteractiveSvg';
import { useColorPalette } from '../hooks/useColorPalette';
import CrayonPalette from '../components/CrayonPalette';
import SubmitBar from '../components/SubmitBar';
import HeaderColoring from '../assets/svg_img/HeaderColoring.svg';
import ReturnWithBackground from '../assets/svg_img/ReturnWithBackground.svg';
import ImgFrame from '../assets/svg_img/Img_frame.svg';
import HomeBtn from '../assets/svg_img/HomeBtn.svg';
import ZoomIn from '../assets/svg_img/ZoomIn.svg';
import ZoomOut from '../assets/svg_img/ZoomOut.svg';
import Erase from '../assets/svg_img/Erase.svg';
import Delete from '../assets/svg_img/Delete.svg';
import TimerCountDown from '../components/TimerCountDown';

const { width } = Dimensions.get('window');

/** 🧩 Component đọc SVG cục bộ cross-platform */
const LocalSvg = ({ path, width, height }: { path: string; width: number; height: number }) => {
  const [xml, setXml] = useState<string | null>(null);

  useEffect(() => {
    const loadSvg = async () => {
      try {
        const normalized = path.startsWith('file://') ? path.replace('file://', '') : path;
        const content = await RNFS.readFile(normalized, 'utf8');
        setXml(content);
      } catch (err) {
        console.error('❌ Lỗi đọc SVG:', err);
      }
    };
    loadSvg();
  }, [path]);

  if (!xml) return null;
  return <SvgXml xml={xml} width={width} height={height} />;
};

const ColoringScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { svgUri } = route.params;

  const [isSampleVisible, setSampleVisible] = useState(false);

  // 🩷 Tạo đường dẫn SVG mẫu (colored)
  const coloredUri = svgUri.replace('_uncolored', '_colored');

  // 🖍️ Hook màu sắc
  const { colors, selectedColor, setSelectedColor } = useColorPalette(coloredUri);
  const { paths, fillPath } = useInteractiveSvg(svgUri);

  const viewShotRef = useRef<ViewShot>(null);

  // 🎚️ Zoom / Pan gesture
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = Math.max(1, Math.min(savedScale.value * event.scale, 4));
    })
    .onEnd(() => {
      savedScale.value = scale.value;
      if (scale.value < 1) {
        scale.value = withSpring(1);
        savedScale.value = 1;
      }
    });

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (scale.value > 1) {
        translateX.value = savedTranslateX.value + event.translationX;
        translateY.value = savedTranslateY.value + event.translationY;
      }
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  // 🎨 Chọn màu
  const handleSelect = (color: string | null) => {
    if (selectedColor === color) setSelectedColor(null);
    else setSelectedColor(color);
  };

  const zoomIn = () => {
    const newScale = Math.min(scale.value + 0.5, 4);
    scale.value = withSpring(newScale);
    savedScale.value = newScale;
  };

  const zoomOut = () => {
    const newScale = Math.max(scale.value - 0.5, 1);
    scale.value = withSpring(newScale);
    savedScale.value = newScale;
    if (newScale === 1) {
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      savedTranslateX.value = 0;
      savedTranslateY.value = 0;
    }
  };

  const handleReturnPress = () => navigation.goBack();

  // 📸 Capture user painting
  const handleSubmit = async () => {
    try {
      if (!viewShotRef.current) return;
      const uri = await viewShotRef.current.capture?.();
      if (!uri) return;
      console.log('🎨 Ảnh người dùng tô:', uri);
      navigation.navigate('CompleteScreen', {
        userImage: uri,
        userPaths: paths,
        coloredUri,
      });
    } catch (error) {
      console.error('Lỗi khi chụp ảnh:', error);
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        {/* 🩵 HEADER */}
        <View style={styles.headerWrapper}>
          <HeaderColoring width="100%" height="15%" style={StyleSheet.absoluteFill} />
          <TouchableOpacity onPress={handleReturnPress} style={styles.returnWrapper}>
            <ReturnWithBackground width={42} height={40} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('MainScreen')} style={styles.homeWrapper}>
            <HomeBtn width={42} height={40} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSampleVisible(true)} style={styles.sampleThumbnail}>
            <ImgFrame width={55} height={55} style={styles.frame} />
            <LocalSvg path={coloredUri} width={45} height={45} />
          </TouchableOpacity>
        </View>

        {/* 🩷 SAMPLE MODAL */}
        <Modal transparent animationType="fade" visible={isSampleVisible} onRequestClose={() => setSampleVisible(false)}>
          <View style={styles.overlay}>
            <TouchableOpacity style={styles.overlayBackground} onPress={() => setSampleVisible(false)} />
            <View style={styles.modalContent}>
              <View style={styles.sampleContainer}>
                <ImgFrame width={width * 0.8} height={width * 0.8} style={styles.frame} />
                <LocalSvg path={coloredUri} width={width * 0.7} height={width * 0.7} />
              </View>
            </View>
          </View>
        </Modal>

        {/* 🖌️ COLORING CANVAS */}
        <View style={styles.svgWrapper}>
          <GestureDetector gesture={composedGesture}>
            <Animated.View style={animatedStyle}>
              <ViewShot
                ref={viewShotRef}
                options={{ format: 'png', quality: 1, result: 'tmpfile' }}
                style={{ backgroundColor: 'white' }}
              >
                <Svg width={width} height={width} viewBox="0 0 348 348">
                  {paths.map((p) => (
                    <G key={p.id}>
                      <Path
                        d={p.d}
                        fill={p.fill}
                        stroke="#000"
                        strokeWidth={0.3}
                        onPressIn={() => {
                          if (!selectedColor) return;
                          fillPath(p.id, selectedColor);
                        }}
                      />
                    </G>
                  ))}
                </Svg>
              </ViewShot>
            </Animated.View>
          </GestureDetector>
        </View>

        {/* ⏱️ TIMER + TOOLS */}
        <View style={styles.timerAndToolsBar}>
          <View style={styles.timerWrapper}>
            <TimerCountDown initialMinutes={10} />
          </View>
          <View style={styles.toolsWrapper}>
            <TouchableOpacity onPress={zoomIn}><ZoomIn width={40} height={40} /></TouchableOpacity>
            <TouchableOpacity onPress={zoomOut}><ZoomOut width={40} height={40} /></TouchableOpacity>
            <TouchableOpacity onPress={() => setSelectedColor('white')}><Erase width={40} height={40} /></TouchableOpacity>
            <TouchableOpacity onPress={() => paths.forEach((p) => fillPath(p.id, 'white'))}><Delete width={40} height={40} /></TouchableOpacity>
          </View>
        </View>

        {/* 🎨 COLOR PALETTE */}
        <View style={styles.colorBar}>
          <CrayonPalette colors={colors} selectedColor={selectedColor} onSelect={handleSelect} />
        </View>

        {/* ✅ SUBMIT BAR */}
        <SubmitBar onSubmit={handleSubmit} />
      </View>
    </GestureHandlerRootView>
  );
};

export default ColoringScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  svgWrapper: { alignItems: 'center', justifyContent: 'center', marginTop: 200, overflow: 'hidden' },
  headerWrapper: { position: 'absolute', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  returnWrapper: { position: 'absolute', left: 30, top: 65 },
  homeWrapper: { position: 'absolute', right: 60, top: 65 },
  sampleThumbnail: { position: 'absolute', top: 60, alignSelf: 'center', justifyContent: 'center', alignItems: 'center' },
  frame: { position: 'absolute' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  overlayBackground: { ...StyleSheet.absoluteFill },
  modalContent: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  sampleContainer: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  timerAndToolsBar: {
    position: 'absolute',
    top: 130,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  timerWrapper: { justifyContent: 'center', alignItems: 'center' },
  toolsWrapper: { flexDirection: 'row', alignItems: 'center', gap: 10 },
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
});
