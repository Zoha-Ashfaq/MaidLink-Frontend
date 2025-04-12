import React from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next"; // Import useTranslation hook

const MaidDetailsScreen = ({ route, navigation }) => {
  const { t } = useTranslation(); // Initialize translation hook

  // Dummy maid data
  const maid = {
    profilePicture: "https://castle-keepers.com/wp-content/uploads/2023/05/maid-services-in-charleston.jpg", // Replace with a valid image URL
    fullName: "Ayesha Khan",
    city: "Lahore",
    experience: 5,
    ratePerHour: 200,
    services: ["Cleaning", "Cooking", "Baby Sitting"],
    policeVerified: true,
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Image source={{ uri: maid.profilePicture }} style={styles.profileImage} />

        <Text style={styles.name}>{maid.fullName}</Text>
        <Text style={styles.label}>{t("MaidDetails.CityOfService")}</Text> {/* Translate key */}
        <Text style={styles.value}>{maid.city}</Text>

        <Text style={styles.label}>{t("MaidDetails.YearsOfExperience")}</Text> {/* Translate key */}
        <Text style={styles.value}>{maid.experience} {t("MaidDetails.Years")}</Text> {/* Translate key */}

        <Text style={styles.label}>{t("MaidDetails.RatePerHour")}</Text> {/* Translate key */}
        <Text style={styles.value}>Rs. {maid.ratePerHour}</Text>

        <Text style={styles.label}>{t("MaidDetails.ServicesOffered")}</Text> {/* Translate key */}
        <Text style={styles.value}>{maid.services.join(", ")}</Text>

        <Text style={styles.label}>{t("MaidDetails.PoliceVerificationStatus")}</Text> {/* Translate key */}
        <Text style={[styles.value, { color: maid.policeVerified ? "green" : "red" }]}>
          {maid.policeVerified ? t("MaidDetails.Verified") : t("MaidDetails.NotVerified")} {/* Translate key */}
        </Text>

        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => navigation.navigate("BookingScreen", { maid })}
        >
          <Text style={styles.bookButtonText}>{t("MaidDetails.BookNow")}</Text> {/* Translate key */}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default MaidDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, // Ensures the container grows to fill available space
    padding: 20,
    backgroundColor: "#F7FFE5",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    flex: 1, // Makes the card occupy the full available height
    justifyContent: "space-between", // Distributes the content evenly
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: "center",
    marginBottom: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    color: "#444",
  },
  value: {
    fontSize: 16,
    color: "#333",
  },
  bookButton: {
    backgroundColor: "#91AC8F",
    paddingVertical: 12,
    borderRadius: 30,
    marginTop: 25,
    alignItems: "center",
    marginBottom: 20, // Ensures the button is spaced well
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});