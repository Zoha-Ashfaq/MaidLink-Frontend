import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import colors from '../../constants/colors';
import i18n from '../../i18n'; // Import translations
import { Ionicons } from '@expo/vector-icons'; // Importing Ionicons for back icon

export default function PhoneNumberScreen({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  const validatePhoneNumber = (number) => {
    const regex = /^(\+92|0)?3\d{9}$/; // Validate a Pakistani phone number
    return regex.test(number);
  };

  const handleSendCode = () => {
    if (validatePhoneNumber(phoneNumber)) {
      Alert.alert(i18n.t('otpSent'), i18n.t('otpMessage'));
      setError('');
      navigation.navigate('OTP'); // Navigate to OTP screen
    } else {
      setError(i18n.t('invalidNumber'));
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Icon */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color='#66785F' />
      </TouchableOpacity>

      {/* Illustration */}
      <Image source={require('../../assets/pictures/sign up.svg')} style={styles.illustration} />

      {/* Title */}
      <Text style={styles.title}>{i18n.t('enterPhone')}</Text>

      {/* Input Container */}
      <View style={styles.inputContainer}>
        <Image source={require('../../assets/pictures/pakistaniFlag.png')} style={styles.flag} />
        <Text style={styles.countryCode}>+92</Text>
        <TextInput
          style={styles.input}
          placeholder={i18n.t('PhoneNumber')} // Placeholder for phone number
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          maxLength={10}
        />
      </View>

      {/* Error Message */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Send Code Button */}
      <TouchableOpacity style={styles.button} onPress={handleSendCode}>
        <Text style={styles.buttonText}>{i18n.t('sendCode')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FFE5',
    justifyContent: 'space-around',  // Ensures the elements are spaced properly
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40, // Added space at the top
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 10,
    zIndex: 1,
  },
  illustration: {
    width: 250,  // Adjusted width
    height: 250, // Adjusted height
    resizeMode: 'contain',
    marginBottom: 0, // Removed space between illustration and title
  },
  
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000', // Black color for the title
    marginBottom: 0, // Removed space between title and input field
    marginTop: -30, // Reduced negative margin to move the title up closer
  },
  
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: "#D9D9D9",
    backgroundColor: "#D9D9D9",
    borderRadius: 5,
    padding: 5,
    width: '100%',
    marginBottom: 10, // Reduced space between input container and button
  },
  flag: {
    width: 30,
    height: 20,
    marginRight: 5,
  },
  countryCode: {
    fontSize: 18,
    color: 'black',
    marginRight: 5,
  },
  input: {
    flex: 1,
    fontSize: 18,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#66785F",
    borderRadius: 5,
    padding: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,  // Added space between the input and the button
    marginBottom: 40, // Space at the bottom of the screen
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
});