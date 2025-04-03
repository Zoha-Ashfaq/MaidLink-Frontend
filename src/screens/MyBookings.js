import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Modal, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";

const MyBookings = () => {
  const navigation = useNavigation();
  const [bookings, setBookings] = useState([
    { id: "1", name: "Jane Doe", service: "Cleaning", status: "Pending", review: "" },
    { id: "2", name: "John Smith", service: "Laundry", status: "Completed", review: "" },
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const handleStatusChange = (id) => {
    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.id === id ? { ...booking, status: "Completed" } : booking
      )
    );
  };

  const handleReviewChange = (text) => {
    setSelectedBooking((prev) => ({ ...prev, review: text }));
  };

  const handleSubmitReview = () => {
    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.id === selectedBooking.id
          ? { ...booking, review: selectedBooking.review }
          : booking
      )
    );
    setIsModalVisible(false);
  };

  const renderBookingItem = ({ item }) => {
    return (
      <View style={styles.bookingCard}>
        <Text style={styles.bookingTitle}>{item.name}</Text>
        <Text style={styles.bookingDetails}>{item.service}</Text>
        <Text style={styles.bookingStatus}>Status: {item.status}</Text>
        <TouchableOpacity
          style={styles.statusButton}
          onPress={() => item.status === "Pending" && handleStatusChange(item.id)}
        >
          <Text style={styles.statusButtonText}>
            {item.status === "Pending" ? "Mark as Completed" : "Completed"}
          </Text>
        </TouchableOpacity>

        {/* Review Section when Completed */}
        {item.status === "Completed" && (
          <TouchableOpacity
            style={styles.reviewButton}
            onPress={() => {
              setSelectedBooking(item);
              setIsModalVisible(true);
            }}
          >
            <Text style={styles.reviewButtonText}>Leave a Review</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Bookings</Text>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        renderItem={renderBookingItem}
      />

      {/* Review Modal */}
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Leave a Review</Text>
            <TextInput
              style={styles.reviewInput}
              placeholder="Write your review here..."
              value={selectedBooking?.review}
              onChangeText={handleReviewChange}
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmitReview}>
              <Text style={styles.submitButtonText}>Submit Review</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FFE5",
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  bookingCard: {
    backgroundColor: "#D9D9D9",
    padding: 10,
    marginVertical: 10,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  bookingTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  bookingDetails: {
    color: "gray",
  },
  bookingStatus: {
    marginTop: 5,
    fontSize: 16,
  },
  statusButton: {
    backgroundColor: "#91AC8F",
    padding: 10,
    marginTop: 10,
    borderRadius: 20,
  },
  statusButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  reviewButton: {
    backgroundColor: "#91AC8F",
    padding: 10,
    marginTop: 15,
    borderRadius: 20,
  },
  reviewButtonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  reviewInput: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: "#91AC8F",
    padding: 12,
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
  },
  closeButtonText: {
    color: "#91AC8F",
    fontSize: 16,
  },
});

export default MyBookings;
