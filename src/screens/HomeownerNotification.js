import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import { useUserContext } from './UserContext';
import { useTranslation } from 'react-i18next';

const HomeownerNotificationScreen = ({ navigation }) => {
  const { notifications } = useUserContext();
  const { t } = useTranslation();

  // Helper to get translated message based on type
  const renderNotificationMessage = (type) => {
    switch (type) {
      case 'bookingConfirmed':
        return t('Notification.bookingConfirmed');
      case 'bookingDeclined':
        return t('Notification.bookingDeclined');
      case 'newServiceRequest':
        return t('Notification.newServiceRequest');
      case 'locationShared':
        return t('Notification.locationShared');
      default:
        return t('Notification.unknown');
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
                </Card.Content>
              </Card>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default HomeownerNotificationScreen;


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
});
