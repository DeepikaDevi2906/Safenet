import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // INSTALL THIS: npm install @react-native-async-storage/async-storage

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from storage on app start
  useEffect(() => {
    const loadUser = async () => {
      const storedId = await AsyncStorage.getItem('userId');
      if (storedId) {
        setUserId(parseInt(storedId, 10));
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  // Set user ID and store it
  const login = async (id) => {
    setUserId(id);
    await AsyncStorage.setItem('userId', id.toString());
  };

  // Clear user ID and storage
  const logout = async () => {
    setUserId(null);
    await AsyncStorage.removeItem('userId');
  };

  return (
    <AuthContext.Provider value={{ userId, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);