import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Platform, ActionSheetIOS, Alert } from 'react-native';
import SaveToGallery from '../assets/svg_img/SaveToGallery.svg';
import Share from '../assets/svg_img/Share.svg';
import SubmitButton from '../assets/svg_img/SubmitBtn.svg';
import { useNavigation } from '@react-navigation/native';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import ShareLib from 'react-native-share';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSvgFiles } from '../hooks/useLocalSvgFiles';

interface SubmitBarProps {
  isComplete?: boolean;
  userImage?: string;
  onSubmit?: () => void;
}

const SubmitBar = ({ isComplete = false, userImage, onSubmit }: SubmitBarProps) => {
  const navigation = useNavigation<any>();
  const svgFiles = useLocalSvgFiles();

  /** 🖼 Lưu ảnh user tô vào gallery của app */
  const handleSaveToAppGallery = async () => {
    if (!userImage) return;
    try {
      const existing = (await AsyncStorage.getItem('app_gallery')) || '[]';
      const list = JSON.parse(existing);
      const newList = [{ uri: userImage, date: Date.now() }, ...list];
      await AsyncStorage.setItem('app_gallery', JSON.stringify(newList));
      Alert.alert('✅ Đã lưu vào bộ sưu tập trong app!');
    } catch (error) {
      console.error('Lỗi khi lưu gallery:', error);
      Alert.alert('❌ Lỗi', 'Không thể lưu ảnh vào bộ sưu tập');
    }
  };

    /** 💾 Lưu vào thư viện máy */
    const handleSaveToDevice = async () => {
    if (!userImage) return;
    try {
        await CameraRoll.saveAsset(userImage, { type: 'photo' });
        Alert.alert('✅ Đã lưu vào thư viện máy!');
    } catch (error) {
        console.error('Lỗi lưu CameraRoll:', error);
        Alert.alert('❌ Lỗi', 'Không thể lưu ảnh. Vui lòng kiểm tra quyền truy cập thư viện.');
    }
    };

  /** 📤 Chia sẻ qua mạng xã hội */
  const handleShareSocial = async () => {
    if (!userImage) return;
    try {
      await ShareLib.open({
        url: userImage,
        message: 'Tôi vừa hoàn thành bức tranh này! 🎨',
      });
    } catch (err: any) {
      if (err?.message !== 'User did not share') {
        console.error('Lỗi chia sẻ:', err);
      }
    }
  };

  /** 💬 Hiển thị menu chia sẻ */
  const handleShare = async () => {
    if (!userImage) return;

    if (Platform.OS === 'ios') {
      const options = ['Lưu vào thư viện máy', 'Chia sẻ qua mạng xã hội', 'Hủy'];

      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: 'Chia sẻ ảnh',
          message: 'Chọn cách bạn muốn chia sẻ',
          options,
          cancelButtonIndex: 2,
        },
        async (buttonIndex) => {
          switch (buttonIndex) {
            case 0:
              await handleSaveToDevice();
              break;
            case 1:
              await handleShareSocial();
              break;
          }
        }
      );
    } else {
      Alert.alert('Chia sẻ ảnh', 'Chọn cách bạn muốn chia sẻ', [
        { text: 'Lưu vào thư viện máy', onPress: handleSaveToDevice },
        { text: 'Chia sẻ qua mạng xã hội', onPress: handleShareSocial },
        { text: 'Hủy', style: 'cancel' },
      ]);
    }
  };

  /** 🪄 Hoàn tất (màn tô màu) */
  const handleSubmit = async () => {
    if (onSubmit) return onSubmit();
    navigation.navigate('CompleteScreen', {});
  };

  /** 🔁 Tiếp tục tô ảnh mới ngẫu nhiên */
  const handleContinue = () => {
    const uncoloredFiles = svgFiles.filter((uri) => uri.includes('_uncolored'));
    if (uncoloredFiles.length === 0) {
      Alert.alert('🎉 Tuyệt vời!', 'Bạn đã hoàn thành tất cả tranh!');
      return;
    }
    const randomIndex = Math.floor(Math.random() * uncoloredFiles.length);
    const randomUri = uncoloredFiles[randomIndex];
    navigation.navigate('ColoringScreen', { svgUri: randomUri });
  };

  return (
    <View style={styles.container}>
      {/* Nút trái */}
      <View style={styles.leftButtons}>
        <TouchableOpacity onPress={isComplete ? handleSaveToAppGallery : undefined} disabled={!isComplete}>
          <View style={[styles.iconButton, !isComplete && styles.disabled]}>
            <SaveToGallery width={50} height={50} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={isComplete ? handleShare : undefined} disabled={!isComplete}>
          <View style={[styles.iconButton, !isComplete && styles.disabled]}>
            <Share width={50} height={50} />
          </View>
        </TouchableOpacity>
      </View>

      {/* 🎨 Nút trung tâm */}
      <TouchableOpacity onPress={isComplete ? handleContinue : handleSubmit}>
        <View style={styles.submitWrapper}>
          <SubmitButton width={220} height={60} />
          <Text style={styles.submitText}>{isComplete ? 'Tiếp tục' : 'Hoàn tất'}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default SubmitBar;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 6,
    elevation: 6,
  },
  leftButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconButton: {
    width: 50,
    height: 50,
    backgroundColor: '#FFB6C1',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF80A5',
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  disabled: {
    opacity: 0.5,
  },
  submitWrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitText: {
    position: 'absolute',
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Nunito-VariableFont_wght',
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
