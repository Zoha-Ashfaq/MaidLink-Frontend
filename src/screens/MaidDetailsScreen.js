import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from "react-native";
import { useTranslation } from "react-i18next";
import { useUser } from './UserContext';
import api from '../services/api';

const MaidDetailsScreen = ({ route, navigation }) => {
  const { t } = useTranslation();
  const { maid } = route.params;
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const handleBookNow = async () => {
    if (!user) {
      Alert.alert(t("MaidDetails.LoginRequired"), t("MaidDetails.PleaseLogin"));
      navigation.navigate('Login');
      return;
    }

    if (user.role !== 'homeowner' && user.role !== 'owner') {
      Alert.alert(t("MaidDetails.NotAuthorized"), t("MaidDetails.OnlyHomeowners"));
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(`/order/owner/request-maid/${maid._id}`);
      
      Alert.alert(
        t("MaidDetails.RequestSent"), 
        t("MaidDetails.RequestSentMessage")
      );
      
      // Optional: Navigate back or to bookings screen
      navigation.goBack();
      
    } catch (error) {
      console.error('Request failed:', error);
      
      let errorMessage = t("MaidDetails.RequestFailed");
      if (error.response?.data?.msg) {
        errorMessage = error.response.data.msg;
      } else if (error.message.includes('Network Error')) {
        errorMessage = t("MaidDetails.NetworkError");
      }
      
      Alert.alert(t("MaidDetails.Error"), errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Image
          source={maid.profileImg ? { uri: maid.profileImg } : require("../../assets/pictures/maid1.jpg")}
          style={styles.profileImage}
        />

        <Text style={styles.name}>{maid.userName}</Text>

        <Text style={styles.label}>{t("MaidDetails.CityOfService")}</Text>
        <Text style={styles.value}>{maid.serviceCity}</Text>

        <Text style={styles.label}>{t("MaidDetails.YearsOfExperience")}</Text>
        <Text style={styles.value}>{maid.experience || 0} {t("MaidDetails.Years")}</Text>

        <Text style={styles.label}>{t("MaidDetails.RatePerHour")}</Text>
        <Text style={styles.value}>Rs. {maid.ratePerHour}</Text>

        <Text style={styles.label}>{t("MaidDetails.ServicesOffered")}</Text>
        <Text style={styles.value}>{maid.services?.join(", ")}</Text>

        <Text style={styles.label}>{t("MaidDetails.PoliceVerificationStatus")}</Text>
        <Text style={[styles.value, { color: maid.policeVerified ? "green" : "red" }]}>
          {maid.policeVerified ? t("MaidDetails.Verified") : t("MaidDetails.NotVerified")}
        </Text>

        <TouchableOpacity
          style={styles.bookButton}
          onPress={handleBookNow}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.bookButtonText}>{t("MaidDetails.BookNow")}</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};


export default MaidDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: "#F0F4F8",
  },
  card: {
    width: '100%', // full width relative to container padding
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignSelf: "center",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#91AC8F",
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: "#222",
    marginTop: 2,
  },
  bookButton: {
    backgroundColor: "#91AC8F",
    paddingVertical: 14,
    borderRadius: 28,
    marginTop: 30,
    alignItems: "center",
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
