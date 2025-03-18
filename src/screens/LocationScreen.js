import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

const LocationScreen = ({ route }) => {
  const { t } = useTranslation(); // Translation hook
  const navigation = useNavigation(); // To access navigation
  const { userType = 'homeowner' } = route.params || {}; // Get userType from route params

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [sharedLocation, setSharedLocation] = useState(null);

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
  }, []);

  const startTracking = async () => {
    setIsTracking(true);
    // Track the current location in real-time
    Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 1 },
      (newLocation) => {
        setLocation(newLocation.coords);
      }
    );
  };

  const stopTracking = () => {
    setIsTracking(false);
    setLocation(null);
  };

  const shareLocation = () => {
    if (location) {
      setSharedLocation(location);
      Alert.alert(t('Location.locationShared'), t('Location.locationSharedMessage'));
    } else {
      Alert.alert(t('Location.error'), t('Location.unableToGetLocation'));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{userType === 'maid' ? t('Location.maidLocation') : t('Location.homeownerLocation')}</Text>

      {/* Map View */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location ? location.latitude : 37.78825, // Default to a general location
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
      </MapView>

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={shareLocation}>
          <Ionicons name="location-sharp" size={24} color="white" />
          <Text style={styles.buttonText}>{t('Location.shareLocation')}</Text>
        </TouchableOpacity>

        {isTracking ? (
          <TouchableOpacity style={styles.button} onPress={stopTracking}>
            <Ionicons name="stop-circle" size={24} color="white" />
            <Text style={styles.buttonText}>{t('Location.stopTracking')}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={startTracking}>
            <Ionicons name="play-circle" size={24} color="white" />
            <Text style={styles.buttonText}>{t('Location.startTracking')}</Text>
          </TouchableOpacity>
        )}
      </View>

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
    height: '70%',
    borderRadius: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#66785F',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 50,
  },
  buttonText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 16,
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
