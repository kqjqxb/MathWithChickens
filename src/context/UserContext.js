import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUserOfMathWith = async () => {
      try {
        const storedMathWithUser = await AsyncStorage.getItem('currentUser');
        if (storedMathWithUser) {
          setUser(JSON.parse(storedMathWithUser));
        }
      } catch (error) {
        console.error('Error loading storedMathWithUser user:', error);
      }
    };
    loadUserOfMathWith();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
