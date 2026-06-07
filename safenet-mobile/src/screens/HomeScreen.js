import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../api/api";
import * as Location from "expo-location";

export default function HomeScreen({ navigation }) {
  const [username, setUsername] = useState("");

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const storedUsername =
      await AsyncStorage.getItem(
        "username"
      );

    if (storedUsername) {
      setUsername(storedUsername);
    }
  };
  
  const getCurrentLocation = async () => {
  try {
    const { status } =
      await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Location permission required"
      );
      return null;
    }

    const location =
      await Location.getCurrentPositionAsync({});

    return {
      latitude:
        location.coords.latitude,
      longitude:
        location.coords.longitude,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};
const startLiveTracking = async (
  userId
) => {

  setInterval(
    async () => {

      try {

        const location =
          await getCurrentLocation();

        if (!location) return;

        await API.post(
          "/track",
          {
            user_id: parseInt(
              userId
            ),

            latitude:
              location.latitude,

            longitude:
              location.longitude
          }
        );

        console.log(
          "📍 Location Sent"
        );

      } catch (error) {

        console.log(
          "Tracking Error:",
          error
        );

      }

    },
    10000
  );

};
  const handleSOS = async () => {
  try {
    const userId =
      await AsyncStorage.getItem(
        "user_id"
      );

    const location =
      await getCurrentLocation();

    console.log("USER ID:", userId);
console.log("LOCATION:", location);

    if (!location) return;

    const response =
      await API.post(
        `/sos/${userId}`,
        {
          latitude:
            location.latitude,
          longitude:
            location.longitude,
        }
      );

    Alert.alert(
      "🚨 SOS Sent",
      `${response.data.contacts_notified} contacts notified`
    );
    await startLiveTracking(
  userId
);

  } catch (error) {

  console.log(
    "STATUS:",
    error.response?.status
  );

  console.log(
    "DATA:",
    JSON.stringify(
      error.response?.data,
      null,
      2
    )
  );

  Alert.alert(
    "Error",
    "Failed to send SOS"
  );
}
};
  return (
    <ScrollView
      contentContainerStyle={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            Hello {username} 👋
          </Text>

          <Text style={styles.status}>
            🟢 Protection Active
          </Text>
        </View>

        <Text style={styles.bell}>
          🔔
        </Text>
      </View>

      {/* SOS */}
      <View style={styles.sosContainer}>
        <Pressable
          style={styles.sosButton}
          onPress={handleSOS}
        >
          <Text style={styles.sosText}>
            SOS
          </Text>
        </Pressable>

        <Text style={styles.sosInfo}>
          Press for Emergency Alert
        </Text>
      </View>

      {/* Safety Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          🛡 Safety Status
        </Text>

        <Text style={styles.cardText}>
          AI Monitoring Enabled
        </Text>

        <Text style={styles.cardText}>
          Emergency Contacts Connected
        </Text>

        <Text style={styles.cardText}>
          SOS System Ready
        </Text>
      </View>

      {/* Location */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          📍 Location
        </Text>

        <Text style={styles.cardText}>
          Chennai, Tamil Nadu
        </Text>

        <Text style={styles.smallText}>
          Live Tracking Coming Soon
        </Text>
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>
        Quick Actions
      </Text>

      <View style={styles.grid}>
        <Pressable
          style={styles.actionCard}
          onPress={() =>
            navigation.navigate(
              "Emergency Contacts"
            )
          }
        >
          <Text style={styles.icon}>
            👥
          </Text>

          <Text style={styles.actionText}>
            Contacts
          </Text>
        </Pressable>

        <Pressable
          style={styles.actionCard}
          onPress={() =>
            navigation.navigate(
              "Live Tracking"
            )
          }
        >
          <Text style={styles.icon}>
            📍
          </Text>

          <Text style={styles.actionText}>
            Tracking
          </Text>
        </Pressable>

        <Pressable
          style={styles.actionCard}
          onPress={() =>
            navigation.navigate(
              "Safe Zones"
            )
          }
        >
          <Text style={styles.icon}>
            🛡
          </Text>

          <Text style={styles.actionText}>
            Safe Zones
          </Text>
        </Pressable>

        <Pressable
          style={styles.actionCard}
          onPress={() =>
            navigation.navigate(
              "Settings"
            )
          }
        >
          <Text style={styles.icon}>
            ⚙️
          </Text>

          <Text style={styles.actionText}>
            Settings
          </Text>
        </Pressable>
      </View>

      {/* Activity */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          📋 Recent Activity
        </Text>

        <Text style={styles.cardText}>
          ✅ Login Successful
        </Text>

        <Text style={styles.cardText}>
          ✅ Contacts Synced
        </Text>

        <Text style={styles.cardText}>
          ✅ SAFENET Ready
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F5F7FA",
    flexGrow: 1,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },

  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1E3A8A",
  },

  status: {
    marginTop: 5,
    color: "#22C55E",
    fontSize: 16,
    fontWeight: "600",
  },

  bell: {
    fontSize: 28,
  },

  sosContainer: {
    alignItems: "center",
    marginBottom: 30,
  },

  sosButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#DC2626",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
  },

  sosText: {
    color: "white",
    fontSize: 42,
    fontWeight: "bold",
  },

  sosInfo: {
    marginTop: 15,
    color: "#666",
    fontSize: 15,
  },

  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 18,
    marginBottom: 15,
    elevation: 3,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  cardText: {
    fontSize: 15,
    marginBottom: 6,
  },

  smallText: {
    color: "#777",
    marginTop: 5,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 15,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  actionCard: {
    width: "48%",
    backgroundColor: "white",
    borderRadius: 18,
    padding: 25,
    alignItems: "center",
    marginBottom: 15,
    elevation: 4,
  },

  icon: {
    fontSize: 34,
    marginBottom: 10,
  },

  actionText: {
    fontSize: 16,
    fontWeight: "600",
  },
});