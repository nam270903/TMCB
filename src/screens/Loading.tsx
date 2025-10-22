import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { useSvgCache } from '../hooks/useSvgCache';

// Import SVG assets
import Loading_BG from '../assets/svg_img/Loading_BG.svg';
import Crayon from '../assets/svg_img/Crayon.svg';
import Logo from '../assets/svg_img/Logo.svg';

const ZIGZAG_POINTS = [
  { x: 0, y: 100 },
  { x: 60, y: 70 },
  { x: 120, y: 100 },
  { x: 180, y: 70 },
  { x: 240, y: 100 },
  { x: 300, y: 70 },
];

const MIN_LOADING_TIME = 5000;
const ANIMATION_DURATION = 400;

export default function LoadingScreen({ navigation }:any) {
  const { progress, isDone } = useSvgCache();
  const moveX = useRef(new Animated.Value(0)).current;
  const moveY = useRef(new Animated.Value(0)).current;
  const [minTimePassed, setMinTimePassed] = useState(false);

  // Generate zigzag SVG path
  const zigzagPath = ZIGZAG_POINTS.reduce((path, point, index) => {
    const command = index === 0 ? `M ${point.x} ${point.y}` : ` L ${point.x} ${point.y}`;
    return path + command;
  }, '');

  // Animate crayon along zigzag path
  const runZigzagAnimation = () => {
    const animations = ZIGZAG_POINTS.map((point) =>
      Animated.parallel([
        Animated.timing(moveX, {
          toValue: point.x,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),

        Animated.timing(moveY, {
          toValue: point.y,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
      ])
    );

    Animated.loop(
      Animated.sequence([
        Animated.sequence(animations),
        Animated.sequence([...animations].reverse()),
      ])
    ).start();
  };

  // Start animation on mount
  useEffect(() => {
    runZigzagAnimation();
  }, []);

  // Ensure minimum loading time
  useEffect(() => {
    const timer = setTimeout(() => setMinTimePassed(true), MIN_LOADING_TIME);
    return () => clearTimeout(timer);
  }, []);

  // Navigate when loading complete
  useEffect(() => {
    if (isDone && minTimePassed) {
      navigation.replace('MainScreen');
    }
  }, [isDone, minTimePassed]);

  return (
    <View style={styles.container}>
      {/* Background */}
      <Loading_BG
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        style={StyleSheet.absoluteFill} />

      {/* Headers  */}
      <Logo style={styles.header} />


      {/* Zigzag path with animated crayon */}
      <View style={styles.pathWrapper}>
        <Svg width={305} height={155}>
          <Path
            d={zigzagPath}
            stroke="#FF9800"
            strokeWidth={3}
            strokeDasharray="10,6"
            fill="none"/>
        </Svg>

        <Animated.View
          style={[
            styles.crayonContainer,
            {
              transform: [
                { translateX: moveX },
                { translateY: moveY },
                { rotate: '-15deg' },
              ],
            },
          ]}
        >
          <Crayon width={100} height={100} />
        </Animated.View>
      </View>

      {/* Progress percentage */}
      <Text style={styles.percentText}>{Math.round(progress)}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    position: 'absolute',
    top: 150,
    width: 150,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },

  pathWrapper: {
    position: 'absolute',
    top: '52%',
    width: 305,
    height: 155,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crayonContainer: {
    position: 'absolute',
    zIndex: 10,
    top: -92,
    left: -49,
  },
  percentText: {
    position: 'absolute',
    top: '65%',
    fontSize: 20,
    fontWeight: '700',
    color: '#FF9800',
    textShadowColor: 'rgba(255,255,255,0.9)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
});