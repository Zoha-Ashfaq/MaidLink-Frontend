import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { registerMaid } from '../services/api';

const MaidSignUp = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [form, setForm] = useState({
    userName: 'Test Maid Name',
    phone: '03001234567',
    password: 'TestPass@123',
    serviceCity: 'Lahore',
    experience: 2,
    ratePerHour: 1000,
    availability: 'Full Time',
    services: ['Cleaning', 'Cooking'],
    termsAccepted: true,
    role: 'maid',
    fcm: 'test_fcm_token'
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  // Validation patterns
  const fullNamePattern = /^[A-Za-z][A-Za-z ]*[A-Za-z]$/;
  const phonePattern = /^((\+92)|0)?3\d{2}\d{7}$/;
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Function to handle input changes
  const handleInputChange = (key, value) => {
    setForm({ ...form, [key]: value });
    setError('');
  };

  // Validate the inputs
  const validateInputs = () => {
    if (!form.userName || !form.phone || !form.password || !form.serviceCity) {
      setError(t('alerts.emptyField'));
      return false;
    }

    if (!fullNamePattern.test(form.userName)) {
      setError(t('alerts.invalidName'));
      return false;
    }

    if (!phonePattern.test(form.phone)) {
      setError(t('alerts.invalidPhone'));
      return false;
    }

    if (!passwordPattern.test(form.password)) {
      setError(t('alerts.invalidPassword'));
      return false;
    }

    if (!form.termsAccepted) {
      setError(t('alerts.acceptTerms'));
      return false;
    }

    return true;
  };

  // Handle next button press
  const handleNext = () => {
    if (!validateInputs()) return;
  
    // Format phone
    const formattedPhone = form.phone.startsWith('+92') ? form.phone : `+92${form.phone}`;
    
    const userData = {
      ...form,
      phone: formattedPhone,
    };
  
    // Navigate to WorkDetailsScreen and pass userData
    navigation.navigate('WorkDetailsScreen', { userData });
  };
  
  // Handle back button press
  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Ionicons name="arrow-back" size={24} color="#66785F" />
      </TouchableOpacity>

      {/* Illustration */}
      <Image source={require('../../assets/pictures/personal info.png')} style={styles.illustration} />

      {/* Title and Subtitle */}
      <Text style={styles.title}>{t('signUpScreen.register')}</Text>
      <Text style={styles.subtitle}>{t('signUpScreen.subtitle')}</Text>

      {/* Status Bar */}
      <View style={styles.statusBar}>
        <View style={[styles.statusCircle, styles.filled]} />
        <Text style={styles.statusLine}></Text>
        <View style={styles.statusCircle} />
        <Text style={styles.statusLine}></Text>
        <View style={styles.statusCircle} />
        <Text style={styles.statusLine}></Text>
        <View style={styles.statusCircle} />
      </View>

      {/* Input Fields with Icons */}
      <View style={styles.inputContainer}>
        <Ionicons name="person" size={24} color="#66785F" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder={t('maidSignUpScreen.placeholders.fullName')}
          value={form.userName}
          onChangeText={(text) => handleInputChange('userName', text)}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Ionicons name="call" size={24} color="#66785F" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder={t('maidSignUpScreen.placeholders.phone')}
          value={form.phone}
          onChangeText={(text) => handleInputChange('phone', text)}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="location" size={24} color="#66785F" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder={t('maidSignUpScreen.placeholders.cityOfService')}
          value={form.serviceCity}
          onChangeText={(text) => handleInputChange('serviceCity', text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed" size={24} color="#66785F" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder={t('maidSignUpScreen.placeholders.password')}
          value={form.password}
          onChangeText={(text) => handleInputChange('password', text)}
          secureTextEntry
        />
      </View>

      {/* Error message */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Next Button */}
      <TouchableOpacity 
        style={[styles.nextButton, loading && styles.buttonDisabled]} 
        onPress={handleNext}
        disabled={loading}
      >
        <Text style={styles.nextButtonText}>
          {loading ? t('signUpScreen.registering') : t('maidSignUpScreen.next')}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#F7FFE5',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 20,
  },
  illustration: {
    width: '150',
    height: '100',
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 30,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '80%',
    marginBottom: 30,
  },
  statusCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  filled: {
    backgroundColor: '#66785F',
  },
  statusLine: {
    width: 30,
    height: 2,
    backgroundColor: '#ddd',
    alignSelf: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    width: '90%',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: "#66785F",
    borderRadius: 5,
    padding: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 50,  // Added space between the input and the button
    marginBottom: 10, // Space at the bottom of the screen
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
});

export default MaidSignUp;
