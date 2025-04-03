import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Switch } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import i18n from '../../i18n';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [language, setLanguage] = useState("English");

  const toggleLanguage = () => {
    setLanguage(prevLang => (prevLang === "English" ? "Urdu" : "English"));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{i18n.t("ProfileManagement.profileManagement")}</Text>

      {/* Navigate to Edit Profile Screen */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("EditProfile") }>
        <Text style={styles.buttonText}>{i18n.t("ProfileManagement.editProfile")}</Text>
      </TouchableOpacity>

      {/* Change Language */}
      <View style={styles.section}>
        <Text style={styles.label}>{i18n.t("ProfileManagement.languageLabel")}: {language}</Text>
        <Switch value={language === "Urdu"} onValueChange={toggleLanguage} />
      </View>

      {/* My Bookings */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("MyBookings")}>
        <Text style={styles.buttonText}>{i18n.t("ProfileManagement.myBookings")}</Text>
      </TouchableOpacity>

      {/* Log Out */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.replace("Login") }>
        <Text style={styles.buttonText}>{i18n.t("ProfileManagement.logOut")}</Text>
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => navigation.navigate('HometabScreen')}>
          <Ionicons name="home" size={34} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ChatListScreen')}>
          <Ionicons name="chatbubbles" size={34} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('LocationScreen')}>
          <Ionicons name="location" size={34} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('VideoTutorial')}>
          <Ionicons name="videocam" size={34} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ProfileManagement')}>
          <Ionicons name="person" size={34} color="white" />
        </TouchableOpacity>
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
