import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for back button
import i18n from '../../i18n'; // Assuming you have an i18n setup


const RoleSelectionScreen = ({ navigation }) => {
  const handleRoleSelect = (role) => {
    if (role === 'Maid') {
      navigation.navigate('MaidSignUp'); // Navigate to MaidSignUp screen
    } else {
      navigation.navigate('HomeOwnerSignUp'); // Navigate to HomeOwnerSignUp screen
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Icon */}
      <TouchableOpacity style={styles.backIcon} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#66785F" />
      </TouchableOpacity>

      <Text style={styles.question}>{i18n.t('roleSelection.question')}</Text>
      <Text style={styles.subheading}>{i18n.t('roleSelection.subheading')}</Text>
      <Image source={require('../../assets/pictures/interior design.svg')} style={styles.image} />

      {/* Maid Role Button */}
      <TouchableOpacity
        style={styles.roleButton}
        onPress={() => handleRoleSelect('Maid')} // Handle Maid button press
      >
        <Text style={styles.roleText}>{i18n.t('roleSelection.roles.maid')}</Text>
      </TouchableOpacity>

      {/* Homeowner Role Button */}
      <TouchableOpacity
        style={styles.roleButton}
        onPress={() => handleRoleSelect('HomeOwner')} // Handle HomeOwner button press
      >
        <Text style={styles.roleText}>{i18n.t('roleSelection.roles.homeOwner')}</Text>
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
  backIcon: {
    position: 'absolute',
    top: 20,
    left: 10,
    zIndex: 1,// Ensure the back icon is above other content
  },
  question: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subheading: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  image: {
    width: 250,
    height: 250,
    marginBottom: 40, // Increase margin to push buttons lower
    resizeMode: 'contain',
  },
  roleButton: {
    backgroundColor: "#66785F",
    borderRadius: 5,
    padding: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,  // Added space between the input and the button
    marginBottom: 10, // Space at the bottom of the screen
  },
  roleText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 18,
  },
});

export default RoleSelectionScreen;
