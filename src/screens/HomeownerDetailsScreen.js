import React from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, Image, StyleSheet, ActivityIndicator , ScrollView } from 'react-native';
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import api from '../services/api';
import { useUser } from './UserContext';

const HomeownerDetailsScreen = ({ route, navigation }) => {
  const { t } = useTranslation();
    const { user } = useUser();
  const { orderDetails } = route.params;
  const handleApplyForOrder = async (orderId) => {
    try {
      const response = await api.post(
        `/order/maid/apply/${orderId}`,  
        {}, 
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          }
        }
      );
  
      if (response.status >= 200 && response.status < 300) {
        if (response.data?.status === false) {
          Alert.alert('Notice', response.data.msg || 'Application not processed');
        } else {
          Alert.alert(
            'Success', 
            response.data?.msg || 'Applied to order successfully!',
            [
              { 
                text: 'OK', 
                onPress: () => navigation.goBack() // Navigate back after OK
              }
            ]
          );
        }
      } else {
        throw new Error(response.data?.msg || 'Unexpected response from server');
      }
    } catch (error) {
      console.error('Full error details:', error);
  
      let errorMessage = 'Failed to apply for order';
      if (error.response) {
        errorMessage = error.response.data?.msg || 
                      error.response.data?.message || 
                      `Server error (${error.response.status})`;
      } else if (error.request) {
        errorMessage = 'No response from server - please check your connection';
      }
  
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("HomeownerDetails.Title")}</Text>
        <View style={{ width: 24 }} /> {/* Spacer for alignment */}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Image 
            source={require('../../assets/pictures/maid1.jpg')} 
            style={styles.profileImage}
          />
          <Text style={styles.name}>{orderDetails.ownerName}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={20} color="#FFD700" />
            <Text style={styles.ratingText}>4.8 (24 reviews)</Text>
          </View>
        </View>

        {/* Details Section */}
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={22} color="#66785F" />
            <Text style={styles.detailText}>{orderDetails.location}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="briefcase-outline" size={22} color="#66785F" />
            <Text style={styles.detailText}>{orderDetails.jobType}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={22} color="#66785F" />
            <Text style={styles.detailText}>{orderDetails.duration}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="cash-outline" size={22} color="#66785F" />
            <Text style={styles.detailText}>${orderDetails.charges}</Text>
          </View>
        </View>

        {/* Description Section */}
        <View style={styles.descriptionCard}>
          <Text style={styles.sectionTitle}>About This Service</Text>
          <Text style={styles.descriptionText}>
            Professional cleaning service with attention to detail. 
            Includes deep cleaning of all rooms, kitchen sanitation, 
            and bathroom disinfection.It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).


          </Text>
        </View>
      </ScrollView>

      {/* Fixed Footer Button */}
      <View style={styles.footer}>
      <TouchableOpacity 
          style={styles.bookButton}
          onPress={() => handleApplyForOrder(orderDetails._id)} 
        >
          <Text style={styles.bookButtonText}>{t("HomeownerDetails.RequestNow")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FFE5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    backgroundColor: "white",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 100, // Space for fixed footer
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#91AC8F",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 12,
    color: "#333",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 16,
    color: "#666",
  },
  detailsCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  detailText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#333",
  },
  descriptionCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#555",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  bookButton: {
    backgroundColor: "#91AC8F",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
  },
  bookButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default HomeownerDetailsScreen;