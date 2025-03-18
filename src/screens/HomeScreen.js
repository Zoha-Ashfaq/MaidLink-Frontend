import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { useTranslation } from 'react-i18next';


const HomeScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation(); // useTranslation hook to access translations
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  // Function to toggle language
  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'en' ? 'ur' : 'en';
    i18n.changeLanguage(newLanguage); // Change the language in i18next
    setCurrentLanguage(newLanguage); // Update state
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{t('welcomeMessage')}</Text>
      <Button
        title={t('goToProfile')}
        onPress={() => navigation.navigate('Profile')} // Navigate to Profile screen
      />
      <Button
        title={currentLanguage === 'en' ? 'Change to Urdu' : 'Change to English'}
        onPress={toggleLanguage} // Toggle language on button press
      />
    </View>
  );
};

export default HomeScreen;
