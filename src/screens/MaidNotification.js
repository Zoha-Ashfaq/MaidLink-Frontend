import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { Card } from 'react-native-paper';
import { useUserContext } from './UserContext';
import { useTranslation } from 'react-i18next';

const MaidNotificationScreen = ({ navigation }) => {
  const { notifications } = useUserContext();
  const { t } = useTranslation();

  const renderNotificationMessage = (type) => {
    switch (type) {
      case 'requestAccepted':
        return t('Notification.requestAccepted');
      case 'requestDeclined':
        return t('Notification.requestDeclined');
      case 'newBooking':
        return t('Notification.newBooking');
      case 'locationSharedByOwner':
        return t('Notification.locationSharedByOwner');
      default:
        return t('Notification.unknown');
    }
  };

  const renderNotificationDetails = (notification) => {
    switch (notification.type) {
      case 'requestAccepted':
      case 'requestDeclined':
        return (
          <View style={styles.detailsContainer}>
            <Text>{t('Notification.requestStatus')}: {renderNotificationMessage(notification.type)}</Text>
            <Text>{t('Notification.ownerName')}: {notification.ownerName}</Text>
            <Text>{t('Notification.serviceDetails')}: {notification.serviceDetails}</Text>
          </View>
        );
      case 'newBooking':
        return (
          <View style={styles.detailsContainer}>
            <Text>{t('Notification.bookingDetails')}</Text>
            <Text>{t('Notification.bookingTime')}: {notification.bookingTime}</Text>
            <Text>{t('Notification.bookingLocation')}: {notification.location}</Text>
          </View>
        );
      case 'locationSharedByOwner':
        return (
          <View style={styles.detailsContainer}>
            <Text>{t('Notification.locationShared')}</Text>
            <Button 
              title={t('Notification.viewLocation')}
              onPress={() => navigation.navigate('LocationScreen', { location: notification.location })}
            />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('Notification.notifications')}</Text>

      {notifications.length === 0 ? (
        <Text style={styles.noNotificationText}>{t('Notification.noNotifications')}</Text>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('DetailsScreen', { notificationId: item.id })}
            >
              <Card style={styles.notificationCard} mode="elevated">
                <Card.Content>
                  <Text style={styles.notificationMessage}>
                    {renderNotificationMessage(item.type)}
                  </Text>
                  {/* Show additional details based on the type of notification */}
                  {renderNotificationDetails(item)}
                </Card.Content>
              </Card>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default MaidNotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F7FFE5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  noNotificationText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
  notificationCard: {
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: '#D9D9D9',
    elevation: 3,
  },
  notificationMessage: {
    fontSize: 16,
    color: '#333',
  },
  detailsContainer: {
    marginTop: 10,
  },
});
