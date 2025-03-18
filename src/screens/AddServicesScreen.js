import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Icon,
} from 'react-native';
import { useTranslation } from 'react-i18next';

const AddServicesScreen = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { selectedServices, onSave } = route.params;
  const [services, setServices] = useState(selectedServices);
  const [serviceInput, setServiceInput] = useState('');
  const suggestedServices = [
    t('addServicesScreen.suggestedServices.cleaning'),
    t('addServicesScreen.suggestedServices.cooking'),
    t('addServicesScreen.suggestedServices.childcare'),
    t('addServicesScreen.suggestedServices.elderCare'),
    t('addServicesScreen.suggestedServices.gardening'),
  ];

  // Handle adding a suggested service
  const handleAddService = (service) => {
    if (!services.includes(service)) {
      setServices([...services, service]);
    }
    setServiceInput(''); // Clear input after adding service
  };

  // Handle removing a selected service
  const handleRemoveService = (service) => {
    setServices(services.filter((item) => item !== service));
  };

  // Handle saving the services
  const handleSave = () => {
    if (services.length === 0 && serviceInput.trim() === '') {
      alert(t('addServicesScreen.errorSelectService')); // Alert if no service is selected or typed
      return;
    }

    // Save custom input if any
    if (serviceInput.trim() !== '' && !services.includes(serviceInput.trim())) {
      setServices([...services, serviceInput.trim()]);
    }

    if (typeof onSave === 'function') {
      onSave(services); // Pass the updated services back to the parent
    } else {
      console.error('onSave function is not defined!');
    }
    navigation.goBack(); // Navigate back to the previous screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('addServicesScreen.title')}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={t('addServicesScreen.searchPlaceholder')}
          value={serviceInput}
          onChangeText={(text) => setServiceInput(text)}
        />
        {/* Add icon to add custom service */}
        {serviceInput.trim() !== '' && !services.includes(serviceInput.trim()) && (
          <TouchableOpacity
            style={styles.addIconContainer}
            onPress={() => handleAddService(serviceInput.trim())}
          >
            <Text style={styles.addIcon}>+</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={suggestedServices.filter((service) =>
          service.toLowerCase().includes(serviceInput.toLowerCase())
        )}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.serviceItem} onPress={() => handleAddService(item)}>
            <Text style={styles.serviceText}>{item}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <View style={styles.selectedServicesContainer}>
        {services.map((service, index) => (
          <View key={index} style={styles.selectedServiceItem}>
            <Text style={styles.selectedServiceText}>{service}</Text>
            <TouchableOpacity onPress={() => handleRemoveService(service)}>
              <Text style={styles.removeService}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <TouchableOpacity
        style={[styles.saveButton, { opacity: services.length === 0 && serviceInput.trim() === '' ? 0.5 : 1 }]}
        onPress={handleSave}
        disabled={services.length === 0 && serviceInput.trim() === ''}
      >
        <Text style={styles.saveButtonText}>{t('addServicesScreen.saveButton')}</Text>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#B7C0D4',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#333333',
    backgroundColor: '#FFFFFF',
  },
  addIconContainer: {
    padding: 10,
    backgroundColor: '#66785F', // Primary color
    borderRadius: 50,
    marginLeft: 10,
  },
  addIcon: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  serviceItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#D9D9D9',
    marginBottom: 10,
    borderRadius: 8,
  },
  serviceText: {
    fontSize: 16,
    color: 'black',
  },
  selectedServicesContainer: {
    marginVertical: 25,
  },
  selectedServiceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#d5cfcb',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  selectedServiceText: {
    fontSize: 16,
    color: '#F7FFE5',
  },
  removeService: {
    fontSize: 20,
    color: '#FF4F5C',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: "#66785F",
    borderRadius: 5,
    padding: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,  // Added space between the input and the button
    marginBottom: 5, // Space at the bottom of the screen
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
  },
});

export default AddServicesScreen;
