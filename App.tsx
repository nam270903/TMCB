import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useRegisterDevice } from './src/hooks/useRegisterDevice';
import { enableScreens } from 'react-native-screens'; enableScreens();

//Import screens
import Loading from "./src/screens/Loading";
import MainScreen from "./src/screens/MainScreen";
import MemoryColoringScreen from "./src/screens/MemoryColoringScreen"; 

export type RootStackParamList = {
  Loading: undefined;
  MainScreen: undefined;
  MemoryColoringScreen: undefined;
};

const App = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  useRegisterDevice();

  return (
    
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Loading" component={Loading} options={{ headerShown: false }} />
        <Stack.Screen name="MainScreen" component={MainScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MemoryColoringScreen" component={MemoryColoringScreen} options={{ headerShown: false }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;