import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';

const WorkDetailsScreen = ({ route }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [form, setForm] = useState({
    yearsOfExperience: '',
    workAvailability: '',
    ratePerHour: '',
  });
  const [selectedServices, setSelectedServices] = useState([]);

  const handleInputChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };
  const userData = route.params?.userData || {};

  const handleNext = () => {
    if (validateInputs()) {
    
// When navigating to next screen
navigation.navigate('ProfilePictureScreen', { 
  userData: { ...userData, ...form }
});
    }
  };
  

  const validateInputs = () => {
    if (!form.yearsOfExperience || !form.workAvailability || !form.ratePerHour) {
      alert(t('alerts.emptyField'));
      return false;
    }

    if (isNaN(form.yearsOfExperience)) {
      alert(t('alerts.invalidYearsOfExperience'));
      return false;
    }

    if (isNaN(form.ratePerHour)) {
      alert(t('alerts.invalidRatePerHour'));
      return false;
    }

    if (selectedServices.length === 0) {
      alert(t('alerts.selectServices'));
      return false;
    }

    return true;
  };

  const onSave = (updatedServices) => {
    setSelectedServices(updatedServices);
  };

  // Handle back button press
  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Ionicons name="arrow-back" size={24} color="#66785F" />
      </TouchableOpacity>

      {/* Illustration */}
      <Image
        source={require('../../assets/pictures/profile details.png')} // Update with the correct illustration path
        style={styles.illustration}
      />

      {/* Title */}
      <Text style={styles.signUpTitle}>{t('workDetailsScreen.title')}</Text>
      <Text style={styles.subTitle}>{t('workDetailsScreen.subtitle')}</Text>

      {/* Status Bar */}
      <View style={styles.statusBar}>
        {/* Circle 1 */}
        <View style={[styles.circle, styles.completed]} />
        <View style={[styles.line, styles.completedLine]} />
        
        {/* Circle 2 (Current step) */}
        <View style={[styles.circle, styles.current]} />
        <View style={[styles.line, styles.currentLine]} />

        {/* Circle 3 */}
        <View style={styles.circle} />
        <View style={[styles.line, styles.inactiveLine]} />

        {/* Circle 4 */}
        <View style={styles.circle} />
      </View>

      {/* Years of Experience */}
      <View style={styles.inputContainer}>
        <Ionicons name="briefcase-outline" size={20} color="#66785F" />
        <TextInput
          style={styles.input}
          placeholder={t('workDetailsScreen.placeholders.yearsOfExperience')}
          value={form.yearsOfExperience}
          onChangeText={(text) => handleInputChange('yearsOfExperience', text)}
          keyboardType="numeric"
        />
      </View>

      {/* Rate per Hour */}
      <View style={styles.inputContainer}>
        <Ionicons name="cash-outline" size={20} color="#66785F" />
        <TextInput
          style={styles.input}
          placeholder={t('workDetailsScreen.placeholders.ratePerHour')}
          value={form.ratePerHour}
          onChangeText={(text) => handleInputChange('ratePerHour', text)}
          keyboardType="numeric"
        />
      </View>

      {/* Work Availability */}
      <Text style={styles.subTitle}>{t('workDetailsScreen.workAvailability')}</Text>
      <Picker
        selectedValue={form.workAvailability}
        style={styles.picker}
        onValueChange={(itemValue) => handleInputChange('workAvailability', itemValue)}
      >
        <Picker.Item label={t('workDetailsScreen.workAvailabilityOptions.fullTime')} value="fullTime" />
        <Picker.Item label={t('workDetailsScreen.workAvailabilityOptions.partTime')} value="partTime" />
      </Picker>

      {/* Add Services Button */}
      <TouchableOpacity
        style={styles.serviceButton}
        onPress={() =>
          navigation.navigate('AddServicesScreen', {
            selectedServices,
            onSave, // Pass the onSave function
          })
        }
      >
        <Text style={styles.serviceButtonText}>{t('workDetailsScreen.addServices')}</Text>
      </TouchableOpacity>

      {/* Next Button */}
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>{t('workDetailsScreen.next')}</Text>
      </TouchableOpacity>
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
    position: 'absolute',
    top: Platform.OS === 'ios' ? 40 : 20,
    left: 15,
    zIndex: 1,
  },
  illustration: {
    width: '150',
    height: '100',
    marginBottom: 20,
    resizeMode: 'contain',
  },
  signUpTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  subTitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 30,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
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
  inputContainer: {
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
    fontSize: 16,
    marginLeft: 10,
  },
  picker: {
    width: '90%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#722620',
    borderRadius: 5,
    marginBottom: 5,
  },
  serviceButton: {
    backgroundColor: "#66785F",
    borderRadius: 5,
    padding: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,  // Added space between the input and the button
    marginBottom: 0, // Space at the bottom of the screen
  },
  serviceButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: "#66785F",
    borderRadius: 5,
    padding: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,  // Added space between the input and the button
    marginBottom: 5, // Space at the bottom of the screen
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default WorkDetailsScreen;
