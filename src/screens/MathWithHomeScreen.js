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


const fontRammetoOneRegular = 'RammettoOne-Regular';
const fontRanchersRegular = 'Ranchers-Regular';

const mainYellowButtons = [
  {
    id: 1,
    text: 'Math Quiz',
    image: require('../assets/images/mathQuizButton.png'),
  },
  {
    id: 2,
    text: 'Play Game',
    image: require('../assets/images/mathPlayButton.png'),
  },
  {
    id: 3,
    text: 'Achievments',
    image: require('../assets/images/mathAchievmentsButton.png'),
  },
  {
    id: 4,
    text: 'Settings',
    image: require('../assets/images/mathSettingsButton.png'),
  },

]

const MathWithHomeScreen = () => {
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
      backgroundColor: '#86CBDD',
    }}>
      {selectedTimeChroniclesPage === 'Home' ? (
        <SafeAreaView style={{
          flex: 1,
          alignItems: 'center',
        }}>
          {mainYellowButtons.map((button, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setSelectedTimeChroniclesPage(button);
              }}
              style={{
                backgroundColor: '#FFE066',
                alignSelf: 'center',
                width: dimensions.width * 0.96,
                alignItems: 'center',
                height: dimensions.height * 0.17,
                borderRadius: dimensions.width * 0.0282828,
                borderWidth: dimensions.width * 0.003,
                borderColor: 'black',
                marginBottom: dimensions.height * 0.03,
                justifyContent: 'flex-start',
                flexDirection: 'row',
              }}>
              <Image
                source={button.image}
                style={{
                  width: dimensions.height * 0.14,
                  height: dimensions.height * 0.14,
                  marginRight: dimensions.width * 0.05,
                }}
                resizeMode="contain"
              />
              <Text
                style={{
                  color: '#5C4033',
                  textAlign: 'left',
                  fontSize: dimensions.width * 0.1,
                  fontWeight: 700,
                  alignSelf: 'center',
                  fontFamily: fontRanchersRegular,
                }}>
                {button.text}
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

export default MathWithHomeScreen;
