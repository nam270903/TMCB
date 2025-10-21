import React, { useEffect, useState } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { enableScreens } from 'react-native-screens'; enableScreens();

//Import screens
import Loading from "./src/screens/Loading";
import MainScreen from "./src/screens/MainScreen";

export type RootStackParamList = {
  Loading: undefined;
  MainScreen: undefined;
};

const App = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();

  return (
    
    <NavigationContainer>
      <Stack.Navigator>
        {/* <Stack.Screen name="Loading" component={Loading} options={{ headerShown: false }} /> */}
        <Stack.Screen name="MainScreen" component={MainScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;