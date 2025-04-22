import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { useTranslation } from 'react-i18next';
import { useUser } from './UserContext';
import api from '../services/api';
import { getFileType } from '../fileUtils';

const EditProfileScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    userName: "",
    email: "",
    phone: "",
    password: "",
    homeAddress: "",
    city: "",
    experience: "",
    ratePerHour: "",
    availability: "",
    services: [],
    profileImg: null,
    cnic: null,
    criminalRecordCertificate: null,
  });

  const availabilityOptions = [
    { id: 'Full Time', label: 'Full Time' },
    { id: 'Part Time', label: 'Part Time' }
  ];

  const suggestedServices = [
    { id: 'Cleaning', label: 'Cleaning' },
    { id: 'Cooking', label: 'Cooking' },
    { id: 'Childcare', label: 'Childcare' },
    { id: 'Elder Care', label: 'Elder Care' },
    { id: 'Gardening', label: 'Gardening' }
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(user?.role === 'maid' ? '/maid/get-user' : '/user/get-user');
        const userData = response.data.userInfo || response.data;
        
        console.log("Fetched user data:", userData); // Add this for debugging

        setFormData(prev => ({
          ...prev,
          name: userData.name || "",
          userName: userData.userName || "",
          email: userData.email || "",
          phone: userData.phone?.toString() || "",
          homeAddress: userData.homeAddress || "",
          city: userData.city || "",
          experience: userData.experience?.toString() || "",
          ratePerHour: userData.ratePerHour?.toString() || "",
          availability: userData.availability || "",
          services: userData.services || [],
          profileImg: userData.profileImg ? { uri: userData.profileImg } : null,
          cnic: userData.cnic ? { uri: userData.cnic } : null,
          criminalRecordCertificate: userData.criminalRecordCertificate 
            ? { uri: userData.criminalRecordCertificate } 
            : null,
        }));

      } catch (error) {
        console.error('Failed to fetch user data:', error);
        Alert.alert('Error', 'Failed to fetch user data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleChange = (field, value) => {
    console.log(`Updating field: ${field} with value: ${value}`); // Add this for debugging
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleService = (serviceId) => {
    setFormData(prev => {
      const newServices = prev.services.includes(serviceId)
        ? prev.services.filter(id => id !== serviceId)
        : [...prev.services, serviceId];
      return { ...prev, services: newServices };
    });
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      handleChange("profileImg", {
        uri: result.assets[0].uri,
        name: result.assets[0].uri.split('/').pop(),
        type: getFileType(result.assets[0].uri)
      });
    }
  };

  const pickDocument = async (field) => {
    const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
    if (result.assets && result.assets.length > 0) {
      handleChange(field, {
        uri: result.assets[0].uri,
        name: result.assets[0].name,
        type: getFileType(result.assets[0].uri, result.assets[0].name)
      });
    }
  };

  const createFormData = () => {
    const data = new FormData();
    
    // Common fields for both roles
    data.append('phone', formData.phone);
    
    if (user.role === 'maid') {
      // Maid specific fields
      data.append('userName', formData.userName);
      data.append('city', formData.city);
      data.append('experience', formData.experience);
      data.append('ratePerHour', formData.ratePerHour);
      data.append('availability', formData.availability);
      data.append('services', formData.services.join(', '));
      
      if (formData.cnic) {
        data.append('cnic', {
          uri: formData.cnic.uri,
          name: formData.cnic.name || `cnic_${Date.now()}`,
          type: formData.cnic.type || 'application/octet-stream'
        });
      }
      
      if (formData.criminalRecordCertificate) {
        data.append('criminalRecordCertificate', {
          uri: formData.criminalRecordCertificate.uri,
          name: formData.criminalRecordCertificate.name || `certificate_${Date.now()}`,
          type: formData.criminalRecordCertificate.type || 'application/octet-stream'
        });
      }
    } else {
      // Owner specific fields
      data.append('name', formData.name);
      data.append('userName', formData.userName);
      data.append('email', formData.email);
      data.append('homeAddress', formData.homeAddress);
      
      if (formData.password) {
        data.append('password', formData.password);
      }
    }
    
    // Profile picture for both roles
    if (formData.profileImg) {
      data.append('profileImg', {
        uri: formData.profileImg.uri,
        name: formData.profileImg.name || `profile_${Date.now()}`,
        type: formData.profileImg.type || 'image/jpeg'
      });
    }
    
    return data;
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const formDataToSend = createFormData();
      
      let response;
      if (user.role === 'maid') {
        response = await api.put('/maid/edit-profile', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        response = await api.put('/user/edit-profile', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      
      Alert.alert('Success', 'Profile updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Update failed:', error);
      const errorMessage = error.response?.data?.msg || 
                         error.response?.data?.message || 
                         'Failed to update profile. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#91AC8F" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Edit Profile</Text>
        </View>

        <View style={styles.formContainer}>
          {user?.role === "homeowner" ? (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(text) => handleChange("name", text)}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Username</Text>
                <TextInput
                  style={styles.input}
                  value={formData.userName}
                  onChangeText={(text) => handleChange("userName", text)}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={formData.email}
                  onChangeText={(text) => handleChange("email", text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  secureTextEntry
                  value={formData.password}
                  onChangeText={(text) => handleChange("password", text)}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Home Address</Text>
                <TextInput
                  style={styles.input}
                  value={formData.homeAddress}
                  onChangeText={(text) => handleChange("homeAddress", text)}
                />
              </View>
            </>
          ) : (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  value={formData.userName}
                  onChangeText={(text) => handleChange("userName", text)}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.label}>City of Service</Text>
                <TextInput
                  style={styles.input}
                  value={formData.city}
                  onChangeText={(text) => handleChange("city", text)}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Years of Experience</Text>
                <TextInput
                  style={styles.input}
                  value={formData.experience}
                  onChangeText={(text) => handleChange("experience", text)}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Rate Per Hour</Text>
                <TextInput
                  style={styles.input}
                  value={formData.ratePerHour}
                  onChangeText={(text) => handleChange("ratePerHour", text)}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Availability</Text>
                <View style={styles.availabilityContainer}>
                  {availabilityOptions.map(option => (
                    <TouchableOpacity
                      key={option.id}
                      style={[
                        styles.availabilityOption,
                        formData.availability === option.id && styles.selectedOption
                      ]}
                      onPress={() => handleChange('availability', option.id)}
                    >
                      <Text style={[
                        styles.optionText,
                        formData.availability === option.id && styles.selectedOptionText
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Services Offered</Text>
                <View style={styles.servicesContainer}>
                  {suggestedServices.map(service => (
                    <TouchableOpacity
                      key={service.id}
                      style={[
                        styles.serviceOption,
                        formData.services.includes(service.id) && styles.selectedService
                      ]}
                      onPress={() => toggleService(service.id)}
                    >
                      <Text style={[
                        styles.serviceText,
                        formData.services.includes(service.id) && styles.selectedServiceText
                      ]}>
                        {service.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.uploadContainer}>
                <Text style={styles.label}>Profile Picture</Text>
                <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                  <Text style={styles.uploadButtonText}>
                    {formData.profileImg 
                      ? 'Change Picture' 
                      : 'Upload Picture'}
                  </Text>
                </TouchableOpacity>
                {formData.profileImg && (
                  <Image
                    source={{ uri: formData.profileImg.uri }}
                    style={styles.imagePreview}
                  />
                )}
              </View>

              <View style={styles.uploadContainer}>
                <Text style={styles.label}>CNIC Document</Text>
                <TouchableOpacity 
                  style={styles.uploadButton}
                  onPress={() => pickDocument("cnic")}
                >
                  <Text style={styles.uploadButtonText}>
                    {formData.cnic 
                      ? 'Change Document' 
                      : 'Upload Document'}
                  </Text>
                </TouchableOpacity>
                {formData.cnic && (
                  <Text style={styles.uploadedFileName}>{formData.cnic.name || "Document uploaded"}</Text>
                )}
              </View>

              <View style={styles.uploadContainer}>
                <Text style={styles.label}>Police Certificate</Text>
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={() => pickDocument("criminalRecordCertificate")}
                >
                  <Text style={styles.uploadButtonText}>
                    {formData.criminalRecordCertificate 
                      ? 'Change Document' 
                      : 'Upload Document'}
                  </Text>
                </TouchableOpacity>
                {formData.criminalRecordCertificate && (
                  <Text style={styles.uploadedFileName}>{formData.criminalRecordCertificate.name || "Document uploaded"}</Text>
                )}
              </View>
            </>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={formData.phone}
            onChangeText={(text) => handleChange("phone", text)}
            keyboardType="phone-pad"
          />
        </View>
        
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7FFE5",
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  headerContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2D3748",
  },
  formContainer: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    padding: 14,
    backgroundColor: "#fff",
    fontSize: 16,
    color: '#2D3748',
  },
  availabilityContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  availabilityOption: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E0',
    backgroundColor: '#fff',
  },
  selectedOption: {
    backgroundColor: '#91AC8F',
    borderColor: '#91AC8F',
  },
  optionText: {
    color: '#4A5568',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#fff',
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  serviceOption: {
    width: '48%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E0',
    backgroundColor: '#fff',
  },
  selectedService: {
    backgroundColor: '#BFD8AF',
    borderColor: '#91AC8F',
  },
  serviceText: {
    color: '#4A5568',
    textAlign: 'center',
    fontWeight: '500',
  },
  selectedServiceText: {
    color: '#2D3748',
    fontWeight: '600',
  },
  uploadContainer: {
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: "#BFD8AF",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  uploadButtonText: {
    color: "#2D3748",
    fontWeight: "600",
  },
  uploadedFileName: {
    marginTop: 8,
    color: '#4A5568',
    fontSize: 14,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 12,
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: '#91AC8F',
  },
  saveButton: {
    backgroundColor: "#91AC8F",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: 'center',
    height: 56,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#F7FFE5",
  },
});

export default EditProfileScreen;