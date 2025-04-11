import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { Card } from 'react-native-paper';
import { useUserContext } from './UserContext';
import { useTranslation } from 'react-i18next';

const HomeownerNotificationScreen = ({ navigation }) => {
  const { notifications } = useUserContext();
  const { t } = useTranslation();

  const [acceptedNotifications, setAcceptedNotifications] = useState([]);

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

  const handleAccept = (id) => {
    setAcceptedNotifications([...acceptedNotifications, id]);
  };

  const handleDecline = (id) => {
    setAcceptedNotifications(acceptedNotifications.filter((item) => item !== id));
    // Optionally, show a toast or perform some action
  };

  const isAccepted = (id) => acceptedNotifications.includes(id);

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
            <Card style={styles.notificationCard} mode="elevated">
              <Card.Content>
                <Text style={styles.notificationMessage}>
                  {renderNotificationMessage(item.type)}
                </Text>

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.detailsButton}
                    onPress={() => navigation.navigate('DetailsScreen', { notificationId: item.id })}
                  >
                    <Text style={styles.buttonText}>{t('Notification.seeDetails')}</Text>
                  </TouchableOpacity>

                  {!isAccepted(item.id) && (
                    <>
                      <TouchableOpacity
                        style={styles.acceptButton}
                        onPress={() => handleAccept(item.id)}
                      >
                       <Text style={styles.buttonText}>{t('Notification.accept')}</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.declineButton}
                        onPress={() => handleDecline(item.id)}
                      >
                        <Text style={styles.buttonText}>{t('Notification.decline')}</Text>
                      </TouchableOpacity>
                    </>
                  )}

                  {isAccepted(item.id) && (
                    <TouchableOpacity
                      style={styles.chatButton}
                      onPress={() => navigation.navigate('ChatScreen', { notificationId: item.id })}
                    >
                      <Text style={styles.buttonText}>{t('Notification.chat')}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </Card.Content>
            </Card>
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
  buttonRow: {
    flexDirection: 'row',
    marginTop: 10,
    flexWrap: 'wrap',
    gap: 10,
  },
  detailsButton: {
    backgroundColor: '#6C63FF',
    padding: 8,
    borderRadius: 8,
    marginRight: 10,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 8,
    marginRight: 10,
  },
  declineButton: {
    backgroundColor: '#F44336',
    padding: 8,
    borderRadius: 8,
    marginRight: 10,
  },
  chatButton: {
    backgroundColor: '#2196F3',
    padding: 8,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
