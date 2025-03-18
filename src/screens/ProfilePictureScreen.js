import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // Ensure you have this package
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons'; // For icons

const ProfilePictureScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [bio, setBio] = useState('');

  // Handle camera or gallery image selection
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.granted) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        setImage(result.uri);
      }
    } else {
      Alert.alert(t('alerts.permissionDenied'));
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.granted) {
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        setImage(result.uri);
      }
    } else {
      Alert.alert(t('alerts.permissionDenied'));
    }
  };

  const handleNext = () => {
    navigation.navigate('VerificationScreen'); // Navigate to the verification step
  };

  return (
    <View style={styles.container}>
      {/* Back Icon */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#66785F" />
      </TouchableOpacity>

      {/* Illustration and Title */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/pictures/camera.svg')} // Replace with your illustration
          style={styles.illustration}
        />
        <Text style={styles.title}>{t('profilePictureScreen.title')}</Text>
        <Text style={styles.subtitle}>{t('profilePictureScreen.subtitle')}</Text>
      </View>

      {/* Status Bar */}
      <View style={styles.statusBar}>
        {/* Circle 1 */}
        <View style={[styles.circle, styles.completed]} />
        <View style={[styles.line, styles.completedLine]} />
        
        {/* Circle 2 (Current step) */}
        <View style={[styles.circle, styles.current]} />
        <View style={[styles.line, styles.currentLine]} />

        {/* Circle 3 */}
        <View style={[styles.circle, styles.current]} />
        <View style={[styles.line, styles.currentLine]} />

        {/* Circle 4 */}
        <View style={styles.circle} />
      </View>
      {/* Profile Picture Upload */}
      <View style={styles.imageContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.profileImage} />
        ) : (
          <Text style={styles.imagePlaceholder}>{t('profilePictureScreen.uploadImage')}</Text>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={takePhoto}>
            <Ionicons name="camera" size={24} color="#fff" />
            <Text style={styles.buttonText}>{t('profilePictureScreen.takePhoto')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Ionicons name="image" size={24} color="#fff" />
            <Text style={styles.buttonText}>{t('profilePictureScreen.selectFromGallery')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bio / Description */}
      <TextInput
        style={styles.bioInput}
        placeholder={t('profilePictureScreen.enterBio')}
        value={bio}
        onChangeText={setBio}
        multiline
        numberOfLines={4}
      />

      {/* Skip Button */}
      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => navigation.navigate('VerificationScreen')}
      >
        <Text style={styles.skipText}>{t('profilePictureScreen.skip')}</Text>
      </TouchableOpacity>

      {/* Next Button */}
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>{t('profilePictureScreen.next')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FFE5',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 40 : 20,
    left: 15,
    zIndex: 1,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
  },
  illustration: {
    width: 150,
    height: 100,
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
    backgroundColor: '#fff',
  },
  completed: {
    backgroundColor: '#66785F',
  },
  current: {
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
  currentLine: {
    backgroundColor: '#66785F',
  },
  inactiveLine: {
    backgroundColor: '#ddd',
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 30,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 10,
    padding: 20,
    backgroundColor: '#D9D9D9',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  imagePlaceholder: {
    color: '#999999',
    fontSize: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    backgroundColor: '#91AC8F',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    margin: 5,
    alignItems: 'center',
    width: '45%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bioInput: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    backgroundColor: '#D9D9D9',
    borderRadius: 5,
    marginTop: 20,
    fontSize: 16,
    textAlignVertical: 'top',
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
  nextButton: {
    backgroundColor: '#66785F',
    borderRadius: 5,
    padding: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,  // Added space between the input and the button
    marginBottom: 5, // Space at the bottom of the screen
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default ProfilePictureScreen;
