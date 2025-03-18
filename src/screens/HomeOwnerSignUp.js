import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import i18n from '../../i18n';

const HomeOwnerSignUp = ({ navigation }) => {
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    address: '',
    termsAccepted: false,
  });

  const handleInputChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const validateInputs = () => {
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^((\+92)|0)?3\d{2}\d{7}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    for (const [key, value] of Object.entries(form)) {
      if (key !== 'termsAccepted' && value.trim() === '') {
        alert(i18n.t('alerts.emptyField'));
        return false;
      }
    }

    if (!form.username.match(usernameRegex)) {
      alert(i18n.t('alerts.invalidUsername'));
      return false;
    }
    if (!form.email.match(emailRegex)) {
      alert(i18n.t('alerts.invalidEmail'));
      return false;
    }
    if (!form.phone.match(phoneRegex)) {
      alert(i18n.t('alerts.invalidPhone'));
      return false;
    }
    if (!form.password.match(passwordRegex)) {
      alert(i18n.t('alerts.invalidPassword'));
      return false;
    }
    if (!form.termsAccepted) {
      alert(i18n.t('signUpScreen.alertTerms'));
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (validateInputs()) {
      alert(i18n.t('signUpScreen.success'));
    }
  };

  const toggleTermsAccepted = () => {
    handleInputChange('termsAccepted', !form.termsAccepted);
  };

  const handleTermsPress = () => {
    // Navigate to the Terms and Conditions screen
    navigation.navigate('TermsScreen');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back Icon */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#66785F" />
      </TouchableOpacity>

      {/* Illustration */}
      <Image
        source={require('../../assets/pictures/personal info.svg')}
        style={styles.illustration}
        resizeMode="contain"
      />

      {/* Title and Subtitle */}
      <Text style={styles.title}>{i18n.t('signUpScreen.register')}</Text>
      <Text style={styles.subtitle}>{i18n.t('signUpScreen.subtitle')}</Text>

      {/* Input Fields with Icons */}
      <View style={styles.inputWrapper}>
        <Ionicons name="person-outline" size={20} color="#66785F" />
        <TextInput
          style={styles.input}
          placeholder={i18n.t('signUpScreen.placeholders.fullName')}
          value={form.fullName}
          onChangeText={(text) => handleInputChange('fullName', text)}
        />
      </View>

      <View style={styles.inputWrapper}>
        <Ionicons name="at" size={20} color="#66785F" />
        <TextInput
          style={styles.input}
          placeholder={i18n.t('signUpScreen.placeholders.username')}
          value={form.username}
          onChangeText={(text) => handleInputChange('username', text)}
        />
      </View>

      <View style={styles.inputWrapper}>
        <Ionicons name="mail-outline" size={20} color="#66785F" />
        <TextInput
          style={styles.input}
          placeholder={i18n.t('signUpScreen.placeholders.email')}
          value={form.email}
          onChangeText={(text) => handleInputChange('email', text)}
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputWrapper}>
        <Ionicons name="call-outline" size={20} color="#66785F" />
        <TextInput
          style={styles.input}
          placeholder={i18n.t('signUpScreen.placeholders.phone')}
          value={form.phone}
          onChangeText={(text) => handleInputChange('phone', text)}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputWrapper}>
        <Ionicons name="lock-closed-outline" size={20} color="#66785F" />
        <TextInput
          style={styles.input}
          placeholder={i18n.t('signUpScreen.placeholders.password')}
          value={form.password}
          onChangeText={(text) => handleInputChange('password', text)}
          secureTextEntry
        />
      </View>

      <View style={styles.inputWrapper}>
        <Ionicons name="home-outline" size={20} color="#66785F" />
        <TextInput
          style={styles.input}
          placeholder={i18n.t('signUpScreen.placeholders.address')}
          value={form.address}
          onChangeText={(text) => handleInputChange('address', text)}
        />
      </View>

      {/* Terms and Conditions */}
      <TouchableOpacity style={styles.termsContainer} onPress={toggleTermsAccepted}>
        <View
          style={[styles.checkboxPlaceholder, form.termsAccepted && styles.checkboxSelected]}
        />
        <Text style={styles.termsText}>{i18n.t('signUpScreen.terms')}</Text>
      </TouchableOpacity>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>{i18n.t('signUpScreen.submit')}</Text>
      </TouchableOpacity>

      {/* Already Have an Account */}
      <Text style={styles.hint}>
        {i18n.t('signUpScreen.alreadyAccount')}{' '}
        <Text
          style={styles.link}
          onPress={() => navigation.navigate('Login')}>
          {i18n.t('signUpScreen.signIn')}
        </Text>
      </Text>
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
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  illustration: {
    width: 150,
    height: 100,
    marginBottom: 0,
    marginTop: -20, // Adjusted to move the image higher
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    width: '90%',
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxPlaceholder: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#66785F',
    backgroundColor: '#fff',
  },
  checkboxSelected: {
    backgroundColor: '#66785F',
  },
  termsText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#555',
  },
  submitButton: {
    backgroundColor: "#66785F",
    borderRadius: 5,
    padding: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,  // Added space between the input and the button
    marginBottom: 10, // Space at the bottom of the screen
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  hint: {
    fontSize: 14,
    color: '#555',
  },
  link: {
    color: '#de8a0d',
    fontWeight: 'bold',
  },
});

export default HomeOwnerSignUp;
