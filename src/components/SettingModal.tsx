import React from 'react';
import { View, Modal, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import CloseModal from '../assets/svg_img/CloseModal.svg';
import { useMusicController } from '../hooks/useMusicController';

interface SettingModalProps {
  visible: boolean;
  onClose: () => void;
}

const SettingModal = ({ visible, onClose }: SettingModalProps) => {
  const { volume, setMusicVolume } = useMusicController();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalWrapper}>
          <View style={styles.modalBorder}>
            <View style={styles.modalInner}>
              <Text style={styles.title}>CÀI ĐẶT</Text>

              <View style={{ width: '100%', marginBottom: 14 }}>
                <Text style={styles.label}>Nhạc</Text>
                <View style={styles.sliderWrapper}>
                  <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={1}
                    value={volume}
                    minimumTrackTintColor="#FF7BAA"
                    maximumTrackTintColor="#FDD9E4"
                    thumbTintColor="#FF7BAA"
                    step={0.05}
                    onValueChange={setMusicVolume}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Nút đóng nằm giữa viền */}
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <CloseModal width={58} height={58} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default SettingModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Modal khung ngoài (để căn giữa nút X)
  modalWrapper: {
    alignItems: 'center',
  },

  // Viền hồng dày quanh modal
  modalBorder: {
    borderWidth: 6,
    borderColor: '#F06292',
    borderRadius: 32,
    backgroundColor: '#F06292',
  },

  // Phần trong màu hồng nhạt
  modalInner: {
    backgroundColor: '#FFE6F0',
    borderRadius: 28,
    paddingVertical: 30,
    paddingHorizontal: 36,
    alignItems: 'center',
    width: 320,
  },

  title: {
    fontSize: 32,
    fontFamily: 'Nunito-Black',
    color: '#FA477C',
    fontWeight: '900',
    marginBottom: 24,
  },

  label: {
    fontSize: 22,
    fontFamily: 'Nunito-Bold',
    fontWeight: '700',
    color: '#E75A88',
    marginBottom: 6,
  },

  // Gói slider có nền hồng nhạt và bo tròn
  sliderWrapper: {
    // backgroundColor: '#FDC3CD',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  slider: {
    width: 240,
    height: 40,
  },

  // Nút đóng nằm chồng ra giữa khung viền
  closeBtn: {
    position: 'absolute',
    bottom: -30,
    alignSelf: 'center',
    zIndex: 10,
  },
});
