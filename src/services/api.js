import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Configure BASE_URL based on platform and environment
const getBaseUrl = () => {
  if (Platform.OS === 'android') {
    // Android emulator uses 10.0.2.2 to access localhost
    console.log('Using Android emulator URL');
    return 'http://192.168.217.129:80/api';  // 'http://10.0.2.2:3000/api';
  } else if (Platform.OS === 'ios') {
    // iOS simulator can use localhost
    return 'http://localhost:80/api';
  } else {
    // For physical devices, use your computer's local IP address
    // Replace with your computer's IP address when testing on physical device
    console.log('Using physical device URL');
    return 'http://192.168.217.129:80/api';
  }
};

const BASE_URL = getBaseUrl();

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 seconds timeout
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    // Don't override Content-Type if it's already set (for file uploads)
    if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }

    // For FormData logging, create a simplified view of the data
    let logData = config.data;
    if (config.data instanceof FormData) {
      const formDataEntries = {};
      for (let pair of config.data._parts) {
        const key = pair[0];
        const value = pair[1];
        // For file objects, just log a simpler representation
        if (value && typeof value === 'object' && value.uri) {
          formDataEntries[key] = {
            type: 'file',
            uri: value.uri,
            name: value.name,
            mimeType: value.type
          };
        } else {
          formDataEntries[key] = value;
        }
      }
      logData = formDataEntries;
    }

    console.log('API Request:', {
      url: config.url,
      method: config.method,
      data: logData,
      fullUrl: config.baseURL + config.url,
      headers: config.headers
    });

    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
/* api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error('API Response Error:', {
      url: error.config?.url,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    return Promise.reject(error);
  }
); */
api.interceptors.request.use(
  async (config) => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const { token } = JSON.parse(userData);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.error('Error getting auth token', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
// OTP Services
export const sendOTP = async (phone) => {
  try {
    const response = await api.post('/user/send-otp', { phone });
    return response.data;
  } catch (error) {
    console.error('Send OTP Error Details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw error;
  }
};

export const verifyOTP = async (phone, otp) => {
  try {
    console.log('Verify OTP Request:', { phone, otp });
    const response = await api.post('/user/verify-otp', { phone, otp });
    return response.data;
  } catch (error) {
    console.error('Verify OTP Error Details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw error;
  }
};



export const registerMaid = async (userData) => {
  try {
    console.log('Registering maid...');

    // If userData is already FormData, use it directly
    let formData = userData instanceof FormData ? userData : new FormData();

    // If userData is a plain object, convert it to FormData
    if (!(userData instanceof FormData)) {
      // Append all user data to FormData
      Object.keys(userData).forEach(key => {
        if (key === 'services' && Array.isArray(userData[key])) {
          // Handle array data
          formData.append('services', JSON.stringify(userData[key]));
        } else if (key === 'cnic' && userData[key] && userData[key].uri) {
          // Handle CNIC file
          const file = userData[key];
          formData.append('cnic', {
            uri: file.uri,
            name: file.name || `cnic_${Date.now()}.${file.uri.split('.').pop()}`,
            type: file.type || 'application/octet-stream',
          });
          console.log('Appended CNIC file:', file.uri);
        } else if ((key === 'criminalRecord' || key === 'criminalRecordCertificate') && userData[key] && userData[key].uri) {
          // Handle criminal record file
          const file = userData[key];
          formData.append('criminalRecordCertificate', {
            uri: file.uri,
            name: file.name || `criminal_record_${Date.now()}.${file.uri.split('.').pop()}`,
            type: file.type || 'application/octet-stream',
          });
          console.log('Appended criminal record file:', file.uri);
        } else if (key === 'profileImg' && userData[key] && userData[key].uri) {
          // Handle profile image file
          const file = userData[key];
          formData.append('profileImg', {
            uri: file.uri,
            name: file.name || `profile_${Date.now()}.${file.uri.split('.').pop()}`,
            type: file.type || 'image/jpeg',
          });
          console.log('Appended profile image:', file.uri);
        } else {
          // Handle all other fields
          formData.append(key, userData[key]);
        }
      });
    }

    // Log FormData contents for debugging
    const formDataLog = {};
    if (formData._parts) {
      formData._parts.forEach(part => {
        const [key, value] = part;
        if (value && typeof value === 'object' && value.uri) {
          formDataLog[key] = `File: ${value.name}, URI: ${value.uri}`;
        } else {
          formDataLog[key] = value;
        }
      });
    }
    console.log('FormData contents:', formDataLog);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000, // Increase timeout for file uploads
    };

    // Make the request
    const response = await api.post('/maid/register', formData, config);
    console.log('Register Maid Success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Register Maid Error Details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      stack: error.stack
    });

    // Try to provide a helpful error message
    if (error.response?.data) {
      throw error.response.data;
    } else if (error.message.includes('Network Error')) {
      throw new Error('Network connection error. Please check your internet connection and try again.');
    } else {
      throw error;
    }
  }
};

export const loginUser = async (credentials,
  userType) => {
  try {
    console.log('Logging in user:', { credentials, userType });
    const response = await axios.post(`${BASE_URL}/${userType}/login`, credentials, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Login response:', response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const registerHomeOwner = async (userData) => {
  try {
    console.log("API call to register:", userData);

    const response = await axios.post(`${BASE_URL}/user/register`, userData, {
      headers: {
        'Content-Type': 'application/json',
        // No need to include token here unless your backend requires it for registration
      },
    });

    return response.data;
  } catch (error) {
    // Forward the error so the calling function can handle it
    throw error;
  }
};