import React, {useState} from 'react';
import { View, TouchableOpacity, StyleSheet, Modal, Dimensions } from 'react-native';
import { Svg, Path, SvgXml, SvgUri, G } from 'react-native-svg';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useInteractiveSvg } from '../hooks/useInteractiveSvg';
import { useColorPalette } from '../hooks/useColorPalette';
import HeaderColoring from '../assets/svg_img/HeaderColoring.svg';
import ReturnWithBackground from '../assets/svg_img/ReturnWithBackground.svg';
import ImgFrame from '../assets/svg_img/Img_frame.svg';


const { width } = Dimensions.get('window');

const ColoringScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { svgUri } = route.params;

  const [isSampleVisible, setSampleVisible] = useState(false);


  const coloredUri = svgUri.replace('_uncolored', '_colored');
  const { paths, fillPath } = useInteractiveSvg(svgUri);
  const { colors, selectedColor, setSelectedColor } = useColorPalette(coloredUri);

  const handleReturnPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>

      {/* Headers */}
      <View style={styles.headerWrapper}>
        <HeaderColoring 
          width='100%' 
          height='15%'
          preserveAspectRatio="xMidYMid slice" 
          style={StyleSheet.absoluteFill} />

        <TouchableOpacity onPress={handleReturnPress} style={styles.returnWrapper}>
          <ReturnWithBackground width={42} height={40} preserveAspectRatio="xMidYMid slice" style={StyleSheet.absoluteFill} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSampleVisible(true)}
          style={styles.sampleThumbnail}>
          <ImgFrame width={55} height={55} style={styles.frame} />
          <SvgUri uri={coloredUri} width={45} height={45} />
        </TouchableOpacity>
        
      </View>

      <Modal
        transparent
        animationType="fade"
        visible={isSampleVisible}
        onRequestClose={() => setSampleVisible(false)}>
          
        <View style={styles.overlay}>
          <TouchableOpacity style={styles.overlayBackground} onPress={() => setSampleVisible(false)}/>

          <View style={styles.modalContent}>
            <View style={styles.sampleContainer}>
              <ImgFrame width={width * 0.8} height={width * 0.8} style={styles.frame}/>
              <SvgUri uri={coloredUri} width={width * 0.7} height={width * 0.7} style={styles.svg}/>
            </View>
          </View>

        </View>
      </Modal>


      {/* SvgImage */}
      <View style={styles.svgWrapper}>
        <Svg
          pointerEvents="box-none"
          width={width }
          height={width}
          viewBox="0 0 348 348">
          {paths.map((p, index) => (
            <G key={p.id}>
              <Path
                d={p.d}
                // ✅ Nếu path có fill trắng thì tô tạm màu đỏ nhạt để thấy được vùng nhấn
                fill={p.fill === 'white' ? 'red' : p.fill}
                stroke="#000"
                strokeWidth={0.3}
                onPressIn={() => {
                  console.log(`🎨 Fill path ID ${p.id} with ${selectedColor}`);
                  fillPath(p.id, selectedColor);
                }}
                pointerEvents="auto"
              />
            </G>
          ))}



        </Svg>
      </View>

      {/* Color Selection Bar */}
      <View style={styles.colorBar}>
        {colors.map((c, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => {
              setSelectedColor(c);}}
            style={[
              styles.colorButton,
              {
                backgroundColor: c,
                borderWidth: selectedColor === c ? 3 : 1.5,
                borderColor: selectedColor === c ? '#FF80AB' : '#ccc',
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default ColoringScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  svgWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 150,
  },
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
  colorButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    margin: 6,
  },
  headerWrapper: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  returnWrapper: {
    position: 'absolute',
    left: 30,
    top: 60,
  },
  sampleThumbnail: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
    frame: {
    position: 'absolute',
  },
    overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayBackground: {
    ...StyleSheet.absoluteFill,
  },
modalContent: {
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
},

sampleContainer: {
  position: 'relative',
  alignItems: 'center',
  justifyContent: 'center',
},
svg: {
  position: 'absolute',
  zIndex: 2,
},
});
