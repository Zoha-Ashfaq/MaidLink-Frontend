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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDocumentPick = async (type) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result?.assets?.length > 0) {
        const file = result.assets[0];
        const pickedFile = {
          name: file.name || 'Unknown File',
          uri: file.uri,
          type: file.mimeType || '*/*',
        };

        if (type === 'cnic') {
          setCnic(pickedFile);
        } else if (type === 'criminalRecord') {
          setCriminalRecord(pickedFile);
        }
      } else if (result.canceled) {
        alert(t('alerts.documentPickerCancelled'));
      }
    } catch (error) {
      console.error('Document picking error:', error);
      alert(t('alerts.documentPickerError'));
    }
  };

  const handleSubmit = async () => {
    if (!cnic || !criminalRecord) {
      alert(t('verificationScreen.uploadDocuments'));
      return;
    }

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

    setIsSubmitting(true);

    try {
      const response = await mockApiCall(formData);
      alert(`${t('alerts.registrationComplete')}\n\n${response.message}`);
      navigation.navigate('Login'); // <-- Navigate to Login after successful submission
    } catch (error) {
      alert(t('alerts.submissionFailed'));
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const mockApiCall = async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ status: 'success', message: 'Mock data received' });
      }, 2000);
    });
  };

  const renderFilePreview = (file) => {
    if (!file) return null;
    const isImage = file.type?.startsWith('image/');

    return (
      <View style={styles.previewContainer}>
        {isImage ? (
          <Image source={{ uri: file.uri }} style={styles.previewImage} />
        ) : (
          <Ionicons name="document" size={40} color="#66785F" />
        )}
        <Text style={styles.fileName}>{file.name}</Text>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backArrow} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#66785F" />
      </TouchableOpacity>

      <Image
        source={require('../../assets/pictures/certification.png')}
        style={styles.illustration}
      />

      <Text style={styles.title}>{t('verificationScreen.title')}</Text>
      <Text style={styles.subtitle}>{t('verificationScreen.subtitle')}</Text>

      <View style={styles.statusBar}>
        {[...Array(4)].map((_, i) => (
          <React.Fragment key={i}>
            <View style={[styles.circle, styles.completed]} />
            {i < 3 && <View style={[styles.line, styles.completedLine]} />}
          </React.Fragment>
        ))}
      </View>

      {/* CNIC Upload */}
      <TouchableOpacity style={styles.uploadButton} onPress={() => handleDocumentPick('cnic')}>
        <Text style={styles.uploadButtonText}>
          {t('verificationScreen.uploadCnic')}
        </Text>
      </TouchableOpacity>
      {renderFilePreview(cnic)}

      {/* Criminal Record Upload */}
      <TouchableOpacity style={styles.uploadButton} onPress={() => handleDocumentPick('criminalRecord')}>
        <Text style={styles.uploadButtonText}>
          {t('verificationScreen.uploadCriminalRecord')}
        </Text>
      </TouchableOpacity>
      {renderFilePreview(criminalRecord)}

      {/* Skip & Submit */}
      <TouchableOpacity style={styles.skipButton} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.skipText}>{t('profilePictureScreen.skip')}</Text>
      </TouchableOpacity>

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
    marginBottom: 10,
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
    marginTop: 20,
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
  previewContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 5,
  },
  previewImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 5,
  },
  fileName: {
    fontSize: 14,
    color: '#555',
  },
});

export default VerificationScreen;
