import React, { useState, useEffect , useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, Image, StyleSheet, ScrollView ,ActivityIndicator} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, Feather } from '@expo/vector-icons';
import axios from 'axios';
import { BASE_URL } from '../services/api';
import api from '../services/api';
import * as Location from 'expo-location';
import { useUser  } from './UserContext'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavigation from './BottomNavigation';

const HomeScreen = () => {
  const { t } = useTranslation();
  const { user, isLoading } = useUser(); 

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }  
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState('browse');
  const [formData, setFormData] = useState({
    location: '',
    duration: '4 hours', // Default duration
    jobType: '',
    charges: '',
    selectedServices: [],
  });
  const [userCoordinates, setUserCoordinates] = useState(null);
  const [maids, setMaids] = useState([]);
  const [filteredMaids, setFilteredMaids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const suggestedServices = [
    t('addServicesScreen.suggestedServices.cleaning'),
    t('addServicesScreen.suggestedServices.cooking'),
    t('addServicesScreen.suggestedServices.childcare'),
    t('addServicesScreen.suggestedServices.elderCare'),
    t('addServicesScreen.suggestedServices.gardening'),
  ];

  // Duration options
  const durationOptions = [
    '2 hours',
    '4 hours',
    '6 hours',
    '8 hours',
    'Full day'
  ];

  useEffect(() => {
    const fetchMaids = async () => {
      try {

        const response = await api.get('/maid/all-maids');
        if (response.data.status) {
          setMaids(response.data.maids);
          setFilteredMaids(response.data.maids);
        }
      } catch (error) {
        console.error('Error fetching maids:', error);
        Alert.alert('Error', 'Failed to fetch maids data');
      } finally {
        setLoading(false);
      }
    };
  
    fetchMaids();
    getUserLocation();
  }, []);

  // Get user's current location
  const getUserLocation = async () => {
    try {
      // Request permission to access location
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Allow location access to create customized orders');
        return;
      }
      
      // Get current position
      const location = await Location.getCurrentPositionAsync({});
      const { longitude, latitude } = location.coords;
      
      setUserCoordinates([longitude, latitude]);
      
      // Get location name using reverse geocoding
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude
      });
      
      if (reverseGeocode.length > 0) {
        const address = reverseGeocode[0];
        const locationName = [
          address.city, 
          address.region, 
          address.country
        ].filter(Boolean).join(', ');
        
        setFormData(prev => ({
          ...prev,
          location: locationName
        }));
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Location Error', 'Could not get your current location');
    }
  };

  const handleEmergencyPress = () => {
    Alert.alert(t('Hometab.emergency_title'), t('Hometab.emergency_message'), [
      { text: t('Hometab.cancel'), style: 'cancel' },
      { text: t('Hometab.call_police'), onPress: () => console.log('Calling Police...') },
    ]);
  };

  const handleMaidPress = (maid) => {
    navigation.navigate('MaidDetailsScreen', { maid });
  };

  const toggleService = (service) => {
    setFormData(prev => {
      const newSelected = prev.selectedServices.includes(service)
        ? prev.selectedServices.filter(s => s !== service)
        : [...prev.selectedServices, service];
      
      // Set the jobType based on the first selected service
      const jobType = newSelected.length > 0 ? newSelected[0] : '';
      
      return { 
        ...prev, 
        selectedServices: newSelected,
        jobType: jobType
      };
    });
  };

  const handleCreateOrder = async () => {
    if (!userCoordinates) {
      Alert.alert('Location Required', 'Please allow location access to create an order');
      getUserLocation();
      return;
    }
    
    if (!formData.charges) {
      Alert.alert('Error', 'Please enter charges for the service');
      return;
    }
    
    if (!formData.jobType && formData.selectedServices.length > 0) {
      // Use the first selected service as job type if not explicitly set
      setFormData(prev => ({
        ...prev,
        jobType: formData.selectedServices[0]
      }));
    }
    
    if (!formData.jobType) {
      Alert.alert('Error', 'Please select at least one service');
      return;
    }
    
    try {
      setOrderLoading(true);
      
      const orderData = {
        location: userCoordinates,
        duration: formData.duration,
        jobType: formData.jobType,
        charges: parseInt(formData.charges),
        status: 'pending'
      };
      
      const response = await api.post(`/order/create-order/${user.id}`, orderData);      
      if (response.data && response.data.status) {
        Alert.alert('Success', 'Your order has been created successfully!');
        // Reset form or navigate to order status screen
        setFormData({
          location: formData.location, // Keep the location name
          duration: '4 hours',
          jobType: '',
          charges: '',
          selectedServices: [],
        });
        setSelectedTab('browse');
      } else {
        Alert.alert('Error', response.data.message || 'Failed to create order');
      }
    } catch (error) {
      console.error('Order creation error:', error);
      Alert.alert('Error', 'Failed to create your order. Please try again.');
    } finally {
      setOrderLoading(false);
    }
  };

  const handleSearchBar = () => {
    if (!searchTerm.trim()) {
      setFilteredMaids(maids); // Show all if search is empty
      return;
    }
  
    const results = maids.filter(maid => {
      const nameMatch = maid.userName.toLowerCase().includes(searchTerm.toLowerCase());
      const servicesMatch = maid.services.some(service => 
        service.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return nameMatch || servicesMatch;
    });
  
    setFilteredMaids(results);
  };
  
  const handleBrowsePress = () => {
    setSelectedTab('browse');
    setSearchTerm(''); // Clear search term
    setFilteredMaids(maids); // Reset to show all maids
  };

  const selectDuration = (duration) => {
    setFormData(prev => ({
      ...prev,
      duration
    }));
  };

  return (
    <View style={styles.container}>
      {/* Search Bar & Icons */}
      <View style={styles.topBar}>
        <TextInput 
          style={styles.searchInput} 
          placeholder={t('Hometab.search_placeholder')}
          value={searchTerm}
          onChangeText={setSearchTerm}
          onSubmitEditing={handleSearchBar} // Trigger search on enter/submit
        />        
        <TouchableOpacity onPress={handleEmergencyPress} style={styles.iconButton}>
          <Ionicons name="alert-circle" size={28} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('HomeownerNotification')} style={styles.iconButton}>
          <Feather name="heart" size={28} color="black" />
        </TouchableOpacity>
      </View>

      {/* Separator */}
      <View style={styles.separator} />

      {/* Browse & Customize Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'browse' && styles.activeTab]}
          onPress={handleBrowsePress} 
        >
          <Text style={styles.tabText}>{t('Hometab.browse')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'customize' && styles.activeTab]}
          onPress={() => setSelectedTab('customize')}
        >
          <Text style={styles.tabText}>{t('Hometab.customize')}</Text>
        </TouchableOpacity>
      </View>
      {/* Separator */}
      <View style={styles.separator} />

      {/* Maid Cards */}
      {selectedTab === 'browse' && (
        loading ? (
          <Text style={styles.loadingText}>Loading maids...</Text>
        ) : (
          <FlatList
            data={filteredMaids}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.flatListContent} 
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleMaidPress(item)}>
                <View style={styles.maidCard}>
                  <Image 
                    source={item.profileImg ? { uri: item.profileImg } : require('../../assets/pictures/maid1.jpg')} 
                    style={styles.maidImage} 
                  />
                  <View style={styles.maidDetails}>
                    <Text style={styles.maidName}>{item.userName}</Text>
                    <Text style={styles.maidLocation}>{item.serviceCity}</Text>
                    <Text style={styles.maidServices}>{item.services.join(', ')}</Text>
                    <Text style={styles.maidRate}>Rate: {item.ratePerHour} per hour</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.bookButton} 
                    onPress={() => handleMaidPress(item)}
                  >
                    <Text style={styles.bookButtonText}>{t('Hometab.book')}</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
          />
        )
      )}

      {/* Customize Tab - Order Form */}
      {selectedTab === 'customize' && (
        <ScrollView style={styles.customizeContainer}>
          <Text style={styles.title}>{t('CustomizeTab.customizeOrder')}</Text>
          
          {/* Location Field - Now showing detected location */}
          <Text style={styles.sectionTitle}>Your Location</Text>
          <View style={styles.locationContainer}>
            <Text style={styles.locationText}>
              {formData.location || 'Detecting your location...'}
            </Text>
            <TouchableOpacity 
              style={styles.refreshButton} 
              onPress={getUserLocation}
            >
              <Ionicons name="refresh" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          
          {/* Duration Selection */}
          <Text style={styles.sectionTitle}>Duration</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.durationContainer}>
            {durationOptions.map((duration, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.durationButton,
                  formData.duration === duration && styles.selectedDurationButton
                ]}
                onPress={() => selectDuration(duration)}
              >
                <Text style={[
                  styles.durationButtonText,
                  formData.duration === duration && styles.selectedDurationText
                ]}>
                  {duration}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          {/* Service Selection */}
          <Text style={styles.sectionTitle}>Select Services</Text>
          <View style={styles.servicesContainer}>
            {suggestedServices.map((service, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.serviceButton,
                  formData.selectedServices.includes(service) && styles.selectedServiceButton
                ]}
                onPress={() => toggleService(service)}
              >
                <Text style={[
                  styles.serviceButtonText,
                  formData.selectedServices.includes(service) && styles.selectedServiceText
                ]}>
                  {service}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          {/* Price/Charges Field */}
          <Text style={styles.sectionTitle}>Price (per hour)</Text>
          <TextInput
            style={styles.inputField}
            placeholder="Enter price you're willing to pay"
            keyboardType="numeric"
            value={formData.charges}
            onChangeText={(text) => setFormData({ ...formData, charges: text })}
          />
          
          {/* Create Order Button */}
          <TouchableOpacity 
            style={styles.createOrderButton}
            onPress={handleCreateOrder}
            disabled={orderLoading}
          >
            <Text style={styles.createOrderButtonText}>
              {orderLoading ? 'Creating Order...' : 'Create Custom Order'}
            </Text>
          </TouchableOpacity>
          
          <View style={styles.infoContainer}>
            <Ionicons name="information-circle-outline" size={20} color="#555" />
            <Text style={styles.infoText}>
              Your order will be sent to available service providers in your area
            </Text>
          </View>
        </ScrollView>
      )}

    
       {/* Bottom Navigation */}
   <View style={styles.bottomNav}>

<BottomNavigation />
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 50,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#F3EDF7',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
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
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 12,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  maidImage: {
    width: 85,
    height: 85,
    borderRadius: 12,
    marginRight: 12,
  },
  maidDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  maidName: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,
  },
  maidLocation: {
    color: '#555',
    fontSize: 14,
  },
  maidServices: {
    color: '#555',
    fontSize: 14,
  },
  maidRate: {
    color: '#2E8B57',
    fontWeight: '600',
    fontSize: 15,
    marginTop: 4,
  },
  bookButton: {
    backgroundColor: '#91AC8F',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  bookButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  customizeContainer: {
    flex: 1,
    padding: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#444',
  },
  inputField: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
    fontSize: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
  },
  locationText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  refreshButton: {
    backgroundColor: '#91AC8F',
    padding: 8,
    borderRadius: 20,
  },
  durationContainer: {
    marginBottom: 20,
  },
  durationButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedDurationButton: {
    backgroundColor: '#91AC8F',
    borderColor: '#91AC8F',
  },
  durationButtonText: {
    color: '#333',
    fontSize: 14,
  },
  selectedDurationText: {
    color: '#fff',
    fontWeight: '600',
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  serviceButton: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedServiceButton: {
    backgroundColor: '#91AC8F',
    borderColor: '#91AC8F',
  },
  serviceButtonText: {
    color: '#333',
  },
  selectedServiceText: {
    color: '#fff',
    fontWeight: '600',
  },
  createOrderButton: {
    backgroundColor: '#91AC8F',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  createOrderButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#555',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#66785F',
    paddingVertical: 10,
    height: 75,
  },
  flatListContent: {
    paddingBottom: 20, // Extra padding at the bottom of the list
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
  },
  infoText: {
    marginLeft: 8,
    color: '#555',
    fontSize: 14,
    flex: 1,
  }
});

export default HomeScreen;