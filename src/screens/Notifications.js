import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { useUserContext } from './UserContext';
import { useTranslation } from 'react-i18next';

const NotificationScreen = ({ navigation }) => {
  const { userRole, notifications } = useUserContext();
  const { t } = useTranslation();

  console.log("User Role:", userRole);
  console.log("Notifications:", notifications);

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <Text style={styles.title}>{t('Notification.notifications')}</Text>

      {/* Role Switch Button */}
      <Button 
        mode="contained" 
        onPress={() => navigation.navigate('RoleSwitch')} 
        style={styles.switchButton}
        labelStyle={styles.switchButtonText}
      >
        {t('Notification.switchRole')}
      </Button>

      {/* No Notifications Message */}
      {notifications.length === 0 ? (
        <Text style={styles.noNotificationText}>{t('Notification.noNotifications')}</Text>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Card style={styles.notificationCard} mode="elevated">
              <Card.Content>
                <Text style={styles.notificationMessage}>{item.message}</Text>
              </Card.Content>

              {/* Action Buttons */}
              <Card.Actions style={styles.actionsContainer}>
                {item.id && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('Details', { notificationId: item.id })}
                  >
                    <Text style={styles.actionText}>{t('Notification.seeDetails')}</Text>
                  </TouchableOpacity>
                )}
                {item.userId && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('Chat', { userId: item.userId })}
                  >
                    <Text style={styles.actionText}>{t('Notification.chat')}</Text>
                  </TouchableOpacity>
                )}
              </Card.Actions>
            </Card>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F7FFE5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 15,
    color: '#333',
  },
  switchButton: {
    marginBottom: 20,
    backgroundColor: '#66785F',
    borderRadius: 8,
  },
  switchButtonText: {
    fontSize: 16,
    color: '#FFF',
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
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 10,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#66785F',
    borderRadius: 5,
  },
  actionText: {
    color: '#FFF',
    fontSize: 14,
  },
});

export default NotificationScreen;
