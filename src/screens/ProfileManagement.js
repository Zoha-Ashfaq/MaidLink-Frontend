import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Switch, Alert, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import i18n from '../../i18n';
import { useUser } from './UserContext';
import api from '../services/api';
import BottomNavigation from './BottomNavigation';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [language, setLanguage] = useState("English");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user, logout } = useUser();

  const toggleLanguage = () => {
    setLanguage(prevLang => (prevLang === "English" ? "Urdu" : "English"));
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Determine endpoint based on user.type (from login response) or role
      const endpoint = user?.type === 'maid' ? 'maid' : 'user';
      console.log('Attempting logout for:', endpoint);
      
      // Make logout API call with token
      const response = await api.post(`/${endpoint}/logout`, {}, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Logout response:', response.data);
      
      // Clear local storage and context
      await logout();
      
      // Navigate to login screen
      navigation.replace("Login");
      
    } catch (error) {
      console.error('Detailed logout error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Special handling for 400 errors
      if (error.response?.status === 400) {
        // Token might be invalid, proceed with client-side cleanup
        await logout();
        navigation.replace("Login");
        return;
      }
      
      Alert.alert(
        'Logout Error',
        error.response?.data?.message || 'Failed to logout. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{i18n.t("ProfileManagement.profileManagement")}</Text>

      {/* Edit Profile */}
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate("EditProfileScreen")}
        disabled={isLoggingOut}
      >
        <Text style={styles.buttonText}>{i18n.t("ProfileManagement.editProfile")}</Text>
      </TouchableOpacity>

      {/* Language Toggle */}
      <View style={styles.section}>
        <Text style={styles.label}>{i18n.t("ProfileManagement.languageLabel")}: {language}</Text>
        <Switch 
          value={language === "Urdu"} 
          onValueChange={toggleLanguage}
          disabled={isLoggingOut}
        />
      </View>

      {/* My Bookings */}
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate("MyBookings")}
        disabled={isLoggingOut}
      >
        <Text style={styles.buttonText}>{i18n.t("ProfileManagement.myBookings")}</Text>
      </TouchableOpacity>

      {/* Log Out Button with ActivityIndicator */}
      <TouchableOpacity 
        style={[styles.button, isLoggingOut && styles.disabledButton]} 
        onPress={handleLogout}
        disabled={isLoggingOut}
      >
        {isLoggingOut ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>{i18n.t("ProfileManagement.logOut")}</Text>
        )}
      </TouchableOpacity>

      <View style={styles.bottomNav}>
        <BottomNavigation />
        </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FFE5',
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#66785F',
    paddingVertical: 10,
    position: 'absolute',
    height: 75,
    bottom: 0,
    left: 0,
    right: 0,
  },
  section: {
    width: "100%",
    marginBottom: 20,
    alignItems: "center",
  },
  button: {
    width: 350,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#66785F",
    alignItems: "center",
    marginVertical: 10,
    borderRadius: 0,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "600",
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  }
});

export default ProfileScreen;