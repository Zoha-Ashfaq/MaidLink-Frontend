import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  Alert, 
  Image, 
  StyleSheet, 
  ActivityIndicator,
  RefreshControl 
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useUser } from './UserContext';
import api from '../services/api';
import BottomNavigation from './BottomNavigation';
import axios from 'axios';

const MaidHomeScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [fetching, setFetching] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [geocodeCache, setGeocodeCache] = useState({});

  // Fetch orders when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchAvailableOrders();
      return () => {
        // Cleanup if needed
      };
    }, [])
  );

  const reverseGeocode = async (longitude, latitude) => {
    const cacheKey = `${longitude},${latitude}`;
    
    if (geocodeCache[cacheKey]) {
      return geocodeCache[cacheKey];
    }

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse`,
        {
          params: { format: 'json', lat: latitude, lon: longitude },
          headers: { 'User-Agent': 'MaidServiceApp/1.0 (your@email.com)' }
        }
      );
      
      const locationText = response.data.display_name;
      setGeocodeCache(prev => ({ ...prev, [cacheKey]: locationText }));
      return locationText;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return 'Unknown location';
    }
  };

  const fetchAvailableOrders = async () => {
    if (fetching) return;
    
    try {
      setError(null);
      setFetching(true);
      setLoading(true);
      
      const response = await api.get('/order/available-orders');
      
      if (response.data?.status) {
        const uniqueOrders = response.data.orders.reduce((acc, order) => {
          if (!acc.some(existing => existing._id === order._id)) {
            return [...acc, order];
          }
          return acc;
        }, []);

        const enrichedOrders = await Promise.all(
          uniqueOrders.map(async (order) => {
            if (Array.isArray(order.location)) {
              const [longitude, latitude] = order.location;
              const locationText = await reverseGeocode(longitude, latitude);
              return { ...order, locationText };
            }
            return { ...order, locationText: 'Unknown' };
          })
        );
        
        setOrders(enrichedOrders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to fetch available orders');
    } finally {
      setFetching(false);
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAvailableOrders();
    setRefreshing(false);
  };

  const handleEmergencyPress = () => {
    Alert.alert(t('MaidHometab.emergency_title'), t('MaidHometab.emergency_message'), [
      { text: t('MaidHometab.cancel'), style: 'cancel' },
      { text: t('MaidHometab.call_police'), onPress: () => console.log('Calling Police...') },
    ]);
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      fetchAvailableOrders();
      return;
    }

    const filtered = orders.filter(order => 
      order.jobType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.ownerId.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setOrders(filtered);
  };

  const handleApplyForOrder = async (orderId) => {
    try {
      const response = await api.post(
        `/order/maid/apply/${orderId}`,  
        {}, 
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          }
        }
      );
  
      if (response.status >= 200 && response.status < 300) {
        if (response.data?.status === false) {
          Alert.alert('Notice', response.data.msg || 'Application not processed');
        } else {
          Alert.alert('Success', response.data?.msg || 'Applied to order successfully!');
          fetchAvailableOrders();
        }
      } else {
        throw new Error(response.data?.msg || 'Unexpected response from server');
      }
    } catch (error) {
      console.error('Error applying for order:', error);
      
      let errorMessage = 'Failed to apply for order';
      if (error.response) {
        errorMessage = error.response.data?.msg || 
                      error.response.data?.message || 
                      `Server error (${error.response.status})`;
      } else if (error.request) {
        errorMessage = 'No response from server - please check your connection';
      }
  
      Alert.alert('Error', errorMessage);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#66785F" />
      </View>
    ); 
  }

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TextInput 
          style={styles.searchInput} 
          placeholder={t('MaidHometab.search_placeholder')}
          value={searchTerm}
          onChangeText={setSearchTerm}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity onPress={handleEmergencyPress} style={styles.iconButton}>
          <Ionicons name="alert-circle" size={28} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('MaidNotification')} style={styles.iconButton}>
          <Feather name="heart" size={28} color="black" />
        </TouchableOpacity>
      </View>

      {/* Separator */}
      <View style={styles.separator} />

      {/* Error Message */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={fetchAvailableOrders}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Job Requests for Maids */}
      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.flatListContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#66785F']}
            tintColor="#66785F"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No available orders found</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('HomeownerDetailsScreen', { 
            homeownerId: item.ownerId._id,
            orderDetails: {
              _id: item._id,
              ownerName: item.ownerId.name,
              location: item.locationText,
              jobType: item.jobType,
              duration: item.duration,
              charges: item.charges,
            }
          })}>
            <View style={styles.maidCard}>
              <Image 
                source={require('../../assets/pictures/maid1.jpg')}
                style={styles.maidImage} 
              />
              <View style={styles.maidDetails}>
                <Text style={styles.maidName}>{item.ownerId.name}</Text>
                <Text style={styles.maidLocation}>Location: {item.locationText}</Text>
                <Text style={styles.maidServices}>Service: {item.jobType}</Text>
                <Text style={styles.maidRate}>Rate: ${item.charges} for {item.duration}</Text>
              </View>
              <TouchableOpacity 
                style={styles.bookButton} 
                onPress={() => handleApplyForOrder(item._id)}
              >
                <Text style={styles.bookButtonText}>{t('MaidHometab.request')}</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Bottom Navigation */}
      <BottomNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FFE5',
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7FFE5',
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
  flatListContent: {
    paddingBottom: 85,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#555',
  },
  errorContainer: {
    padding: 15,
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    margin: 10,
    alignItems: 'center'
  },
  errorText: {
    color: '#D32F2F',
    marginBottom: 5
  },
  retryText: {
    color: '#66785F',
    fontWeight: 'bold'
  }
});

export default MaidHomeScreen;