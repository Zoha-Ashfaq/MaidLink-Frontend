import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Linking } from "react-native";
import { Ionicons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import i18n from '../../i18n'; // Assuming you have an i18n setup

const VideoTutorialScreen = () => {
  const navigation = useNavigation();

  const videoLinks = [
    {
      title: i18n.t("Video.howToCreateAccount"),
      url: "https://www.instagram.com/reel/CtBYI7esPG5/?igsh=ejN4MTV6Mjc5ZXA0",  // Replace with actual URL
    },
    {
      title: i18n.t("Video.howToBrowseServices"),
      url: "https://www.instagram.com/reel/CtBYI7esPG5/?igsh=ejN4MTV6Mjc5ZXA0",  // Replace with actual URL
    },
    {
      title: i18n.t("Video.howToBookMaid"),
      url: "https://www.instagram.com/reel/CtBYI7esPG5/?igsh=ejN4MTV6Mjc5ZXA0",  // Replace with actual URL
    },
    {
      title: i18n.t("Video.howToManageProfile"),
      url: "https://www.instagram.com/reel/CtBYI7esPG5/?igsh=ejN4MTV6Mjc5ZXA0",  // Replace with actual URL
    },
  ];

  const openVideo = (url) => {
    Linking.openURL(url).catch(err => console.error(i18n.t("openVideoError"), err));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{i18n.t("Video.videoTutorials")}</Text>

      <View style={styles.videoList}>
        {videoLinks.map((video, index) => (
          <TouchableOpacity
            key={index}
            style={styles.videoButton}
            onPress={() => openVideo(video.url)}
          >
            <Text style={styles.videoButtonText}>{video.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

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
    backgroundColor: "#F7FFE5",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
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
  videoList: {
    flex: 1,
  },
  videoButton: {
    backgroundColor: "#D9D9D9",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  videoButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#66785F",
  },
});

export default VideoTutorialScreen;
