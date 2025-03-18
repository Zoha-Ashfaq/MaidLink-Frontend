import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Corrected import

const UserContext = createContext();

export const useUserContext = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [userRole, setUserRole] = useState('');
  const [notifications, setNotifications] = useState([]);

  // Load role from AsyncStorage when the app starts
  useEffect(() => {
    const loadUserRole = async () => {
      try {
        const role = await AsyncStorage.getItem('userRole');
        if (role) {
          setUserRole(role);
          updateNotifications(role);
        }
      } catch (error) {
        console.error("Error loading user role:", error);
      }
    };
    loadUserRole();
  }, []);

  // Function to update notifications based on the user role
  const updateNotifications = (role) => {
    let newNotifications = [];
    if (role === 'maid') {
      newNotifications = [
        { id: 1, message: 'New service request from a homeowner.', userId: 101 },
        { id: 2, message: 'Your profile has been updated.', userId: 102 }
      ];
    } else if (role === 'homeowner') {
      newNotifications = [
        { id: 1, message: 'A new maid is available for booking.', userId: 201 },
        { id: 2, message: 'Your booking has been confirmed.', userId: 202 }
      ];
    }
    setNotifications(newNotifications);
  };

  // Function to change user role
  const changeRole = async (role) => {
    try {
      setUserRole(role);
      await AsyncStorage.setItem('userRole', role);
      updateNotifications(role);
    } catch (error) {
      console.error("Error setting role:", error);
    }
  };

  return (
    <UserContext.Provider value={{ userRole, notifications, changeRole }}>
      {children}
    </UserContext.Provider>
  );
};
