import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import TimerBorder from '../assets/svg_img/TimerBorder.svg';

interface TimerCountDownProps {
  initialMinutes?: number; 
  onFinish?: () => void;
}

const TimerCountDown = ({ initialMinutes = 10, onFinish }: TimerCountDownProps) => {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60); // tính theo giây

  useEffect(() => {
    if (timeLeft <= 0) {
      if (onFinish) onFinish();
      return; 
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format mm:ss
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;

  return (
    <View style={styles.container}>
      <TimerBorder width={120} height={80} />
      {/* Timer Text */}
      <View style={styles.textWrapper}>
        <Text style={styles.text}>{formattedTime}</Text>
      </View>
    </View>
  );
};

export default TimerCountDown;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrapper: {
    position: 'absolute',
    top: 10,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF4081',
  },
});
