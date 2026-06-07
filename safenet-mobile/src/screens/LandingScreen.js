import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";

export default function LandingScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.logo}>
        SAFENET
      </Text>

      <Text style={styles.tagline}>
        AI Powered Safety Ecosystem
      </Text>

      <Text style={styles.description}>
        Stay Safe. Stay Connected.
        Stay Protected.
      </Text>

      <View style={styles.heroCard}>
        <Text style={styles.heroText}>
          Your personal safety companion for emergencies,
          live location sharing, and instant SOS support.
        </Text>
      </View>

      <View style={styles.featureCard}>
        <Text style={styles.featureTitle}>
          🆘 Instant SOS
        </Text>

        <Text style={styles.featureDesc}>
          Send emergency alerts instantly.
        </Text>
      </View>

      <View style={styles.featureCard}>
        <Text style={styles.featureTitle}>
          📍 Live Location Sharing
        </Text>

        <Text style={styles.featureDesc}>
          Share your location during emergencies.
        </Text>
      </View>

      <View style={styles.featureCard}>
        <Text style={styles.featureTitle}>
          📞 Emergency Contacts
        </Text>

        <Text style={styles.featureDesc}>
          Notify trusted contacts with one tap.
        </Text>
      </View>

      <View style={styles.featureCard}>
        <Text style={styles.featureTitle}>
          🚨 Real-Time Monitoring
        </Text>

        <Text style={styles.featureDesc}>
          Connected to the SAFENET monitoring system.
        </Text>
      </View>

      <Pressable style={styles.button} onPress={() => navigation.navigate("Login")}>
        <Text style={styles.buttonText}>
          Get Started
        </Text>
      </Pressable>

      <Text style={styles.loginText}>
        Already have an account? Login
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
    backgroundColor: "#F5F7FA",
    alignItems: "center",
    paddingTop: 80,
    paddingBottom: 60,
  },

  logo: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#1E3A8A",
  },

  tagline: {
    marginTop: 10,
    fontSize: 18,
    color: "#555",
  },

  description: {
    marginTop: 20,
    fontSize: 16,
    textAlign: "center",
    color: "#444",
    lineHeight: 24,
  },

  heroCard: {
    marginTop: 30,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    width: "100%",
    elevation: 4,
  },

  heroText: {
    textAlign: "center",
    fontSize: 16,
    color: "#333",
  },

  featureCard: {
    width: "100%",
    backgroundColor: "white",
    padding: 18,
    borderRadius: 16,
    marginTop: 15,
    elevation: 3,
  },

  featureTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },

  featureDesc: {
    marginTop: 8,
    color: "#666",
  },

  button: {
    marginTop: 35,
    backgroundColor: "#1E3A8A",
    width: "100%",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },

  loginText: {
    marginTop: 20,
    color: "#1E3A8A",
    fontWeight: "600",
  },
});