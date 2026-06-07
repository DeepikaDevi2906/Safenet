import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../api/api";
import axios from "axios";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await API.post(
        "/login",
        {
          email,
          password,
        }
      );
       console.log(response.data);
      await AsyncStorage.setItem(
        "token",
        response.data.access_token
      );
      await AsyncStorage.setItem(
        "username",
        response.data.user.username
      );
      await AsyncStorage.setItem(
  "user_id",
  response.data.user.id.toString()
);
      Alert.alert(
        "Success",
        "Login Successful"
      );

      navigation.navigate("Main");
    } catch (error) {
      console.log(error);

      Alert.alert(
        "Login Failed",
        "Invalid Email or Password"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>
        SAFENET
      </Text>

      <Text style={styles.subtitle}>
        Welcome Back
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Pressable
        style={styles.loginButton}
        onPress={handleLogin}
      >
        <Text style={styles.loginButtonText}>
          Login
        </Text>
      </Pressable>

      <Pressable
        onPress={() =>
          navigation.navigate("Register")
        }
      >
        <Text style={styles.registerText}>
          Don't have an account? Register
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 25,
    backgroundColor: "#F5F7FA",
  },

  logo: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#1E3A8A",
    textAlign: "center",
  },

  subtitle: {
    textAlign: "center",
    marginBottom: 40,
    color: "#555",
  },

  input: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  loginButton: {
    backgroundColor: "#1E3A8A",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  loginButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },

  registerText: {
    marginTop: 20,
    textAlign: "center",
    color: "#1E3A8A",
    fontWeight: "600",
  },
});