import { useNavigation } from '@react-navigation/native';
import { Image, View, ActivityIndicator, Dimensions } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { useDispatch } from 'react-redux';
import React, { useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadUserData } from '../redux/userSlice';
import { UserContext } from '../context/UserContext';
import MathLoader from '../components/MathLoader';

const LoadingMathApp = () => {
  const navigation = useNavigation();
  const { user, setUser } = useContext(UserContext);
  const dispatch = useDispatch();
  const dimensions = Dimensions.get('window');

  const [isMathOnboardingWas, setMathOnboardingWas] = useState(false);
  const [initMathLoadingDone, setInitMathLoadingDone] = useState(false);

  useEffect(() => {
    const loadMathUser = async () => {
      try {
        const deviceId = await DeviceInfo.getUniqueId();
        const storageKey = `currentUser_${deviceId}`;
        const storedMathWithUser = await AsyncStorage.getItem(storageKey);
        const isMathOnboardingVisibled = await AsyncStorage.getItem('isMathOnboardingVisibled');

        if (storedMathWithUser) {
          setUser(JSON.parse(storedMathWithUser));
          setMathOnboardingWas(false);
        } else if (isMathOnboardingVisibled) {
          setMathOnboardingWas(false);
        } else {
          setMathOnboardingWas(true);
          await AsyncStorage.setItem('isMathOnboardingVisibled', 'true');
        }
      } catch (error) {
        console.error('Loading math user has problem', error);
      } finally {
        setInitMathLoadingDone(true);
      }
    };

    loadMathUser();
  }, [setUser]);

  useEffect(() => {
    dispatch(loadUserData());
  }, [dispatch]);

  useEffect(() => {
    if (initMathLoadingDone) {
      const timer = setTimeout(() => {
        const destination = isMathOnboardingWas ? 'MathOnbPage' : 'MathWithHomeScreen';
        navigation.replace(destination);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [initMathLoadingDone, isMathOnboardingWas, navigation]);

  return (
    <View style={{
      alignItems: 'center',
      height: '100%',
      backgroundColor: '#86CBDD',
      justifyContent: 'center',
      width: '100%',
      alignSelf: 'center',
    }}>
      <Image
        source={require('../assets/images/mathLoadingImage.png')}
        style={{
          width: dimensions.width * 0.94,
          height: dimensions.height * 0.43,
          alignSelf: 'center',
        }}
        resizeMode='contain'
      />

      <MathLoader />
    </View>
  );
};

export default LoadingMathApp;
