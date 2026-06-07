import { createDrawerNavigator } from "@react-navigation/drawer";

import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ContactsScreen from "../screens/ContactsScreen";
import TrackingScreen from "../screens/TrackingScreen";
import SafeZonesScreen from "../screens/SafeZonesScreen";
import SettingsScreen from "../screens/SettingsScreen";
import LogoutScreen from "../screens/LogoutScreen";

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: "#1E3A8A",
        },
        headerTintColor: "#fff",
        drawerActiveTintColor: "#1E3A8A",
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
      />

      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
      />

      <Drawer.Screen
        name="Emergency Contacts"
        component={ContactsScreen}
      />

      <Drawer.Screen
        name="Live Tracking"
        component={TrackingScreen}
      />

      <Drawer.Screen
        name="Safe Zones"
        component={SafeZonesScreen}
      />

      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
      />

      <Drawer.Screen
        name="Logout"
        component={LogoutScreen}
      />
    </Drawer.Navigator>
  );
}