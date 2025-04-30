import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
  Text,
} from 'react-native';

import ChickenSettingsScreen from './ChickenSettingsScreen';

import AsyncStorage from '@react-native-async-storage/async-storage';
import ChickenSkinsScreen from './ChickenSkinsScreen';
import ChickenQuizScreen from './ChickenQuizScreen';
import ChickenRunGameScreen from './ChickenRunGameScreen';

const fontKronaOneRegular = 'KronaOne-Regular';

const ChickenRunHomeScreen = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [selectedTimeChroniclesPage, setSelectedTimeChroniclesPage] = useState('Home');
  const [chickenNotifEnabled, setChickenNotifEnabled] = useState(false);
  const [chickenVibrationEnabled, setChickenVibrationEnabled] = useState(false);

  useEffect(() => {
    const loadChickenSettingsOfApp = async () => {
      try {
        const storedChickenNotifications = await AsyncStorage.getItem('chickenNotifEnabled');

        const storedChickenVibro = await AsyncStorage.getItem('chickenVibroEnabled');

        if (storedChickenNotifications !== null) {
          setChickenNotifEnabled(JSON.parse(storedChickenNotifications));
        }

        if (storedChickenVibro !== null) {
          setChickenVibrationEnabled(JSON.parse(storedChickenVibro));
        }
      } catch (error) {
        console.error('Error loading chicken run setting:', error);
      }
    };

    loadChickenSettingsOfApp();
  }, [])


  return (
    <View style={{
      flex: 1,
      width: '100%',
      height: dimensions.height,
    }}>
      {/* <LinearGradient
        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
        colors={['#F88700', '#FE1B2F']}
        start={{ x: 1, y: 1 }}
        end={{ x: 0, y: 0 }}
      /> */}
      {selectedTimeChroniclesPage === 'Home' ? (
        <SafeAreaView style={{
          flex: 1,
          alignItems: 'center',
        }}>
          <Image
            source={require('../assets/images/chickenRunHomeImage.png')}
            style={{
              width: dimensions.width * 0.5,
              height: dimensions.height * 0.19,
              marginBottom: dimensions.height * 0.07,
              alignSelf: 'center',
            }}
            resizeMode='contain'
          />

          {['Play', 'Skins', 'Quiz', 'Settings'].map((button, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setSelectedTimeChroniclesPage(button);
              }}
              style={{
                backgroundColor: 'white',
                alignSelf: 'center',
                width: dimensions.width * 0.75,
                alignItems: 'center',
                height: dimensions.height * 0.0754,
                borderRadius: dimensions.width * 0.1111111,
                borderWidth: dimensions.width * 0.003,
                borderColor: 'black',
                marginBottom: dimensions.height * 0.05,
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: 'black',
                  textAlign: 'center',
                  fontSize: dimensions.width * 0.065,
                  fontWeight: 700,
                  alignSelf: 'center',
                  fontFamily: fontKronaOneRegular,
                }}>
                {button}
              </Text>
            </TouchableOpacity>
          ))}

        </SafeAreaView>
      ) : selectedTimeChroniclesPage === 'Settings' ? (
        <ChickenSettingsScreen setSelectedTimeChroniclesPage={setSelectedTimeChroniclesPage} chickenNotifEnabled={chickenNotifEnabled} setChickenNotifEnabled={setChickenNotifEnabled} 
          chickenVibrationEnabled={chickenVibrationEnabled} setChickenVibrationEnabled={setChickenVibrationEnabled}
        />
      ) : selectedTimeChroniclesPage === 'Skins' ? (
        <ChickenSkinsScreen setSelectedTimeChroniclesPage={setSelectedTimeChroniclesPage} />
      ) : selectedTimeChroniclesPage === 'Quiz' ? (
        <ChickenQuizScreen setSelectedTimeChroniclesPage={setSelectedTimeChroniclesPage} />
      ) : selectedTimeChroniclesPage === 'Play' ? (
        <ChickenRunGameScreen setSelectedTimeChroniclesPage={setSelectedTimeChroniclesPage} />
      ) : null}
    </View>
  );
};

export default ChickenRunHomeScreen;
