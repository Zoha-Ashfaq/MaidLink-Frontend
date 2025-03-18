import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for back icon
import i18n from '../../i18n'; // Import the i18n setup


const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = () => {
    if (username === 'Zoha' && password === '12345') {
      setErrorMessage('');
      navigation.navigate('HometabScreen'); // Navigate to SuccessScreen on successful login
    } else {
      setErrorMessage(i18n.t('invalidCredentials'));
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Icon */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#66785F" />
      </TouchableOpacity>

      {/* Logo */}
      <Image source={require('../../assets/pictures/sign in.svg')} style={styles.logo} />

      {/* Username Input */}
      <TextInput
        style={styles.input}
        placeholder={i18n.t('usernamePlaceholder')}
        placeholderTextColor="#aaa"
        value={username}
        onChangeText={setUsername}
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder={i18n.t('passwordPlaceholder')}
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Error Message */}
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>{i18n.t('loginButton')}</Text>
      </TouchableOpacity>

      {/* Forgot Password */}
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.forgotText}>{i18n.t('forgotPassword')}</Text>
      </TouchableOpacity>

      {/* Signup Section */}
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>{i18n.t('dontHaveAccount')}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('RoleSelectionScreen')}>
          <Text style={styles.signupLink}>{i18n.t('signup')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7FFE5',
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 10,
    zIndex: 1,// Ensure the back icon is above other content
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: 'grey', // Grey border for input fields
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  loginButton: {
    backgroundColor: "#66785F",
    borderRadius: 5,
    padding: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,  // Added space between the input and the button
    marginBottom: 10, // Space at the bottom of the screen
  },
  loginText: {
    color: 'white',
    fontWeight: '600',
  },
  forgotText: {
    color: '#de8a0d', // Forgot Password text color
    fontWeight: '500',
    marginTop: 10,
  },
  signupContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  signupText: {
    color: '#555',
  },
  signupLink: {
    color: '#de8a0d', // Sign Up text color
    fontWeight: '600',
    marginLeft: 5,
  },
});

export default LoginScreen;
