import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [volume, setVolume] = useState(1.0); 

  useEffect(() => {
    const loadMathStoredWithVolume = async () => {
      try {
        const storedMathWithVolume = await AsyncStorage.getItem('volume');
        if (storedMathWithVolume !== null) {
          setVolume(parseFloat(storedMathWithVolume));
        }
      } catch (error) {
        console.log('Error loading the math volume:', error);
      }
    };
    loadMathStoredWithVolume();
  }, []);

  const handleChangeThisVolume = async (thisVolume) => {
    try {
      await AsyncStorage.setItem('volume', thisVolume.toString());

      setVolume(thisVolume);

    } catch (error) {
      console.log('Error saving math volume:', error);
    }
  };

  return (
    <AudioContext.Provider value={{ volume, setVolume: handleChangeThisVolume }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);
