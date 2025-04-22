import React, { useState , useContext} from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import i18n from '../../i18n';
import { loginUser } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from './UserContext'; // Import the custom hook
const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('testowner1230009');
  const [password, setPassword] = useState('TestPass@123');
  const [errorMessage, setErrorMessage] = useState('');
  const [userType, setUserType] = useState('maid');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useUser();

// LoginScreen.js - update the handleLogin function
const handleLogin = async () => {
  if (!username || !password) {
    setErrorMessage('Please enter both username and password.');
    return;
  }

  setIsLoading(true);
  setErrorMessage('');

  try {
    const response = await loginUser({ userName: username, password }, userType);
    
    // Save user data to context and storage
    const userData = {
      id: response.id,
      token: response.token,
      role: response.role,
      userName: username,
      type: userType
    };
    
    await login(userData); // Using the context login function

    // Navigate based on role or userType
    if (userType === 'maid') {
      navigation.navigate('MaidHomeScreen');
    } else {
      navigation.navigate('HometabScreen');
    }

  } catch (error) {
    const msg = error.response?.data?.msg || 'Login failed. Please try again.';
    setErrorMessage(msg);
  } finally {
    setIsLoading(false);
  }
};
  return (
    <View style={styles.container}>
      {/* Back Icon */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#66785F" />
      </TouchableOpacity>

      {/* Logo */}
      <Image source={require('../../assets/pictures/sign in.png')} style={styles.logo} />

      {/* User Type Selection */}
      <View style={styles.userTypeContainer}>
        <Text style={styles.userTypeLabel}>Login As:</Text>
        <View style={styles.radioGroup}>
          <TouchableOpacity 
            style={[
              styles.radioOption, 
              userType === 'maid' && styles.radioOptionSelected
            ]}
            onPress={() => setUserType('maid')}
            disabled={isLoading}
          >
            <View style={styles.radioCircle}>
              {userType === 'maid' && <View style={styles.radioInnerCircle} />}
            </View>
            <Text style={[
              styles.radioLabel,
              userType === 'maid' && styles.radioLabelSelected
            ]}>
              Maid
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.radioOption, 
              userType === 'user' && styles.radioOptionSelected
            ]}
            onPress={() => setUserType('user')}
            disabled={isLoading}
          >
            <View style={styles.radioCircle}>
              {userType === 'user' && <View style={styles.radioInnerCircle} />}
            </View>
            <Text style={[
              styles.radioLabel,
              userType === 'user' && styles.radioLabelSelected
            ]}>
              Homeowner
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Username Input */}
      <TextInput
        style={styles.input}
        placeholder={i18n.t('usernamePlaceholder')}
        placeholderTextColor="#aaa"
        value={username}
        onChangeText={setUsername}
        editable={!isLoading}
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder={i18n.t('passwordPlaceholder')}
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={!isLoading}
      />

      {/* Error Message */}
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      {/* Login Button */}
      <TouchableOpacity 
        style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} 
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.loginText}>{i18n.t('loginButton')}</Text>
        )}
      </TouchableOpacity>

      {/* Forgot Password */}
      <TouchableOpacity 
        onPress={() => navigation.navigate('ForgotPassword')}
        disabled={isLoading}
      >
        <Text style={styles.forgotText}>{i18n.t('forgotPassword')}</Text>
      </TouchableOpacity>

      {/* Signup Section */}
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>{i18n.t('dontHaveAccount')}</Text>
        <TouchableOpacity 
          onPress={() => navigation.navigate('RoleSelectionScreen')}
          disabled={isLoading}
        >
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
    top: 40,
    left: 20,
    zIndex: 1,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  userTypeContainer: {
    width: '100%',
    marginBottom: 20,
  },
  userTypeLabel: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
    fontWeight: '500',
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    marginRight: 10,
    flex: 1,
  },
  radioOptionSelected: {
    borderColor: '#66785F',
    backgroundColor: '#F0F7E6',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#66785F',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  radioInnerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#66785F',
  },
  radioLabel: {
    fontSize: 16,
    color: '#555',
  },
  radioLabelSelected: {
    color: '#66785F',
    fontWeight: '600',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginVertical: 10,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  errorText: {
    color: '#E74C3C',
    marginBottom: 10,
    textAlign: 'center',
    width: '100%',
  },
  loginButton: {
    backgroundColor: "#66785F",
    borderRadius: 8,
    padding: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    elevation: 2,
  },
  loginText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  forgotText: {
    color: '#de8a0d',
    fontWeight: '500',
    marginTop: 10,
    fontSize: 14,
  },
  signupContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  signupText: {
    color: '#555',
    fontSize: 14,
  },
  signupLink: {
    color: '#de8a0d',
    fontWeight: '600',
    marginLeft: 5,
    fontSize: 14,
  },
  loginButtonDisabled: {
    backgroundColor: '#95a5a6',
    opacity: 0.7,
  },
});

export default LoginScreen;