import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Platform,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system'; // Add this import
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';
import { registerMaid } from '../services/api';

const VerificationScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const [cnicFile, setCnicFile] = useState(null);
  const [criminalRecordFile, setCriminalRecordFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [networkError, setNetworkError] = useState(false);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const handleDocumentPick = async (type) => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
        multiple: false,
      });

      console.log('DocumentPicker result:', result);

      if (result.canceled || !result.assets || result.assets.length === 0) {
        console.log('User cancelled or no file selected');
        return;
      }

      const selectedAsset = result.assets[0];

      if (!selectedAsset?.uri) {
        console.error('Invalid document result:', selectedAsset);
        Alert.alert('Error', 'Failed to get file URI. Please try again.');
        return;
      }

      const fileName =
        selectedAsset.name ||
        `${type}_${Date.now()}.${selectedAsset.uri.split('.').pop() || 'jpg'}`;

      const fileData = {
        uri: selectedAsset.uri,
        type: selectedAsset.mimeType || 'application/octet-stream',
        name: fileName,
        size: selectedAsset.size || 0,
      };

      console.log(`Selected ${type} file:`, fileData);

      // On Android, copy content:// files to cache directory
      if (Platform.OS === 'android' && fileData.uri.startsWith('content://')) {
        try {
          const cacheFilePath = FileSystem.cacheDirectory + fileData.name;
          await FileSystem.copyAsync({
            from: fileData.uri,
            to: cacheFilePath,
          });
          fileData.uri = cacheFilePath;
          console.log('Copied file to cache:', cacheFilePath);
        } catch (error) {
          console.warn('Failed to copy file to cache, using original URI:', error);
        }
      }

      if (type === 'cnic') {
        setCnicFile(fileData);
      } else {
        setCriminalRecordFile(fileData);
      }

      const fileInfo = await FileSystem.getInfoAsync(fileData.uri);
      console.log('File info after pick:', fileInfo);

      Alert.alert('Success', `${type.toUpperCase()} file selected successfully`);
    } catch (error) {
      console.error('File pick error:', error);
      Alert.alert('Error', 'Unable to pick file. Please try again.');
    }
  };

  const handleSubmit = async () => {
    try {
      if (!cnicFile || !criminalRecordFile) {
        Alert.alert('Error', 'Please upload both documents');
        return;
      }

      setIsSubmitting(true);
      const formData = new FormData();
      const userData = route.params?.userData;

      // Log the incoming data for debugging
      //console.log('Submitting user data:', userData);

      // Add basic user data
      formData.append('userName', userData.userName);
      formData.append('phone', userData.phone);
      formData.append('password', userData.password);
      formData.append('serviceCity', userData.serviceCity);
      formData.append('experience', userData.yearsOfExperience);
      formData.append('ratePerHour', userData.ratePerHour);
      formData.append('availability', userData.workAvailability);
      formData.append('services', JSON.stringify(userData.services || []));
      formData.append('role', 'maid');
      formData.append('fcm', userData.fcm || 'temp_dummy_fcm_token');

      // Add files with proper mime types
      if (userData.profileImage) {
        const profileImageFile = {
          uri: userData.profileImage,
          type: 'image/jpeg',
          name: 'profile.jpg'
        };
        formData.append('profileImg', profileImageFile);
      }

      // Add CNIC file
      const cnicFileData = {
        uri: cnicFile.uri,
        type: cnicFile.type || 'image/jpeg',
        name: cnicFile.name || 'cnic.jpg'
      };
      formData.append('cnic', cnicFileData);

      // Add Criminal Record file
      const criminalFileData = {
        uri: criminalRecordFile.uri,
        type: criminalRecordFile.type || 'image/jpeg',
        name: criminalRecordFile.name || 'criminal_record.jpg'
      };
      formData.append('criminalRecordCertificate', criminalFileData);

      console.log('FormData contents:', Object.fromEntries(formData._parts));

      const response = await registerMaid(formData);

      if (response.status) {
        Alert.alert('Success', 'Registration successful!', [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]);
      }
    } catch (error) {
      console.error('Register Maid Error Details:', error);
      Alert.alert('Error', error.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };


  const renderFilePreview = (file) => {
    if (!file) return null;
    const isImage = file.type?.startsWith('image/');

    console.log('Rendering preview for file:', {
      uri: file.uri,
      type: file.type,
      isImage
    });

    return (
      <View style={styles.previewContainer}>
        {isImage ? (
          <>
            <Image
              source={{
                uri: file.uri,
                // Force refresh and avoid caching issues
                cache: 'reload',
                // Add a timestamp to prevent caching
                headers: { 'Cache-Control': 'no-cache' }
              }}
              style={styles.previewImage}
              resizeMode="contain"
              onLoadStart={() => console.log('Image load started')}
              onLoad={() => console.log('Image loaded successfully')}
              onError={(e) => console.error('Image load error:', e.nativeEvent.error)}
            />
            <TouchableOpacity
              style={styles.viewImageButton}
              onPress={() => console.log('View full image:', file.uri)}
            >
              <Text style={styles.viewImageText}>View Full Image</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.documentPreview}>
            <Ionicons name="document" size={60} color="#66785F" />
            <Text style={styles.documentTypeText}>
              {file.type?.split('/')[1]?.toUpperCase() || 'Document'}
            </Text>
          </View>
        )}
        <Text style={styles.fileName} numberOfLines={1} ellipsizeMode="middle">
          {file.name}
        </Text>
        <Text style={styles.fileSize}>
          {file.size ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : 'Unknown size'}
        </Text>
      </View>
    );
  };
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <TouchableOpacity
        style={styles.backArrow}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={24} color="#66785F" />
      </TouchableOpacity>

      <Image
        source={require('../../assets/pictures/certification.png')}
        style={styles.illustration}
        resizeMode="contain"
      />

      <Text style={styles.title}>{t('verificationScreen.title')}</Text>
      <Text style={styles.subtitle}>{t('verificationScreen.subtitle')}</Text>

      {networkError && (
        <View style={styles.networkError}>
          <Ionicons name="warning" size={20} color="#FF3B30" />
          <Text style={styles.networkErrorText}>Network connection error</Text>
        </View>
      )}

      <View style={styles.statusBar}>
        {[...Array(4)].map((_, i) => (
          <React.Fragment key={i}>
            <View style={[styles.circle, styles.completed]} />
            {i < 3 && <View style={[styles.line, styles.completedLine]} />}
          </React.Fragment>
        ))}
      </View>

      {/* CNIC Upload Section */}
      <View style={styles.uploadSection}>
        <TouchableOpacity
          style={[styles.uploadButton, isSubmitting && styles.buttonDisabled]}
          onPress={() => handleDocumentPick('cnic')}
          activeOpacity={0.7}
          disabled={isSubmitting}
        >
          <Ionicons name="cloud-upload" size={24} color="white" style={styles.uploadIcon} />
          <Text style={styles.uploadButtonText}>
            {t('verificationScreen.uploadCnic')}
          </Text>
        </TouchableOpacity>
        {renderFilePreview(cnicFile)}
      </View>

      {/* Criminal Record Upload Section */}
      <View style={styles.uploadSection}>
        <TouchableOpacity
          style={[styles.uploadButton, isSubmitting && styles.buttonDisabled]}
          onPress={() => handleDocumentPick('criminal')}
          activeOpacity={0.7}
          disabled={isSubmitting}
        >
          <Ionicons name="cloud-upload" size={24} color="white" style={styles.uploadIcon} />
          <Text style={styles.uploadButtonText}>
            {t('verificationScreen.uploadCriminalRecord')}
          </Text>
        </TouchableOpacity>
        {renderFilePreview(criminalRecordFile)}
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, isSubmitting && styles.buttonDisabled]}
        onPress={handleSubmit}
        activeOpacity={0.7}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.submitButtonText}>
            {t('verificationScreen.submit')}
          </Text>
        )}
      </TouchableOpacity>

      {/* Skip Button */}
      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => navigation.navigate('Login')}
        activeOpacity={0.7}
        disabled={isSubmitting}
      >
        <Text style={styles.skipText}>{t('profilePictureScreen.skip')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F7FFE5',
    alignItems: 'center',
    paddingTop: 60,
  },
  backArrow: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
    padding: 10,
  },
  illustration: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#66785F',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  networkError: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  networkErrorText: {
    color: '#FF3B30',
    marginLeft: 5,
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    justifyContent: 'center',
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E0E0E0',
  },
  completed: {
    backgroundColor: '#66785F',
  },
  line: {
    width: 30,
    height: 2,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 5,
  },
  completedLine: {
    backgroundColor: '#66785F',
  },
  uploadSection: {
    width: '100%',
    marginBottom: 25,
  },
  uploadButton: {
    backgroundColor: '#66785F',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  uploadIcon: {
    marginRight: 10,
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  previewContainer: {
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  previewImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  fileName: {
    fontSize: 14,
    color: '#666',
    maxWidth: '80%',
    textAlign: 'center',
  },
  fileSize: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  submitButton: {
    backgroundColor: '#66785F',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonDisabled: {
    backgroundColor: '#A8A8A8',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    marginTop: 15,
    padding: 10,
  },
  skipText: {
    color: '#66785F',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default VerificationScreen;