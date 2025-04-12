import React from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next"; // Import useTranslation hook

const HomeownerDetailsScreen = ({ route, navigation }) => {
  const { t } = useTranslation(); // Initialize translation hook
  const { job } = route.params; // Access job details passed from MaidHomeScreen

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Image source={job.image} style={styles.profileImage} />

        <Text style={styles.name}>{job.homeowner}</Text>
        <Text style={styles.label}>{t("HomeownerDetails.Location")}</Text> {/* Translate key */}
        <Text style={styles.value}>{job.location}</Text>

        <Text style={styles.label}>{t("HomeownerDetails.JobType")}</Text> {/* Translate key */}
        <Text style={styles.value}>{job.task}</Text>

        <Text style={styles.label}>{t("HomeownerDetails.Duration")}</Text> {/* Translate key */}
        <Text style={styles.value}>{job.duration}</Text>

        <Text style={styles.label}>{t("HomeownerDetails.ChargesPerHour")}</Text> {/* Translate key */}
        <Text style={styles.value}>Rs. {job.charges} PKR</Text>

        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => navigation.navigate("BookingScreen", { job })}
        >
          <Text style={styles.bookButtonText}>{t("HomeownerDetails.RequestNow")}</Text> {/* Translate key */}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default HomeownerDetailsScreen;

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
