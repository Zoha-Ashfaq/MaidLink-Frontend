import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import i18n from '../../i18n'; // Import translation

// Mock function for sending OTP (to be replaced with backend service)
const sendOTP = (phoneNumber) => {
  console.log('OTP sent to:', phoneNumber);
  return '123456'; // Mock OTP
};

const ForgotPasswordScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');

  const handleSendOtp = () => {
    if (phoneNumber.length === 11) {
      const otp = sendOTP(phoneNumber);
      setGeneratedOtp(otp);
      setIsOtpSent(true);
      Alert.alert(i18n.t('otpSent'));
    } else {
      Alert.alert(i18n.t('invalidPhoneNumber'));
    }
  };

  const handleVerifyOtp = () => {
    if (otp === generatedOtp) {
      setIsOtpVerified(true);
      Alert.alert(i18n.t('otpVerified'));
    } else {
      Alert.alert(i18n.t('incorrectOtp'));
    }
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleResetPassword = () => {
    if (validatePassword(newPassword)) {
      Alert.alert(i18n.t('passwordResetSuccess'));
      navigation.navigate('Login'); // Navigate to login screen after password reset
    } else {
      Alert.alert(
        i18n.t('alerts.invalidPassword'),
       
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Icon */}
      <TouchableOpacity style={styles.backIcon} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#66785F" />
      </TouchableOpacity>

      {/* Illustration */}
      <Image
        source={require('../../assets/pictures/forgot password.svg')} // Replace with your image path
        style={styles.illustration}
      />

      <Text style={styles.title}>{i18n.t('forgotPassword')}</Text>

      {/* Phone Number Input */}
      <TextInput
        style={styles.input}
        placeholder={i18n.t('phoneNumber')}
        placeholderTextColor="#aaa"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />

      {!isOtpSent ? (
        <TouchableOpacity style={styles.button} onPress={handleSendOtp}>
          <Text style={styles.buttonText}>{i18n.t('sendOtp')}</Text>
        </TouchableOpacity>
      ) : !isOtpVerified ? (
        <>
          {/* OTP Input */}
          <TextInput
            style={styles.input}
            placeholder={i18n.t('otp')}
            placeholderTextColor="#aaa"
            value={otp}
            onChangeText={setOtp}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
            <Text style={styles.buttonText}>{i18n.t('verifyOtp')}</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          {/* New Password Input */}
          <TextInput
            style={styles.input}
            placeholder={i18n.t('newPassword')}
            placeholderTextColor="#aaa"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
            <Text style={styles.buttonText}>{i18n.t('resetPassword')}</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FFE5',
    padding: 20,
  },
  backIcon: {
    position: 'absolute',
    top: 20,
    left: 10,
    zIndex: 1,// Ensure the back icon is above other content
  },
  illustration: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: 'black',
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
  button: {
    backgroundColor: '#66785F',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 22,
  },
});

export default ForgotPasswordScreen;
