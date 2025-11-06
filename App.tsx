import React from "react";
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useRegisterDevice } from './src/hooks/useRegisterDevice';
import { enableScreens } from 'react-native-screens'; enableScreens();
import BackgroundMusicProvider from "./src/components/BackgroundMusicProvider";

//Import screens
import Loading from "./src/screens/Loading";
import MainScreen from "./src/screens/MainScreen";
import MemoryColoringScreen from "./src/screens/MemoryColoringScreen"; 
import ColoringScreen from "./src/screens/ColoringScreen";
import CompleteScreen from "./src/screens/CompleteScreen";
import GalleryScreen from "./src/screens/GalleryScreen";

export type RootStackParamList = {
  Loading: undefined;
  MainScreen: undefined;
  MemoryColoringScreen: undefined;
  ColoringScreen: { svgUri: string};
  CompleteScreen: {svgUri: string};
  GalleryScreen: undefined;
};

const App = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  useRegisterDevice();

  return (
    
    <NavigationContainer>
      <BackgroundMusicProvider />
      <Stack.Navigator>
        <Stack.Screen name="Loading" component={Loading} options={{ headerShown: false }} />
        <Stack.Screen name="MainScreen" component={MainScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MemoryColoringScreen" component={MemoryColoringScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ColoringScreen" component={ColoringScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CompleteScreen" component={CompleteScreen} options={{ headerShown: false }} />
        <Stack.Screen name="GalleryScreen" component={GalleryScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;