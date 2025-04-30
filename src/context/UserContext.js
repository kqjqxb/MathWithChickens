import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadChickenUserRunner = async () => {
      try {
        const storedChickenUserRunner = await AsyncStorage.getItem('currentUser');
        if (storedChickenUserRunner) {
          setUser(JSON.parse(storedChickenUserRunner));
        }
      } catch (error) {
        console.error('Error loading storedChickenUserRunner user:', error);
      }
    };
    loadChickenUserRunner();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
