import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import SubmitBar from '../components/SubmitBar';
import { calculateScoreByPaths, PathData } from '../utils/scoreUtils';
import { getPathsFromSvg } from '../utils/parseSvg';
import HeaderFrame from '../assets/svg_img/Header_Frame.svg';
import HomeBtn from '../assets/svg_img/HomeBtn.svg';
import RedoBtn from '../components/RedoBtn';
import ImgFrame from '../assets/svg_img/Img_frame.svg';

const CompleteScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { userImage, userPaths, coloredUri } = route.params;

  const [loading, setLoading] = useState(true);
  const [scoreData, setScoreData] = useState<{ score: number; message: string } | null>(null);

  useEffect(() => {
    const runScoring = async () => {
      try {
        const samplePaths: PathData[] = await getPathsFromSvg(coloredUri);
        if (!samplePaths.length || !userPaths?.length) {
          setScoreData({ score: 0, message: 'Chưa có dữ liệu để chấm điểm.' });
          return;
        }
        const result = calculateScoreByPaths(userPaths, samplePaths);
        setScoreData(result);
      } catch (e) {
        console.error('⚠️ Lỗi khi chấm điểm:', e);
      } finally {
        setLoading(false);
      }
    };
    runScoring();
  }, []);

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerWrapper}>
        <HeaderFrame 
          width="100%" 
          height={150} 
          preserveAspectRatio="xMidYMid slice" 
          style={styles.headerBg}
        />
        
        {/* Safe area cho status bar */}
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation.navigate('MainScreen')}
            style={styles.homeBtn}
          >
            <HomeBtn width={50} height={50} />
          </TouchableOpacity>
          
          <View style={styles.headerTextBox}>
            <Text style={styles.headerTitle}>Tadaa!</Text>
            <Text style={styles.headerSubtitle}>Bé đã hoàn thành bức tranh rất đẹp!</Text>
          </View>
        </View>
      </View>

      {/* CONTENT */}
      <View style={styles.content}>
        {/* IMAGE */}
        <View style={styles.imageWrapper}>
          <ImgFrame 
            width={340} 
            height={340} 
            style={styles.frame} 
          />
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: userImage }} 
              style={styles.image} 
              resizeMode="cover" 
            />
          </View>
        </View>

        {/* SCORE */}
        {scoreData && (
          <View style={styles.scoreSection}>
            <Text style={styles.scoreText}>{scoreData.score}/10</Text>
            <Text style={styles.scoreTitle}>{getTitle(scoreData.score)}</Text>
            <Text style={styles.scoreMessage}>{scoreData.message}</Text>
          </View>
        )}

        {/* REDO BUTTON */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.redoButton}
          activeOpacity={0.8}
        >
          <View style={styles.redoIconWrapper}>
            <RedoBtn width={32} height={32} />
          </View>
          <Text style={styles.redoText}>Tô màu lại</Text>
        </TouchableOpacity>
      </View>

      {/* SUBMIT BAR */}
      <SubmitBar isComplete={true} userImage={userImage} />
    </View>
  );
};

export default CompleteScreen;

const getTitle = (score: number) => {
  if (score >= 9) return 'Tuyệt tác gần hoàn thành!';
  if (score >= 7) return 'Bức tranh rất tuyệt vời!';
  if (score >= 5) return 'Giỏi lắm! Sắp đạt rồi!';
  return 'Thử lại lần nữa nào!';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8FB',
  },

  // Header
  headerWrapper: {
    width: '100%',
    height: Platform.OS === 'ios' ? 180 : 160,
    position: 'relative',
  },

  headerBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,

  },

  headerContent: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 70,
  },

  headerTextBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  homeBtn: {
    position: 'absolute',
    right: 15,
    paddingTop: Platform.OS === 'ios' ? 50 : 50,
    top: Platform.OS === 'ios' ? 10 : 15,
    zIndex: 1,
  },

  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    fontFamily: 'Nunito-VariableFont_wght',
  },

  headerSubtitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
    fontFamily: 'Nunito-VariableFont_wght',
  },

  // Content
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },

  // Image
  imageWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 20,
    // Thêm transform để nghiêng nhẹ
    transform: [{ rotate: '-5deg' }],
  },

  frame: {
    position: 'absolute',
  },

  imageContainer: {
    width: 280,
    height: 280,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFF',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  // Score
  scoreSection: {
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 30,
  },

  scoreText: {
    fontSize: 64,
    color: '#FA477C',
    fontWeight: '900',
    fontFamily: 'Nunito-VariableFont_wght',
    lineHeight: 70,
  },

  scoreTitle: {
    fontSize: 20,
    color: '#FA477C',
    fontWeight: '800',
    marginTop: 4,
    fontFamily: 'Nunito-VariableFont_wght',
  },

  scoreMessage: {
    fontSize: 14,
    color: '#FA477C',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
    fontFamily: 'Nunito-VariableFont_wght',
  },

  // Redo Button
  redoButton: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },

  redoIconWrapper: {
    width: 64,
    height: 64,
    backgroundColor: '#FFB6C1',
    alignItems: 'center',
    justifyContent: 'center',
  },

  redoText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '700',
    color: '#FA477C',
    fontFamily: 'Nunito-VariableFont_wght',
  },
});