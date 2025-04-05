import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

const VerificationScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [cnic, setCnic] = useState(null);
  const [criminalRecord, setCriminalRecord] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // For showing submission progress

  // Handle document selection
  const handleDocumentPick = async (type) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*', // Allows any type of file
      });
  
      if (result.type === 'success' && result.uri) {
        const file = {
          name: result.name || 'Unknown File',
          uri: result.uri,
          type: result.mimeType || '*/*',
        };
  
        if (type === 'cnic') {
          setCnic(file); // Save CNIC file details
        } else if (type === 'criminalRecord') {
          setCriminalRecord(file); // Save Criminal Record file details
        }
      } else if (result.type === 'cancel') {
        alert(t('alerts.documentPickerCancelled'));
      }
    } catch (error) {
      console.error('Document picking error:', error);
      alert(t('alerts.documentPickerError'));
    }
  };

  // Handle form submission
  const handleSubmit = async () => { // Marking this function as async
    if (!cnic || !criminalRecord) {
      alert(t('verificationScreen.uploadDocuments'));
      return;
    }

    console.log('CNIC:', cnic);
    console.log('Criminal Record:', criminalRecord);
    
    const formData = new FormData();
    formData.append('cnic', {
      uri: cnic.uri,
      name: cnic.name,
      type: cnic.type,
    });
    formData.append('criminalRecord', {
      uri: criminalRecord.uri,
      name: criminalRecord.name,
      type: criminalRecord.type,
    });

    setIsSubmitting(true); // Set submission state to true to show the activity indicator

    try {
      const response = await mockApiCall(formData); // Async API call
      alert(`${t('alerts.registrationComplete')}\n\n${response.message}`);
    } catch (error) {
      alert(t('alerts.submissionFailed'));
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false); // Reset the submission state after the process is complete
    }
  };

  // Simulating backend submission with a mock function
  const mockApiCall = async (data) => {
    console.log('Sending to backend:', data);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ status: 'success', message: 'Mock data received' });
      }, 2000);
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back Arrow */}
      <TouchableOpacity style={styles.backArrow} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#66785F" />
      </TouchableOpacity>

      {/* Illustration */}
      <Image
        source={require('../../assets/pictures/certification.png')} // Replace with correct path
        style={styles.illustration}
      />

      {/* Title and Subtitle */}
      <Text style={styles.title}>{t('verificationScreen.title')}</Text>
      <Text style={styles.subtitle}>{t('verificationScreen.subtitle')}</Text>

      {/* Status Bar */}
      <View style={styles.statusBar}>
        <View style={[styles.circle, styles.completed]} />
        <View style={[styles.line, styles.completedLine]} />
        <View style={[styles.circle, styles.completed]} />
        <View style={[styles.line, styles.completedLine]} />
        <View style={[styles.circle, styles.completed]} />
        <View style={[styles.line, styles.completedLine]} />
        <View style={[styles.circle, styles.completed]} />
      </View>

      {/* CNIC Upload */}
      <TouchableOpacity style={styles.uploadButton} onPress={() => handleDocumentPick('cnic')}>
        <Text style={styles.uploadButtonText}>
          {cnic ? `${t('verificationScreen.uploaded')}: ${cnic.name}` : t('verificationScreen.uploadCnic')}
        </Text>
      </TouchableOpacity>

      {/* Criminal Record Upload */}
      <TouchableOpacity
        style={styles.uploadButton}
        onPress={() => handleDocumentPick('criminalRecord')}
      >
        <Text style={styles.uploadButtonText}>
          {criminalRecord
            ? `${t('verificationScreen.uploaded')}: ${criminalRecord.name}`
            : t('verificationScreen.uploadCriminalRecord')}
        </Text>
      </TouchableOpacity>

      {/* Skip Button */}
      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.skipText}>{t('profilePictureScreen.skip')}</Text>
      </TouchableOpacity>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, isSubmitting && styles.disabledButton]}
        onPress={isSubmitting ? null : handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>{t('verificationScreen.submit')}</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F7FFE5',
    padding: 20,
  },
  backArrow: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  illustration: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 30,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 30,
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#ddd',
    backgroundColor: '#66785F',
  },
  completed: {
    backgroundColor: '#66785F',
  },
  line: {
    width: 30,
    height: 2,
    backgroundColor: '#ddd',
  },
  completedLine: {
    backgroundColor: '#66785F',
  },
  uploadButton: {
    backgroundColor: '#91AC8F',
    paddingVertical: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#66785F',
    borderRadius: 5,
    padding: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  skipButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  skipText: {
    color: '#D9D9D9',
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.7,
  },
});

export default VerificationScreen;
