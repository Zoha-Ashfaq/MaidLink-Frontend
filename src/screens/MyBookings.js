import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const MyBookings = () => {
  const [bookings, setBookings] = useState([
    {
      id: "1",
      name: "Mansoor",
      profilePic: "https://i.pravatar.cc/150?img=3",
      service: "Cleaning",
      time: "10:00 AM",
      date: "2025-04-09",
      status: "Pending",
      review: "",
      rating: 0,
    },
    {
      id: "2",
      name: "Zaviyar",
      profilePic: "https://i.pravatar.cc/150?img=4",
      service: "Laundry",
      time: "3:00 PM",
      date: "2025-04-10",
      status: "Completed",
      review: "Great job!",
      rating: 5,
    },
  ]);

  const [activeTab, setActiveTab] = useState("Pending");
  const [searchText, setSearchText] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailModalVisible, setDetailModalVisible] = useState(false);
  const [isReviewModalVisible, setReviewModalVisible] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);

  const filteredBookings = bookings.filter(
    (b) =>
      b.status === activeTab &&
      (b.name.toLowerCase().includes(searchText.toLowerCase()) ||
        b.service.toLowerCase().includes(searchText.toLowerCase()))
  );

  const handleCancelBooking = (id) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, status: "Cancelled" } : b
      )
    );
    setDetailModalVisible(false);
  };

  const handleMarkAsComplete = (booking) => {
    setSelectedBooking(booking);
    setReviewText("");
    setSelectedRating(0);
    setDetailModalVisible(false);
    setReviewModalVisible(true);
  };

  const handleSubmitReview = () => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === selectedBooking.id
          ? {
              ...b,
              status: "Completed",
              review: reviewText,
              rating: selectedRating,
            }
          : b
      )
    );
    setReviewModalVisible(false);
  };

  const renderBookingItem = ({ item }) => (
    <TouchableOpacity
      style={styles.bookingCard}
      onPress={() => {
        setSelectedBooking(item);
        setDetailModalVisible(true);
      }}
    >
      <Image source={{ uri: item.profilePic }} style={styles.avatar} />
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.bookingTitle}>{item.name}</Text>
        <Text style={styles.bookingDetails}>{item.service}</Text>
        <Text style={styles.bookingDetails}>{item.date} | {item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderStars = () => {
    return (
      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setSelectedRating(star)}
          >
            <Ionicons
              name={star <= selectedRating ? "star" : "star-outline"}
              size={28}
              color="#FFD700"
              style={{ marginRight: 5 }}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Bookings</Text>

      <TextInput
        placeholder="Search bookings..."
        value={searchText}
        onChangeText={setSearchText}
        style={styles.searchInput}
      />

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {["Pending", "Completed", "Cancelled"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && styles.activeTab,
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Booking List */}
      <FlatList
        data={filteredBookings}
        keyExtractor={(item) => item.id}
        renderItem={renderBookingItem}
        ListEmptyComponent={
          <Text style={styles.noDataText}>No bookings found.</Text>
        }
      />

      {/* Booking Detail Modal */}
      <Modal visible={isDetailModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Booking Details</Text>
            {selectedBooking && (
              <>
                <Text>Name: {selectedBooking.name}</Text>
                <Text>Service: {selectedBooking.service}</Text>
                <Text>Date: {selectedBooking.date}</Text>
                <Text>Time: {selectedBooking.time}</Text>
                <Text>Status: {selectedBooking.status}</Text>

                {selectedBooking.status === "Pending" && (
                  <View style={styles.modalActions}>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => handleCancelBooking(selectedBooking.id)}
                    >
                      <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.completeButton}
                      onPress={() => handleMarkAsComplete(selectedBooking)}
                    >
                      <Text style={styles.buttonText}>Complete</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </>
            )}
            <TouchableOpacity
              onPress={() => setDetailModalVisible(false)}
              style={styles.closeModal}
            >
              <Text style={{ color: "#91AC8F", fontSize: 16 }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Review Modal */}
      <Modal visible={isReviewModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Leave a Review</Text>
            {renderStars()}
            <TextInput
              placeholder="Write your feedback..."
              multiline
              numberOfLines={4}
              value={reviewText}
              onChangeText={setReviewText}
              style={styles.reviewInput}
            />
            <TouchableOpacity
              style={styles.completeButton}
              onPress={handleSubmitReview}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setReviewModalVisible(false)}
              style={styles.closeModal}
            >
              <Text style={{ color: "#91AC8F", fontSize: 16 }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MyBookings;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7FFE5", padding: 16 },
  header: { fontSize: 24, fontWeight: "bold", color: "#333", marginBottom: 10 },
  searchInput: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  tabsContainer: { flexDirection: "row", justifyContent: "space-around", marginBottom: 10 },
  tab: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  activeTab: { backgroundColor: "#91AC8F" },
  tabText: { color: "#333" },
  activeTabText: { color: "#fff", fontWeight: "bold" },
  bookingCard: {
    flexDirection: "row",
    backgroundColor: "#D9D9D9",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  bookingTitle: { fontSize: 18, fontWeight: "bold" },
  bookingDetails: { color: "#444" },
  noDataText: { textAlign: "center", marginTop: 20, color: "#666" },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "85%",
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  modalActions: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  cancelButton: {
    backgroundColor: "#E57373",
    padding: 10,
    borderRadius: 10,
    width: "48%",
    alignItems: "center",
  },
  completeButton: {
    backgroundColor: "#91AC8F",
    padding: 10,
    borderRadius: 10,
    width: "48%",
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  closeModal: { marginTop: 15, alignItems: "center" },
  reviewInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    height: 100,
    textAlignVertical: "top",
  },
});
