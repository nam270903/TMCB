import { useEffect } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import DeviceInfo from 'react-native-device-info';

/**
 * Hook: useRegisterDevice
 * - Đăng ký thiết bị lần đầu
 * - Cập nhật lastActiveAt mỗi khi app mở
 * - Dùng UniqueID làm khóa chính
 */
export const useRegisterDevice = () => {
  useEffect(() => {
    const registerOrUpdateDevice = async () => {
      try {
        // Lấy uniqueId của máy
        const uniqueId = await DeviceInfo.getUniqueId();

        // Kiểm tra trong AsyncStorage xem đã từng lưu chưa
        const storedId = await AsyncStorage.getItem('deviceId');

        // Nếu đã có -> chỉ cập nhật lastActiveAt
        if (storedId === uniqueId) {
          await firestore().collection('devices').doc(uniqueId).update({
            lastActiveAt: firestore.FieldValue.serverTimestamp(),
          });
          console.log('✅ Device activity updated:', uniqueId);
          return;
        }

        // Nếu chưa có -> tạo mới record trong Firestore
        const deviceData = {
          id: uniqueId,
          brand: DeviceInfo.getBrand(),
          model: DeviceInfo.getModel(),
          systemName: DeviceInfo.getSystemName(),
          systemVersion: DeviceInfo.getSystemVersion(),
          appVersion: DeviceInfo.getVersion(),
          buildNumber: DeviceInfo.getBuildNumber(),
          platform: Platform.OS,
          isEmulator: await DeviceInfo.isEmulator(),
          createdAt: firestore.FieldValue.serverTimestamp(),
          lastActiveAt: firestore.FieldValue.serverTimestamp(),
        };

        await firestore().collection('devices').doc(uniqueId).set(deviceData);
        await AsyncStorage.setItem('deviceId', uniqueId);

        console.log('Registered new device:', deviceData);
      } catch (error) {
        console.error('Device registration error:', error);
      }
    };

    registerOrUpdateDevice();
  }, []);
};
