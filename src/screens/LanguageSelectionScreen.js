import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, Feather } from '@expo/vector-icons';

const LanguageSelectionScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation(); // Translation hook
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language); // Track selected language

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    i18n.changeLanguage(lang); // Update the language
    // Navigate to PhoneNumberScreen after selecting language
    navigation.navigate('PhoneNumberScreen', { language: lang });
  };

  return (
    <View style={styles.container}>
      {/* Gradient Background */}
      <View style={styles.background} />

      {/* Logo and App Name */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/pictures/maidlink logo.png')}
          style={styles.logo}
        />
        
      </View>

      {/* Select Language */}
      <Text style={styles.selectLanguage}>{t('selectLanguage')}</Text>

      {/* Language Options */}
      <View style={styles.radioGroup}>
        {/* English Option */}
        <TouchableOpacity
          style={[
            styles.radioOption,
            selectedLanguage === 'en' && styles.selectedOption,
          ]}
          onPress={() => handleLanguageChange('en')}
        >
          <Text style={styles.radioText}>English</Text>
          <View
            style={[
              styles.radioButton,
              selectedLanguage === 'en' && styles.selectedRadio,
            ]}
          />
        </TouchableOpacity>

        {/* Urdu Option */}
        <TouchableOpacity
          style={[
            styles.radioOption,
            selectedLanguage === 'ur' && styles.selectedOption,
          ]}
          onPress={() => handleLanguageChange('ur')}
        >
          <Text style={styles.radioText}>اردو</Text>
          <View
            style={[
              styles.radioButton,
              selectedLanguage === 'ur' && styles.selectedRadio,
            ]}
          />
        </TouchableOpacity>
      </View>

  
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#F7FFE5',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F7FFE5',
    borderRadius: 10,
  },
  header: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 20, // Reduced marginTop to move it closer to the logo
  },
  logo: {
    width: 258,
    height: 258,
  },
  
  selectLanguage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#91AC8F',
    textAlign: 'center',
    marginVertical: 5, // Adjusted vertical margin to fit better with the logo
  },
  radioGroup: {
    alignItems: 'center',
    marginBottom: 30,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    padding: 15,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    marginVertical: 10,
    backgroundColor: '#D9D9D9',
  },
  radioText: {
    fontSize: 18,
    color: 'black',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'black',
    backgroundColor: 'transparent',
  },
  selectedOption: {
    borderColor: 'black',
  },
  selectedRadio: {
    backgroundColor: 'black',
  },
  
});

export default LanguageSelectionScreen;
