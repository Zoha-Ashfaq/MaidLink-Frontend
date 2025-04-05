import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useUserContext } from './UserContext';
import { useTranslation } from 'react-i18next';

const DetailsScreen = ({ route, navigation }) => {
  const { notificationId } = route.params; // Get notification ID from the params
  const { notifications } = useUserContext();
  const { t } = useTranslation();

  // Find the notification by ID
  const notification = notifications.find((item) => item.id === notificationId);

  // If no notification found (invalid ID), display an error
  if (!notification) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorMessage}>{t('Notification.notificationNotFound')}</Text>
      </View>
    );
  }

  const handleLocationPress = () => {
    // If the notification involves location, navigate to the LocationScreen
    if (notification.location) {
      navigation.navigate('LocationScreen', { location: notification.location });
    } else {
      console.log('No location data available');
    }
  };

  const handleAcceptDecline = (status) => {
    // Handle the accept/decline actions here
    // Maybe update the status of a request or booking in the backend
    console.log(`Notification ${status}:`, notification);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.notificationTitle}>{t('Notification.notificationDetails')}</Text>
      
      {/* Notification Type */}
      <Text style={styles.notificationType}>{notification.type}</Text>
      
      {/* Detailed Message */}
      <Text style={styles.message}>{notification.message}</Text>
      
      {/* Booking/Request Information */}
      {notification.type === 'booking' || notification.type === 'request' ? (
        <View style={styles.details}>
          <Text style={styles.detailsText}>{t('Notification.bookingDetails')}</Text>
          <Text>{t('Notification.name')}: {notification.name}</Text>
          <Text>{t('Notification.time')}: {notification.time}</Text>
          <Text>{t('Notification.location')}: {notification.location}</Text>
        </View>
      ) : null}

      {/* Action Buttons */}
      {notification.type === 'maidRequest' && (
        <View style={styles.buttonsContainer}>
          <Button 
            title={t('Notification.accept')} 
            onPress={() => handleAcceptDecline('accepted')} 
          />
          <Button 
            title={t('Notification.decline')} 
            onPress={() => handleAcceptDecline('declined')} 
          />
        </View>
      )}

      {/* Chat Button */}
      {notification.userId && (
        <Button 
          title={t('Notification.chatWithUser')} 
          onPress={() => navigation.navigate('Chat', { userId: notification.userId })} 
        />
      )}

      {/* Location Button */}
      {notification.type === 'location' && notification.location && (
        <Button 
          title={t('Notification.viewLocation')} 
          onPress={handleLocationPress} 
        />
      )}

      {/* Date and Time */}
      <Text style={styles.dateTime}>{notification.dateTime}</Text>

      {/* Back Button */}
      <Button 
        title={t('Notification.back')} 
        onPress={() => navigation.goBack()} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F7FFE5',
  },
  notificationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  notificationType: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
    color: '#66785F',
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    color: '#333',
  },
  details: {
    marginBottom: 20,
  },
  detailsText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dateTime: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
  },
  errorMessage: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});

export default DetailsScreen;
