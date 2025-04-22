import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView, View, ActivityIndicator } from 'react-native';
import './i18n';
import { UserProvider, useUser } from './src/screens/UserContext';

// Screens
import SplashScreen from './src/screens/SplashScreen';
import LanguageSelectionScreen from './src/screens/LanguageSelectionScreen';
import ForgotPassword from './src/screens/ForgotPassword';
import PhoneNumberScreen from './src/screens/PhoneNumberScreen';
import OTPScreen from './src/screens/OTPScreen';
import LoginScreen from './src/screens/LoginScreen';
import RoleSelectionScreen from './src/screens/RoleSelectionScreen';
import HomeOwnerSignUp from './src/screens/HomeOwnerSignUp';
import MaidSignUp from './src/screens/MaidSignUp';
import WorkDetailsScreen from './src/screens/WorkDetailsScreen';
import AddServicesScreen from './src/screens/AddServicesScreen';
import ProfilePictureScreen from './src/screens/ProfilePictureScreen';
import VerificationScreen from './src/screens/VerificationScreen';
import HometabScreen from './src/screens/HometabScreen';
import Notifications from './src/screens/Notifications';
import EmergencyHelp from './src/screens/EmergencyHelp';
import LocationScreen from './src/screens/LocationScreen';
import RoleSwitchScreen from './src/screens/RoleSwitchScreen';
import ChatListScreen from './src/screens/ChatListScreen';
import ChatScreen from './src/screens/ChatScreen';
import ProfileManagement from './src/screens/ProfileManagement';
import Video from './src/screens/Video';
import MaidHomeScreen from './src/screens/MaidHomeScreen';
import HomeownerNotification from './src/screens/HomeownerNotification';
import MaidNotification from './src/screens/MaidNotification';
import DetailsScreen from './src/screens/DetailsScreen';
import MyBookings from './src/screens/MyBookings';
import MaidDetailsScreen from './src/screens/MaidDetailsScreen';
import HomeownerDetailsScreen from './src/screens/HomeownerDetailsScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';

const Stack = createStackNavigator();

// Main Navigator Component
const AppNavigator = () => {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={user ? (user.type === 'maid' ? 'MaidHomeScreen' : 'HometabScreen') : 'Splash'}
      screenOptions={{ headerShown: false }}
    >
      {/* Auth Screens */}
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="LanguageSelectionScreen" component={LanguageSelectionScreen} />
      <Stack.Screen name="PhoneNumberScreen" component={PhoneNumberScreen} />
      <Stack.Screen name="OTP" component={OTPScreen} options={{ title: 'OTP Verification' }} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="RoleSelectionScreen" component={RoleSelectionScreen} />
      <Stack.Screen name="HomeOwnerSignUp" component={HomeOwnerSignUp} />
      <Stack.Screen name="MaidSignUp" component={MaidSignUp} />
      
      {/* Onboarding Screens */}
      <Stack.Screen name="WorkDetailsScreen" component={WorkDetailsScreen} />
      <Stack.Screen name="AddServicesScreen" component={AddServicesScreen} />
      <Stack.Screen name="ProfilePictureScreen" component={ProfilePictureScreen} />
      <Stack.Screen name="VerificationScreen" component={VerificationScreen} />

      {/* Main App Screens */}
      <Stack.Screen name="HometabScreen" component={HometabScreen} />
      <Stack.Screen name="MaidHomeScreen" component={MaidHomeScreen} />
      <Stack.Screen name="EmergencyHelp" component={EmergencyHelp} />
      <Stack.Screen name="RoleSwitch" component={RoleSwitchScreen} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="LocationScreen" component={LocationScreen} />
      <Stack.Screen name="ChatListScreen" component={ChatListScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen name="ProfileManagement" component={ProfileManagement} />
      <Stack.Screen name="Video" component={Video} />
      <Stack.Screen name="HomeownerNotification" component={HomeownerNotification} />
      <Stack.Screen name="MaidNotification" component={MaidNotification} />
      <Stack.Screen name="DetailsScreen" component={DetailsScreen} />
      <Stack.Screen name="MyBookings" component={MyBookings} />
      <Stack.Screen name="MaidDetailsScreen" component={MaidDetailsScreen} />
      <Stack.Screen name="HomeownerDetailsScreen" component={HomeownerDetailsScreen} />
      <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
    </Stack.Navigator>
  );
};

// Root App Component
const App = () => {
  return (
    <UserProvider>
      <NavigationContainer>
        <SafeAreaView style={{ flex: 1 }}>
          <AppNavigator />
        </SafeAreaView>
      </NavigationContainer>
    </UserProvider>
  );
};

export default App;