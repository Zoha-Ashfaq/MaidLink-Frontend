import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  Image,Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from './UserContext';
import api from '../services/api';


const MyBookings = () => {
  const { user } = useUser();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [searchText, setSearchText] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailModalVisible, setDetailModalVisible] = useState(false);
  const [isReviewModalVisible, setReviewModalVisible] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [activeTab, user]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const endpoint = user.role === 'maid' ? '/order/maid/orders' : '/order/owner/orders';
      const response = await api.get(`${endpoint}?status=${activeTab.toLowerCase()}`);
      
      // Transform the API data to match UI expectations
      const transformedBookings = await Promise.all(response.data.orders.map(async (order) => {
        // Fetch user details based on role
        let otherUserDetails = {};
        try {
          const userId = user.role === 'maid' ? order.ownerId : order.applicants[0]?.maidId;
          if (userId) {
            const userResponse = await api.get(`/users/${userId}`);
            otherUserDetails = {
              name: userResponse.data.user?.name || (user.role === 'maid' ? 'Owner' : 'Maid'),
              profileImg: userResponse.data.user?.profileImage || 'https://i.pravatar.cc/150?img=3'
            };
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
          otherUserDetails = {
            name: user.role === 'maid' ? 'Owner' : 'Maid',
            profileImg: 'https://i.pravatar.cc/150?img=3'
          };
        }
  
        return {
          ...order,
          _id: order._id,
          service: order.jobType,
          date: order.createdAt,
          time: order.duration,
          status: order.status,
          customer: otherUserDetails,
          charges: order.charges,
          location: order.location?.join(', ') || 'Location not specified',
          orderId: order.orderId
        };
      }));
      
    //  console.log('Transformed Bookings:', transformedBookings);
      setBookings(transformedBookings);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      Alert.alert("Error", "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };


  const handleAccept = async () => {
    try {
      setActionLoading(true);
      const endpoint = user.role === 'maid' 
        ? `/order/maid/accept-request/${selectedBooking.ownerId}`
        : `/order/owner/accept-order/${selectedBooking._id}`;
      
      await api.post(endpoint, {
        jobType: selectedBooking.jobType,
        duration: selectedBooking.duration
      });
      
      fetchBookings();
      setDetailModalVisible(false);
      Alert.alert("Success", "Request accepted successfully");
    } catch (error) {
      console.error('Error accepting:', error);
      Alert.alert("Error", error.response?.data?.msg || "Failed to accept request");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDecline = async () => {
    try {
      setActionLoading(true);
      const endpoint = user.role === 'maid'
        ? `/order/maid/decline-request/${selectedBooking.ownerId}`
        : `/order/owner/decline-order/${selectedBooking._id}`;
      
      await api.post(endpoint);
      
      fetchBookings();
      setDetailModalVisible(false);
      Alert.alert("Success", "Request declined successfully");
    } catch (error) {
      console.error('Error declining:', error);
      Alert.alert("Error", error.response?.data?.msg || "Failed to decline request");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    try {
      setActionLoading(true);
      await api.put(`/order/cancel-order/${selectedBooking._id}`);
      fetchBookings();
      setDetailModalVisible(false);
      Alert.alert("Success", "Order cancelled successfully");
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      Alert.alert("Error", error.response?.data?.msg || "Failed to cancel booking");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCompleteOrder = async () => {
    try {
      setActionLoading(true);
      await api.put(`/order/complete-order/${selectedBooking._id}`);
      fetchBookings();
      setDetailModalVisible(false);
      Alert.alert("Success", "Order marked as completed");
    } catch (error) {
      console.error('Failed to complete order:', error);
      Alert.alert("Error", error.response?.data?.msg || "Failed to complete order");
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkAsComplete = (booking) => {
    setSelectedBooking(booking);
    setReviewText("");
    setSelectedRating(0);
    setDetailModalVisible(false);
    setReviewModalVisible(true);
  };

  const handleSubmitReview = async () => {
    try {
      // Validate rating first
      if (selectedRating <= 0) {
        Alert.alert("Please select a rating");
        return;
      }
  
      // Check if user data is available
      if (!user?.id) {
        Alert.alert("Error", "User information not available. Please log in again.");
        return;
      }
  
      setActionLoading(true);
      
      // Log user data for debugging
      console.log('Current User:', {
        id: user.id,
        role: user.role,
        exists: !!user
      });
  
      // Determine user types - normalize to backend expectations
      const userType = user.role === 'homeowner' ? 'owner' : 'maid';
      const receiverType = user.role === 'maid' ? 'owner' : 'maid'; 
      const receiverId = user.role === 'maid' 
        ? selectedBooking.ownerId 
        : selectedBooking.maidId;
  
      // Validate receiver exists
      if (!receiverId) {
        Alert.alert("Error", "Could not determine service provider to rate");
        return;
      }
  
      // Prepare payload matching backend expectations
      const payload = {
        user: user.id,         // Ensure user ID is included
        userType,              // 'owner' or 'maid'
        reciever: receiverId,  // Note: backend expects 'reciever' (with typo)
        recieverType: receiverType, // Note: backend expects 'recieverType'
        rating: selectedRating,
        comment: reviewText
      };
  
      console.log('Submitting rating with payload:', payload);
  
      // Submit the review
      const response = await api.post("/rating/create", payload);
      console.log('Rating submission response:', response.data);
  
    // Mark order as complete
    await handleCompleteOrder();
      // Close modal and show success
      setReviewModalVisible(false);
      Alert.alert("Success", "Thank you for your review!");
  
      // Optional: refresh bookings to show updated rating
      fetchBookings();
      
    } catch (error) {
      console.error('Rating submission failed:', {
        error: error.message,
        response: error.response?.data,
        config: error.config
      });
  
      let errorMessage = "Failed to submit review";
      if (error.response?.data?.msg) {
        errorMessage = error.response.data.msg;
      } else if (error.response?.status === 400) {
        errorMessage = "Invalid data submitted. Please check your inputs.";
      } else if (error.message.includes('Network Error')) {
        errorMessage = "Network error - please check your connection";
      }
  
      Alert.alert("Error", errorMessage);
    } finally {
      setActionLoading(false);
    }
  };
  const filteredBookings = bookings.filter(
    (b) =>
      b.customer?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      b.service?.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderBookingItem = ({ item }) => (
    <TouchableOpacity
      style={styles.bookingCard}
      onPress={() => {
        setSelectedBooking(item);
        setDetailModalVisible(true);
      }}
    >
      <Image 
 source={{ 
  uri: item.customer?.profileImg || 'https://i.pravatar.cc/150?img=3',
  cache: 'force-cache'
}}         style={styles.avatar} 
      />
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.bookingTitle}>{item.customer?.name || 'Maid'}</Text>
        <Text style={styles.bookingDetails}>{item.service}</Text>
        <Text style={styles.bookingDetails}>
          {new Date(item.date).toLocaleDateString()} | {item.time}
        </Text>
        <Text style={[
          styles.statusBadge,
          item.status === 'completed' && styles.completedStatus,
          item.status === 'cancelled' && styles.cancelledStatus,
          item.status === 'in progress' && styles.inProgressStatus
        ]}>
          {item.status}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderActionButtons = () => {
    if (actionLoading) {
      return <ActivityIndicator size="small" color="#91AC8F" />;
    }

    switch (selectedBooking?.status) {
      case 'pending':
        return (
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.declineButton}
              onPress={handleDecline}
              disabled={actionLoading}
            >
              <Text style={styles.buttonText}>Decline</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={handleAccept}
              disabled={actionLoading}
            >
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
          </View>
        );
      case 'in progress':
        return (
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancelBooking}
              disabled={actionLoading}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.completeButton}
              onPress={() => handleMarkAsComplete(selectedBooking)}
              disabled={actionLoading}
            >
              <Text style={styles.buttonText}>Complete</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  const renderStars = () => {
    return (
      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setSelectedRating(star)}
            disabled={actionLoading}
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

  if (loading && bookings.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#91AC8F" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Bookings</Text>

      <TextInput
        placeholder="Search bookings..."
        value={searchText}
        onChangeText={setSearchText}
        style={styles.searchInput}
      />

      <View style={styles.tabsContainer}>
        {["pending", "in progress", "completed", "cancelled"].map((tab) => (
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
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {bookings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.noDataText}>No {activeTab} bookings found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredBookings}
          keyExtractor={(item) => item._id}
          renderItem={renderBookingItem}
          refreshing={loading}
          onRefresh={fetchBookings}
        />
      )}

      <Modal visible={isDetailModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Booking Details</Text>
            {selectedBooking && (
              <>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Order ID:</Text>
                  <Text style={styles.detailValue}>{selectedBooking.orderId}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Customer:</Text>
                  <Text style={styles.detailValue}>{selectedBooking.customer?.name}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Service:</Text>
                  <Text style={styles.detailValue}>{selectedBooking.service}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Date:</Text>
                  <Text style={styles.detailValue}>
                    {new Date(selectedBooking.date).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Duration:</Text>
                  <Text style={styles.detailValue}>{selectedBooking.time}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Charges:</Text>
                  <Text style={styles.detailValue}>${selectedBooking.charges}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Location:</Text>
                  <Text style={styles.detailValue}>{selectedBooking.location}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Status:</Text>
                  <Text style={[
                    styles.detailValue,
                    styles.statusText,
                    selectedBooking.status === 'completed' && styles.completedStatus,
                    selectedBooking.status === 'cancelled' && styles.cancelledStatus,
                    selectedBooking.status === 'in progress' && styles.inProgressStatus
                  ]}>
                    {selectedBooking.status}
                  </Text>
                </View>

                {renderActionButtons()}
              </>
            )}
            <TouchableOpacity
              onPress={() => setDetailModalVisible(false)}
              style={styles.closeModal}
              disabled={actionLoading}
            >
              <Text style={{ color: "#91AC8F", fontSize: 16 }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal 
  visible={isReviewModalVisible} 
  transparent 
  animationType="slide"
  onRequestClose={() => !actionLoading && setReviewModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.reviewModalBox}>
      <Text style={styles.reviewModalTitle}>Rate Your Experience</Text>
      
      <View style={styles.starsContainer}>
        <Text style={styles.ratingPrompt}>How would you rate this service?</Text>
        {renderStars()}
      </View>
      
      <TextInput
        placeholder="Share details about your experience..."
        placeholderTextColor="#A0AEC0"
        multiline
        numberOfLines={4}
        value={reviewText}
        onChangeText={setReviewText}
        style={styles.reviewInput}
        editable={!actionLoading}
      />
      
      <View style={styles.reviewModalActions}>
        <TouchableOpacity
          style={[
            styles.submitButton, 
            actionLoading && styles.disabledButton,
            (selectedRating <= 0) && styles.disabledButton
          ]}
          onPress={handleSubmitReview}
          disabled={actionLoading || selectedRating <= 0}
        >
          <Text style={styles.buttonText}>
            {actionLoading ? 'Submitting...' : 'Submit Review'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => !actionLoading && setReviewModalVisible(false)}
          style={styles.cancelReviewButton}
          disabled={actionLoading}
        >
          <Text style={styles.cancelReviewButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7FFE5", padding: 16 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#F7FFE5",
  },
  header: { 
    fontSize: 24, 
    fontWeight: "bold", 
    color: "#2D3748", 
    marginBottom: 16,
    textAlign: 'center'
  },
  searchInput: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    fontSize: 16,
  },
  tabsContainer: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 4,
  },
  tab: { 
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center'
  },
  activeTab: { backgroundColor: "#91AC8F" },
  tabText: { color: "#4A5568", fontWeight: '500' },
  activeTabText: { color: "#fff", fontWeight: "bold" },
  bookingCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: { 
    width: 60, 
    height: 60, 
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#91AC8F',
    backgroundColor: '#E2E8F0', // Fallback background color
  },
  bookingTitle: { 
    fontSize: 18, 
    fontWeight: "bold",
    color: '#2D3748'
  },
  bookingDetails: { 
    color: "#718096",
    marginTop: 4,
    fontSize: 14
  },
  statusBadge: {
    marginTop: 6,
    color: '#2B6CB0',
    fontWeight: '600',
    fontSize: 14
  },
  completedStatus: {
    color: '#38A169'
  },
  cancelledStatus: {
    color: '#E53E3E'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  noDataText: { 
    color: "#718096",
    fontSize: 16
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    width: "90%",
  },
  modalTitle: { 
    fontSize: 20, 
    fontWeight: "bold", 
    marginBottom: 16,
    color: '#2D3748'
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 12
  },
  detailLabel: {
    fontWeight: '600',
    color: '#4A5568',
    width: 80
  },
  detailValue: {
    flex: 1,
    color: '#718096'
  },
  statusText: {
    fontWeight: '600'
  },
  modalActions: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginTop: 24 
  },
  cancelButton: {
    backgroundColor: "#FC8181",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  completeButton: {
    backgroundColor: "#91AC8F",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: "center",
  },
  buttonText: { 
    color: "#fff", 
    fontWeight: "bold",
    fontSize: 16
  },
  closeModal: { 
    marginTop: 16, 
    alignItems: "center" 
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 12,
    borderRadius: 8,
    height: 120,
    textAlignVertical: "top",
    marginBottom: 16,
    fontSize: 16
  },
  acceptButton: {
    backgroundColor: "#68D391",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: "center",
  },
  declineButton: {
    backgroundColor: "#FC8181",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  inProgressStatus: {
    color: '#3182CE'
  },
  disabledButton: {
    opacity: 0.6
  },
  reviewModalBox: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    width: "90%",
    maxWidth: 400,
  },
  reviewModalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: '#2D3748',
    textAlign: 'center'
  },
  starsContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  ratingPrompt: {
    color: "#4A5568",
    marginBottom: 10,
    fontSize: 16,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    borderRadius: 12,
    height: 120,
    textAlignVertical: "top",
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#F8FAFC',
  },
  reviewModalActions: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: "#91AC8F",
    padding: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: "center",
    marginBottom: 12,
  },
  cancelReviewButton: {
    padding: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: "center",
  },
  cancelReviewButtonText: {
    color: "#718096",
    fontSize: 16,
    fontWeight: '500'
  },
});

export default MyBookings;