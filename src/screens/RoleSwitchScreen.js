import React from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import { useUserContext } from './UserContext';

const RoleSwitchScreen = () => {
  const { userRole, changeRole } = useUserContext();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Current Role: {userRole}</Text>

      <Button title="Switch to Maid" onPress={() => changeRole('maid')} />
      <Button title="Switch to Homeowner" onPress={() => changeRole('homeowner')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
});

export default RoleSwitchScreen;
