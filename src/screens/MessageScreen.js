import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { IconButton } from 'react-native-paper';

const MessageScreen = ({ navigation }) => {
  const { t } = useTranslation();

  // Sample data for contacts (in a real app, this should be fetched from an API or a database)
  const contacts = [
    { id: 1, name: 'John Doe', message: 'Hello, how are you?', profilePic: 'https://example.com/profile.jpg' },
    { id: 2, name: 'Jane Smith', message: 'Can you help with the cleaning?', profilePic: 'https://example.com/profile.jpg' },
    { id: 3, name: 'Michael Brown', message: 'Are you available for work today?', profilePic: 'https://example.com/profile.jpg' },
  ];

  return (
    <View style={styles.container}>
      {/* Top Bar with Notifications & Emergency Help */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
          <IconButton icon="heart" size={30} color="#de8a0d" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('EmergencyHelp')}>
          <IconButton icon="alert-circle" size={30} color="#de8a0d" />
        </TouchableOpacity>
      </View>

      {/* Contacts List */}
      <ScrollView style={styles.messagesContainer}>
        {contacts.map((contact) => (
          <TouchableOpacity
            key={contact.id}
            style={styles.messageCard}
            onPress={() => navigation.navigate('Chat', { contact })}
          >
            <Image
              source={{ uri: contact.profilePic }}
              style={styles.profileImage}
            />
            <View style={styles.messageDetails}>
              <Text style={styles.userName}>{contact.name}</Text>
              <Text style={styles.messagePreview}>{contact.message}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

// Styles
const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f2bc94',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  messagesContainer: {
    flex: 1,
    padding: 10,
  },
  messageCard: {
    backgroundColor: '#fff',
    marginBottom: 15,
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  messageDetails: {
    marginLeft: 15,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    color: '#722620',
    fontWeight: 'bold',
  },
  messagePreview: {
    fontSize: 14,
    color: '#722620',
  },
};

export default MessageScreen;
