import React from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, Image, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, Feather } from '@expo/vector-icons';

const MaidHomeScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const handleEmergencyPress = () => {
    Alert.alert(t('MaidHometab.emergency_title'), t('MaidHometab.emergency_message'), [
      { text: t('MaidHometab.cancel'), style: 'cancel' },
      { text: t('MaidHometab.call_police'), onPress: () => console.log('Calling Police...') },
    ]);
  };

  const jobs = [
    { id: '1', homeowner: 'Ali', location: 'Lahore', task: 'Cleaning & Cooking', image: require('../../assets/pictures/maid1.jpg') },
    { id: '2', homeowner: 'Hina', location: 'Karachi', task: 'Babysitting', image: require('../../assets/pictures/maid1.jpg') },
  ];

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TextInput style={styles.searchInput} placeholder={t('MaidHometab.search_placeholder')} />
        <TouchableOpacity onPress={handleEmergencyPress} style={styles.iconButton}>
          <Ionicons name="alert-circle" size={28} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('MaidNotification')} style={styles.iconButton}>
          <Feather name="heart" size={28} color="black" />
        </TouchableOpacity>
      </View>

      {/* Separator */}
      <View style={styles.separator} />

      {/* Job Requests for Maids */}
      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.maidCard}>
            <Image source={item.image} style={styles.maidImage} />
            <View style={styles.maidDetails}>
              <Text style={styles.maidName}>{item.homeowner}</Text>
              <Text style={styles.maidLocation}>{item.location}</Text>
              <Text style={styles.maidServices}>{item.task}</Text>
            </View>
            <TouchableOpacity style={styles.bookButton}>
              <Text style={styles.bookButtonText}>{t('MaidHometab.request')}</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => navigation.navigate('MaidHomeScreen')}>
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
    </View>
  );
};

export default MaidHomeScreen;
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F7FFE5',
      padding: 10,
    },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    searchInput: {
      flex: 1,
      backgroundColor: '#F3EDF7',
      padding: 8,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#ccc',
    },
    iconButton: {
      marginHorizontal: 10,
    },
    separator: {
      height: 1,
      backgroundColor: 'black',
      marginBottom: 10,
    },
    tabContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      marginBottom: 10,
    },
    tabButton: {
      paddingVertical: 5,
      width: 116,
      height: 30,
      borderRadius: 15,
      backgroundColor: '#91AC8F',
      justifyContent: 'center',
      alignItems: 'center',
    },
    activeTab: {
      backgroundColor: '#91AC8F',
    },
    tabText: {
      color: '#fff',
      fontSize: 16,
      textAlign: 'center',
    },
    maidCard: {
      flexDirection: 'row',
      backgroundColor: '#D9D9D9',
      width: 346,
      height: 129,
      padding: 10,
      marginBottom: 10,
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    maidImage: {
      width: 87,
      height: 79,
    },
    maidDetails: {
      flex: 1,
      marginLeft: 10,
    },
    maidName: {
      fontWeight: 'bold',
      fontSize: 20,
    },
    maidLocation: {
      color: 'gray',
    },
    maidServices: {
      color: 'gray',
    },
    bookButton: {
      backgroundColor: '#91AC8F',
      padding: 10,
      borderRadius: 20,
    },
    bookButtonText: {
      color: 'black',
      fontSize: 16,
      fontWeight: '600',
    },
    bottomNav: {
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
    customizeContainer: {
      padding: 20,
      backgroundColor: '#F7FFE5',
      borderRadius: 10,
      flex: 1,  // Ensures it takes up full screen space
      justifyContent: 'center',  // Vertically center the content
      alignItems: 'center',  // Horizontally center the content
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 20,  // Space between title and fields
    },
    inputField: {
      backgroundColor: '#D9D9D9',
      padding: 8,
      width: 350,  // Set a fixed width for the fields to make sure they're within the screen
      height: 51,
      marginVertical: 10,  // Slight space between fields and button
      borderRadius: 0,  // Slight border radius for styling
    },
    searchButton: {
      backgroundColor: '#66785F',
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 0,
      marginBottom: 15,
      marginTop: 15,  // Space between last input and button
      width: 350,  // Keep the width the same as the input fields
      alignItems: 'center',
    },
    searchButtonText: {
      color: '#FFFFFF',
      fontSize: 24,
      fontWeight: 'bold',
    },
    searchButtonText: {
      color: '#fff',
      fontSize: 24,
      fontWeight: '600',
    },
  });
  