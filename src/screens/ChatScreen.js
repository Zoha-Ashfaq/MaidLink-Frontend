import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ChatScreen = ({ route }) => {
  const { name } = route.params;
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hello!', sender: 'other' },
    { id: '2', text: 'How are you?', sender: 'me' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { id: Date.now().toString(), text: newMessage, sender: 'me' }]);
      setNewMessage('');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>{name}</Text>
        <TouchableOpacity style={styles.callButton}>
          <Ionicons name="call" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Message List */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.message, item.sender === 'me' ? styles.myMessage : styles.otherMessage]}>
            <Text>{item.text}</Text>
          </View>
        )}
      />

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.voiceButton}>
          <Ionicons name="mic" size={24} color="gray" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Type a message"
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FFE5' },

  // Header Styles
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#66785F',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  callButton: {
    backgroundColor: '#625B71',
    padding: 10,
    borderRadius: 50,
  },

  // Message Styles
  message: {
    padding: 12,
    borderRadius: 10,
    marginVertical: 8,
    maxWidth: '70%',
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#625B71',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECE6F0',
  },

  // Input Area Styles
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#F7FFE5',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  voiceButton: {
    backgroundColor: '#F0F0F0',
    padding: 8,
    borderRadius: 50,
    marginRight: 10,
  },
  input: {
    flex: 1,
    padding: 12,
    backgroundColor: '#F8F8F8',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#66785F',
    padding: 12,
    borderRadius: 50,
  },
});

export default ChatScreen;
