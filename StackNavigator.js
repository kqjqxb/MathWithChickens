import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ChickenRunHomeScreen from './src/screens/ChickenRunHomeScreen';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { UserProvider, UserContext } from './src/context/UserContext';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import ChickenRunLoadingScreen from './src/screens/ChickenRunLoadingScreen';
import ChickenOnboardingRunScreen from './src/screens/ChickenOnboardingRunScreen';

const Stack = createNativeStackNavigator();

const ChickenRunStack = () => {
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
        <Stack.Navigator initialRouteName={'LoadPrideQuestScreen'}>
          <Stack.Screen name="ChickenRunHomeScreen" component={ChickenRunHomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="LoadPrideQuestScreen" component={ChickenRunLoadingScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ChickenRunOnboardingScreen" component={ChickenOnboardingRunScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    </NavigationContainer>
  );
};


export default ChickenRunStack;
