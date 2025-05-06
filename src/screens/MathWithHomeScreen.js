import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
  Text,
  Platform,
} from 'react-native';

import MathSettingsWithScreen from './MathSettingsWithScreen';

import AsyncStorage from '@react-native-async-storage/async-storage';
import MathQuizPage from './MathQuizPage';
import Sound from 'react-native-sound';
import { useAudio } from '../context/AudioContext';
import MathCatchEggsScreen from './MathCatchEggsScreen';
import MathAchievmentsScreen from './MathAchievmentsScreen';

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
  const [selectedMathWithScreen, setSelectedMathWithScreen] = useState('Home');
  const [mathWithMusicEnabled, setMathWithMusicEnabled] = useState(true);
  const [vibroMathEnabled, setVibroMathEnabled] = useState(true);

  const { volume } = useAudio();
  const [mathWithIndOfTrack, setMathWithIndOfTrack] = useState(0);
  const [sound, setSound] = useState(null);

  const mathTracks = ['mathWithChickensBackgroundMusic.mp3', 'mathWithChickensBackgroundMusic.mp3'];

  useEffect(() => {
    playMathTracksWith(mathWithIndOfTrack);

    return () => {
      if (sound) {
        sound.stop(() => {
          sound.release();
        });
      }
    };
  }, [mathWithIndOfTrack]);

  useEffect(() => {
    if (sound) {
      sound.setVolume(mathWithMusicEnabled ? 1 : 0);
    }
  }, [mathWithMusicEnabled, sound]);

  const playMathTracksWith = (index) => {
    if (sound) {
      sound.stop(() => {
        sound.release();
      });
    }

    const newMathSound = new Sound(mathTracks[index], Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('Error math sound:', error);
        return;
      }
      newMathSound.setVolume(volume);
      newMathSound.play((success) => {
        if (success) {
          setMathWithIndOfTrack((prevIndex) => (prevIndex + 1) % mathTracks.length);
        } else {
          console.log('Error play track');
        }
      });
      setSound(newMathSound);
    });
  };

  useEffect(() => {
    const loadMathSettingsParams = async () => {
      try {
        const storedMathMusicIs = await AsyncStorage.getItem('mathWithMusicEnabled');

        const storedMathVibrationIs = await AsyncStorage.getItem('chickenVibroEnabled');

        if (storedMathMusicIs !== null) {
          setMathWithMusicEnabled(JSON.parse(storedMathMusicIs));
        }

        if (storedMathVibrationIs !== null) {
          setVibroMathEnabled(JSON.parse(storedMathVibrationIs));
        }
      } catch (error) {
        console.error('Error loading math params:', error);
      }
    };

    loadMathSettingsParams();
  }, [])

  return (
    <View style={{
      flex: 1,
      width: '100%',
      height: dimensions.height,
      backgroundColor: '#86CBDD',
    }}>
      {selectedMathWithScreen === 'Home' ? (
        <SafeAreaView style={{
          flex: 1,
          alignItems: 'center',
          marginTop: Platform.OS === 'android' ? dimensions.height * 0.03 : 0,
        }}>
          {mainYellowButtons.map((mathButton, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setSelectedMathWithScreen(mathButton.text);
              }}
              style={{
                backgroundColor: '#FFE066',
                alignSelf: 'center',
                width: dimensions.width * 0.96,
                borderColor: 'black',
                alignItems: 'center',
                height: dimensions.height * 0.17,
                borderRadius: dimensions.width * 0.0282828,
                flexDirection: 'row',
                borderWidth: dimensions.width * 0.003,
                marginBottom: dimensions.height * 0.03,
                justifyContent: 'flex-start',
              }}>
              <Image
                source={mathButton.image}
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
                {mathButton.text}
              </Text>
            </TouchableOpacity>
          ))}

        </SafeAreaView>
      ) : selectedMathWithScreen === 'Settings' ? (
        <MathSettingsWithScreen setSelectedMathWithScreen={setSelectedMathWithScreen} mathWithMusicEnabled={mathWithMusicEnabled} setMathWithMusicEnabled={setMathWithMusicEnabled}
          vibroMathEnabled={vibroMathEnabled} setVibroMathEnabled={setVibroMathEnabled}
        />
      ) : selectedMathWithScreen === 'Achievments' ? (
        <MathAchievmentsScreen setSelectedMathWithScreen={setSelectedMathWithScreen} />
      ) : selectedMathWithScreen === 'Math Quiz' ? (
        <MathQuizPage setSelectedMathWithScreen={setSelectedMathWithScreen} />
      ) : selectedMathWithScreen === 'Play Game' ? (
        <MathCatchEggsScreen setSelectedMathWithScreen={setSelectedMathWithScreen} vibroMathEnabled={vibroMathEnabled}/>
      ) : null}
    </View>
  );
};

export default MathWithHomeScreen;
