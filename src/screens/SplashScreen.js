import React, { useEffect, useState } from 'react';
import { View, Image, Text, StyleSheet, ActivityIndicator } from 'react-native';
import * as Font from 'expo-font';

const SplashScreen = ({ navigation }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Load custom fonts
  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        FancyFont: require('../../assets/fonts/Vampire Wars.ttf'), // Adjust the font file path as necessary
      });
      setFontsLoaded(true); // Set fontsLoaded to true after loading
    };
    loadFonts();
  }, []);

  // Navigate to the next screen after 3 seconds
  useEffect(() => {
    if (fontsLoaded) {
      const timer = setTimeout(() => {
        navigation.replace('LanguageSelectionScreen');
      }, 3000);

      return () => clearTimeout(timer); // Clear timer on unmount
    }
  }, [fontsLoaded, navigation]);

  // Show a loader until fonts are loaded
  if (!fontsLoaded) {
    return (
      <View style={[styles.container, { backgroundColor: '#f2bc94' }]}>
        <ActivityIndicator size="large" color="#722620" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/pictures/maidlink logo.png')}
        style={styles.logo}
      />
      
      <ActivityIndicator size="large" color="#66785F" style={styles.loader} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7FFE5', // Solid background color
  },
  logo: {
    width: 315,
    height: 340,
    marginBottom: 20,
  },
  appName: {
    fontSize: 36,
    color: '#722620', // Use one of your palette colors for text
    textShadowColor: '#de8a0d', // Add a subtle shadow for depth
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  loader: {
    marginTop: 20,
  },
});

export default SplashScreen;
