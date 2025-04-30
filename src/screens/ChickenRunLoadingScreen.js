import { useNavigation } from '@react-navigation/native';
import { Image, View, ActivityIndicator, Dimensions } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { useDispatch } from 'react-redux';
import React, { useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadUserData } from '../redux/userSlice';
import { UserContext } from '../context/UserContext';

const ChickenRunLoadingScreen = () => {
  const navigation = useNavigation();
  const { user, setUser } = useContext(UserContext);
  const dispatch = useDispatch();
  const dimensions = Dimensions.get('window');

  const [isChickenOnbWasVisibledRunYet, setChickenOnbWasVisibledRunYet] = useState(false);
  const [initializationChickenLoadingCompleted, setnitializationChickenLoadingCompleted] = useState(false);

  useEffect(() => {
    const loadChickenUserRunner = async () => {
      try {
        const deviceId = await DeviceInfo.getUniqueId();
        const storageKey = `currentUser_${deviceId}`;
        const storedChickenUserRunner = await AsyncStorage.getItem(storageKey);
        const isChickenOnbWasVisibledRun = await AsyncStorage.getItem('isChickenOnbWasVisibledRun');

        if (storedChickenUserRunner) {
          setUser(JSON.parse(storedChickenUserRunner));
          setChickenOnbWasVisibledRunYet(false);
        } else if (isChickenOnbWasVisibledRun) {
          setChickenOnbWasVisibledRunYet(false);
        } else {
          setChickenOnbWasVisibledRunYet(true);
          await AsyncStorage.setItem('isChickenOnbWasVisibledRun', 'true');
        }
      } catch (error) {
        console.error('Error loading of montYou Real user', error);
      } finally {
        setnitializationChickenLoadingCompleted(true);
      }
    };

    loadChickenUserRunner();
  }, [setUser]);

  useEffect(() => {
    dispatch(loadUserData());
  }, [dispatch]);

  useEffect(() => {
    if (initializationChickenLoadingCompleted) {
      const timer = setTimeout(() => {
        const destination = isChickenOnbWasVisibledRunYet ? 'ChickenRunOnboardingScreen' : 'MathWithHomeScreen';
        navigation.replace(destination);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [initializationChickenLoadingCompleted, isChickenOnbWasVisibledRunYet, navigation]);

  return (
    <View style={{
      alignItems: 'center',
      height: '100%',
      alignSelf: 'center',
      justifyContent: 'center',
      width: '100%',
    }}>
      {/* <LinearGradient
        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
        colors={['#F88700', '#FE1B2F']}
        start={{ x: 1, y: 1 }}
        end={{ x: 0, y: 0 }}
      /> */}
      <Image
        source={require('../assets/images/chickenRunHomeImage.png')}
        style={{
          width: dimensions.width * 0.8,
          height: dimensions.height * 0.4,
          marginBottom: dimensions.height * 0.07,
          alignSelf: 'center',
        }}
        resizeMode='contain'
      />
    </View>
  );
};

export default ChickenRunLoadingScreen;
