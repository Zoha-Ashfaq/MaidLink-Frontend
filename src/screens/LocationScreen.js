import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, FlatList } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

const LocationScreen = ({ route }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { userType = 'homeowner' } = route.params || {}; // Get userType from route params

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [sharedLocation, setSharedLocation] = useState(null);
  const [showUserList, setShowUserList] = useState(false); // Controls visibility of the user list
  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState([]); // List of recent users (mock data)

  // Request location permission and fetch current location
  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg(t('Location.locationPermissionDenied'));
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
    };

    getLocation();

    // Mock users for sharing location (this would usually come from your backend or context)
    setUsers([
      { id: 1, name: 'Hina', latitude: 37.789, longitude: -122.432 },
      { id: 2, name: 'Ali', latitude: 37.790, longitude: -122.433 },
      { id: 3, name: 'Maid A', latitude: 37.791, longitude: -122.434 },
      { id: 4, name: 'Homeowner B', latitude: 37.792, longitude: -122.435 },
    ]);
  }, []);

  const shareLocation = (user) => {
    if (location) {
      setSharedLocation(location);
      Alert.alert(t('Location.locationShared'), `${t('Location.locationSharedMessage')} ${user.name}`);
      setShowUserList(false); // Hide the user list after sharing
    } else {
      Alert.alert(t('Location.error'), t('Location.unableToGetLocation'));
    }
  };

  const handleSearchChange = (text) => {
    setSearchText(text);
  };

  const filteredUsers = users.filter(user => user.name.toLowerCase().includes(searchText.toLowerCase()));

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{userType === 'maid' ? t('Location.maidLocation') : t('Location.homeownerLocation')}</Text>

      {/* Map View */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location ? location.latitude : 37.78825,
          longitude: location ? location.longitude : -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {location && (
          <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} title={t('yourLocation')} />
        )}

        {/* Marker for the shared location */}
        {sharedLocation && (
          <Marker
            coordinate={{
              latitude: sharedLocation.latitude,
              longitude: sharedLocation.longitude,
            }}
            title={userType === 'maid' ? t('Location.maidLocation') : t('Location.homeownerLocation')}
            pinColor="blue"
          />
        )}

        {/* Markers for recent users */}
        {users.map(user => (
          <Marker
            key={user.id}
            coordinate={{ latitude: user.latitude, longitude: user.longitude }}
            title={user.name}
            pinColor="#FF6347" // Consistent color for users
            onPress={() => shareLocation(user)} // Allow sharing location with this user
          />
        ))}
      </MapView>

      {/* Share Location Button */}
      <TouchableOpacity style={styles.button} onPress={() => setShowUserList(true)}>
        <Ionicons name="location-sharp" size={24} color="white" />
        <Text style={styles.buttonText}>{t('Location.shareLocation')}</Text>
      </TouchableOpacity>

      {/* Search & User List */}
      {showUserList && (
        <View style={styles.userListContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder={t('Location.searchUser')}
            value={searchText}
            onChangeText={handleSearchChange}
          />
          <FlatList
            data={filteredUsers}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.userItem} onPress={() => shareLocation(item)}>
                <Text style={styles.userName}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => navigation.navigate('HometabScreen')}>
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
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person" size={34} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FFE5',
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  map: {
    width: '100%',
    height: '60%',
    borderRadius: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#66785F',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 50,
    marginTop: 10,
    alignSelf: 'center', // Center-align the button
  },
  buttonText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 16,
  },
  userListContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 10,
    maxHeight: 200, // To keep the list from overflowing
    zIndex: 1, // Make sure the list stays on top of the map
    backgroundColor: '#E8F5E9', // Greenish background for consistency
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  userItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  userName: {
    fontSize: 18,
    color: '#333',
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
});

export default LocationScreen;
