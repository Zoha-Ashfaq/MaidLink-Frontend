import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook
import { Ionicons } from '@expo/vector-icons';
import { verifyOTP, sendOTP } from '../services/api';

const OTPScreen = ({ navigation, route }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const otpInputs = useRef([]);
  
  // Initialize translation hook
  const { t } = useTranslation();
  const { phone, serverOtp } = route.params || {};

  // Auto-fill OTP when received
  useEffect(() => {
    if (serverOtp) {
      console.log('Auto-filling OTP:', serverOtp);
      const otpArray = serverOtp.toString().split('');
      setOtp(otpArray);
      
      // Auto-verify after a short delay
      setTimeout(() => {
        verifyOtpCode(otpArray.join(''));
      }, 500);
    }
  }, [serverOtp]);

  const handleChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;

    // Move focus to the next input if the current one is filled
    if (value && index < otpInputs.current.length - 1) {
      otpInputs.current[index + 1].focus();
    }

    setOtp(newOtp);
  };

  const verifyOtpCode = async (manualOtp) => {
    const enteredOtp = manualOtp || otp.join('');
    console.log('Verifying OTP:', enteredOtp);
    
    if (enteredOtp.length !== 6) {
      setError(t('errorMessage'));
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await verifyOTP(phone, enteredOtp);
      console.log('Verify OTP Response:', response);
      
      if (response.status) {
        Alert.alert(
          t('success'),
          t('otpVerified'),
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Login')
            }
          ]
        );
      } else {
        setError(response.msg || t('errorMessage'));
        resetOtp();
      }
    } catch (error) {
      console.error('Verification Error:', error);
      setError(error.response?.data?.msg || t('errorMessage'));
      resetOtp();
    } finally {
      setLoading(false);
    }
  };

  const resetOtp = () => {
    setOtp(['', '', '', '', '', '']); // Clear OTP array
    otpInputs.current[0].focus(); // Move focus back to the first input
  };

  const handleResendCode = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await sendOTP(phone);
      
      if (response.status) {
        route.params.serverOtp = response.otp;
        // Auto-fill will happen through useEffect
        Alert.alert(t('otpSent'), t('otpMessage'));
      } else {
        setError(response.msg || t('otpError'));
      }
    } catch (error) {
      console.error('Resend Error:', error);
      setError(error.response?.data?.msg || t('otpError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Icon */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIconContainer}>
        <Ionicons name="arrow-back" size={30} color="#66785F" />
      </TouchableOpacity>
      <Image source={require('../../assets/pictures/authentication.png')} style={styles.image} />
      <Text style={styles.title}>{t('otpTitle')}</Text> {/* Translate title */}
      <Text style={styles.subtitle}>{t('otpSubtitle')}</Text> {/* Translate subtitle */}
      
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => otpInputs.current[index] = ref}
            style={styles.otpInput}
            value={digit}
            onChangeText={(value) => handleChange(index, value)}
            keyboardType="numeric"
            maxLength={1}
            editable={false} // Make inputs non-editable since it's auto-filled
          />
        ))}
      </View>
      
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      
      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>{t('didNotReceiveCode')}</Text>
        <TouchableOpacity 
          style={styles.resendButton}
          onPress={handleResendCode}
          disabled={loading}
        >
          <Text style={styles.resendButtonText}>{t('resendButton')}</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={[styles.nextButton, loading && styles.buttonDisabled]} 
        onPress={() => verifyOtpCode()}
        disabled={loading}
      >
        <Text style={styles.nextText}>
          {loading ? t('verifying') : t('Verify')}
        </Text>
      </TouchableOpacity>
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
  backIconContainer: {
    position: 'absolute',
    top: 20,
    left: 10,
    zIndex: 1,// Ensure the back icon is above other content
  },
  image: {
    width: 120,  // Increased size of the image
    height: 120, // Increased size of the image
    marginBottom: 30, // Moved image higher
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
    color: '#555',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  otpInput: {
    width: 45,
    height: 50,
    borderBottomWidth: 2,
    borderBottomColor: '#888', // Grey color for OTP input boxes
    marginHorizontal: 5,
    fontSize: 18,
    textAlign: 'center',
    color: '#333',
    backgroundColor: '#f0f0f0', // Light grey background
  },
  errorText: {
    color: 'red',
    marginTop: 5,
    fontSize: 14,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  resendText: {
    color: '#555',
    fontWeight: '600',
    marginRight: 5,
  },
  resendButton: {
    color: '#722620',
  },
  resendButtonText: {
    color: '#722620', // Mehroon color for the resend button text
  },
  nextButton: {
    backgroundColor: "#66785F",
    borderRadius: 5,
    padding: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 60,  // Added space between the input and the button
    marginBottom: 10, // Space at the bottom of the screen
  },
  nextText: {
    color: 'white',
    fontWeight: '600',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
});

export default OTPScreen;
