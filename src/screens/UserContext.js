import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = createContext();

// Custom hook for easier consumption
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState('');
  const [notifications, setNotifications] = useState([]);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [storedUser, storedRole] = await Promise.all([
          AsyncStorage.getItem('user'),
          AsyncStorage.getItem('userRole')
        ]);

        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          
          // Prefer role from user object if available
          if (parsedUser.role) {
            await handleRoleChange(parsedUser.role, false);
          } else if (storedRole) {
            await handleRoleChange(storedRole, false);
          }
        } else if (storedRole) {
          await handleRoleChange(storedRole, false);
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const login = async (userData) => {
    try {
      const userWithRole = { 
        ...userData, 
        role: userData.role || userRole || 'homeowner' // Default role
      };
      await AsyncStorage.setItem('user', JSON.stringify(userWithRole));
      setUser(userWithRole);
      
      if (userWithRole.role) {
        await handleRoleChange(userWithRole.role);
      }
      return userWithRole;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem('user'),
        AsyncStorage.removeItem('userRole')
      ]);
      setUser(null);
      setUserRole('');
      setNotifications([]);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  const updateNotifications = (role) => {
    const roleNotifications = {
      maid: [
        { id: 1, message: 'New service request from a homeowner.', userId: 101 },
        { id: 2, message: 'Your profile has been updated.', userId: 102 }
      ],
      homeowner: [
        { id: 1, message: 'A new maid is available for booking.', userId: 201 },
        { id: 2, message: 'Your booking has been confirmed.', userId: 202 }
      ]
    };
    setNotifications(roleNotifications[role] || []);
  };

  const handleRoleChange = async (role, updateUser = true) => {
    try {
      setUserRole(role);
      updateNotifications(role);
      await AsyncStorage.setItem('userRole', role);
      
      if (updateUser && user) {
        const updatedUser = { ...user, role };
        setUser(updatedUser);
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Role change failed:', error);
      throw error;
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        userRole,
        notifications,
        changeRole: handleRoleChange
      }}
    >
      {children}
    </UserContext.Provider>
  );
};