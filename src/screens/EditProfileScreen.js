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
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { useTranslation } from 'react-i18next';  // Import i18n hook

const EditProfileScreen = () => {
  const { t } = useTranslation();  // Use the translation hook
  const navigation = useNavigation();
  const role = "maid"; // Change to "owner" to test owner form

  // Prefilled values (can be replaced with actual data from backend)
  const [formData, setFormData] = useState({
    fullName: "Hina Bibi",
    username: "hina123",
    email: "hina@example.com",
    phone: "03001234567",
    password: "12345678",
    address: "House 15, Lahore",
    city: "Lahore",
    experience: "3",
    rate: "500",
    availability: "Full Time",
    services: "Cleaning, Cooking",
    profilePicture: "",
    cnic: "",
    policeCertificate: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      handleChange("profilePicture", result.assets[0].uri);
    }
  };

  const pickDocument = async (field) => {
    const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
    if (result.assets && result.assets.length > 0) {
      handleChange(field, result.assets[0].uri);
    } else if (result.uri) {
      handleChange(field, result.uri);
    }
  };

  const handleSave = () => {
    console.log("Profile updated:", formData);
    // Save logic here
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.header}>{t('editprofile.editProfile')}</Text> {/* Use translation */}

          <TextInput
            style={styles.input}
            placeholder={t('editprofile.fullName')}  // Translate placeholder
            value={formData.fullName}
            onChangeText={(text) => handleChange("fullName", text)}
          />

          {role === "owner" && (
            <>
              <TextInput
                style={styles.input}
                placeholder={t('editprofile.username')}  // Translate placeholder
                value={formData.username}
                onChangeText={(text) => handleChange("username", text)}
              />
              <TextInput
                style={styles.input}
                placeholder={t('editprofile.email')}  // Translate placeholder
                value={formData.email}
                onChangeText={(text) => handleChange("email", text)}
              />
              <TextInput
                style={styles.input}
                placeholder={t('editprofile.phoneNumber')}  // Translate placeholder
                value={formData.phone}
                onChangeText={(text) => handleChange("phone", text)}
              />
              <TextInput
                style={styles.input}
                placeholder={t('editprofile.password')}  // Translate placeholder
                secureTextEntry
                value={formData.password}
                onChangeText={(text) => handleChange("password", text)}
              />
              <TextInput
                style={styles.input}
                placeholder={t('editprofile.homeAddress')}  // Translate placeholder
                value={formData.address}
                onChangeText={(text) => handleChange("address", text)}
              />
            </>
          )}

          {role === "maid" && (
            <>
              <TextInput
                style={styles.input}
                placeholder={t('editprofile.phoneNumber')}  // Translate placeholder
                value={formData.phone}
                onChangeText={(text) => handleChange("phone", text)}
              />
              <TextInput
                style={styles.input}
                placeholder={t('editprofile.cityOfService')}  // Translate placeholder
                value={formData.city}
                onChangeText={(text) => handleChange("city", text)}
              />
              <TextInput
                style={styles.input}
                placeholder={t('editprofile.password')}  // Translate placeholder
                secureTextEntry
                value={formData.password}
                onChangeText={(text) => handleChange("password", text)}
              />
              <TextInput
                style={styles.input}
                placeholder={t('editprofile.yearsOfExperience')}  // Translate placeholder
                value={formData.experience}
                onChangeText={(text) => handleChange("experience", text)}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                placeholder={t('editprofile.ratePerHour')}  // Translate placeholder
                value={formData.rate}
                onChangeText={(text) => handleChange("rate", text)}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                placeholder={t('editprofile.availability')}  // Translate placeholder
                value={formData.availability}
                onChangeText={(text) => handleChange("availability", text)}
              />
              <TextInput
                style={styles.input}
                placeholder={t('editprofile.servicesOffered')}  // Translate placeholder
                value={formData.services}
                onChangeText={(text) => handleChange("services", text)}
              />

              <TouchableOpacity style={styles.pickerButton} onPress={pickImage}>
                <Text style={styles.pickerText}>{t('editprofile.pickProfilePicture')}</Text> {/* Translate button text */}
              </TouchableOpacity>
              {formData.profilePicture !== "" && (
                <Image
                  source={{ uri: formData.profilePicture }}
                  style={styles.imagePreview}
                />
              )}

              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => pickDocument("cnic")}
              >
                <Text style={styles.pickerText}>{t('editprofile.uploadCNIC')}</Text> {/* Translate button text */}
              </TouchableOpacity>
              {formData.cnic !== "" && (
                <Text style={styles.docName}>{t('editprofile.cnicSelected')}</Text> 
              )}

              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => pickDocument("policeCertificate")}
              >
                <Text style={styles.pickerText}>{t('editprofile.uploadPoliceCertificate')}</Text> {/* Translate button text */}
              </TouchableOpacity>
              {formData.policeCertificate !== "" && (
                <Text style={styles.docName}>{t('editprofile.certificateSelected')}</Text> 
              )}
            </>
          )}

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>{t('editprofile.save')}</Text> {/* Translate button text */}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7FFE5",
  },
  container: {
    flex: 1,
    backgroundColor: "#F7FFE5",
  },
  scrollContainer: {
    padding: 20,
    flexGrow: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  pickerButton: {
    backgroundColor: "#BFD8AF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 6,
  },
  pickerText: {
    color: "#333",
    fontWeight: "bold",
  },
  imagePreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 8,
    alignSelf: "center",
  },
  docName: {
    textAlign: "center",
    color: "green",
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: "#91AC8F",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
