import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

const chats = [
  { id: '1', name: 'Ayesha', lastMessage: 'Hello!', profilePic: 'https://www.perfocal.com/blog/content/images/size/w960/2021/01/Perfocal_17-11-2019_TYWFAQ_100_standard-3.jpg' },
  { id: '2', name: 'Ali', lastMessage: 'See you soon!', profilePic: 'https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D' },
];

const ChatListScreen = ({ navigation }) => {
  const { t } = useTranslation();
  
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>{t('Conversation.title')}</Text>
      </View>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.chatCard} 
            onPress={() => navigation.navigate('ChatScreen', { chatId: item.id, name: item.name })}>
            <Image source={{ uri: item.profilePic }} style={styles.profilePic} />
            <View style={styles.chatInfo}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.lastMessage}>{item.lastMessage}</Text>
            </View>
          </TouchableOpacity>
        )}
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
  headerContainer: {
    width: '100%',
    height: 60, // Adjust height as needed
    backgroundColor: '#66785F',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1, // Keeps it above other elements
  },
  container: {
    flex: 1,
    padding: 0,
    paddingTop: 80, // Pushes content below the header
    backgroundColor: '#F7FFE5',
  },
  
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
  },
  chatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FEF7FF',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  chatInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  lastMessage: {
    fontSize: 14,
    color: 'gray',
  },
});

export default ChatListScreen;
