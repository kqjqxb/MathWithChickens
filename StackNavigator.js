import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MathWithHomeScreen from './src/screens/MathWithHomeScreen';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { UserProvider, UserContext } from './src/context/UserContext';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import LoadingMathApp from './src/screens/LoadingMathApp';
import MathOnboardingScreen from './src/screens/MathOnboardingScreen';
import { AudioProvider } from './src/context/AudioContext';

const Stack = createNativeStackNavigator();

const MathWithStack = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <UserProvider>
          <SafeAreaProvider>
            <AppNavigator />
          </SafeAreaProvider>
        </UserProvider>
      </Provider>
    </GestureHandlerRootView>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <AudioProvider>
        <Stack.Navigator initialRouteName={'LoadMathAppPage'}>
          <Stack.Screen name="MathOnbPage" component={MathOnboardingScreen} options={{ headerShown: false }} />
          <Stack.Screen name="LoadMathAppPage" component={LoadingMathApp} options={{ headerShown: false }} />
          <Stack.Screen name="MathWithHomeScreen" component={MathWithHomeScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </AudioProvider>
    </NavigationContainer>
  );
};


export default MathWithStack;
