// src/navigation/AppStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import ContactsScreen from '../screens/ContactsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SafeRegionScreen from '../screens/SafeRegionScreen';
import AlertsScreen from '../screens/AlertsScreen';

const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'SafeNet' }} 
      />
      <Stack.Screen 
        name="Contacts" 
        component={ContactsScreen} 
        options={{ title: 'Emergency Contacts' }} 
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ title: 'Settings' }} 
      />
      <Stack.Screen 
        name="SafeRegion" 
        component={SafeRegionScreen} 
        options={{ title: 'Safe Region' }} 
      />
      <Stack.Screen 
        name="Alerts" 
        component={AlertsScreen} 
        options={{ title: 'Emergency Alerts' }} 
      />
      {/* You can add your Logout functionality here or in SettingsScreen */}
    </Stack.Navigator>
  );
}