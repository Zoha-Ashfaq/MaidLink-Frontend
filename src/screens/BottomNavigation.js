import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useUser } from './UserContext';

const BottomNavigation = () => {
  const navigation = useNavigation();
  const { user } = useUser();

  // Determine the home screen based on user type
  const homeScreen = user?.type === 'maid' ? 'MaidHomeScreen' : 'HometabScreen';

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate(homeScreen)}>
        <Ionicons name="home" size={34} color="white" />
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.navigate('ChatListScreen')}>
        <Ionicons name="chatbubbles" size={34} color="white" />
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.navigate('LocationScreen')}>
        <Ionicons name="location" size={34} color="white" />
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.navigate('Video')}>
        <Ionicons name="videocam" size={34} color="white" />
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.navigate('ProfileManagement')}>
        <Ionicons name="person" size={34} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#66785F',
    paddingVertical: 10,
    position: 'absolute',
    height: 75,
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default BottomNavigation;