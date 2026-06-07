import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
} from "react-native";

import API from "../api/api";

export default function RegisterScreen({ navigation }) {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {

    if (!name || !email || !password) {

      alert("Please fill all fields");
      return;
    }

    try {

      console.log("Sending registration request...");

      const response = await API.post(
        "/register",
        {
          username: name,
          email: email,
          password: password
        }
      );

      console.log(
        "REGISTER SUCCESS:",
        response.data
      );

      alert(
        response.data.message ||
        "Registration Successful"
      );

      navigation.navigate("Login");

    } catch (error) {

      console.log(
        "REGISTER ERROR:",
        error.response?.data ||
        error.message
      );

      alert(
        JSON.stringify(
          error.response?.data ||
          error.message
        )
      );
    }
  };

  return (

    <View style={styles.container}>

      <Text style={styles.logo}>
        SAFENET
      </Text>

      <Text style={styles.subtitle}>
        Create Account
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Pressable
        style={styles.registerButton}
        onPress={handleRegister}
      >
        <Text style={styles.registerText}>
          Create Account
        </Text>
      </Pressable>

      <Pressable
        onPress={() =>
          navigation.navigate("Login")
        }
      >
        <Text style={styles.loginLink}>
          Already have an account? Login
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
    marginBottom: 10,
  },

  subtitle: {
    textAlign: "center",
    marginBottom: 30,
    color: "#555",
    fontSize: 16,
  },

  input: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  registerButton: {
    backgroundColor: "#1E3A8A",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 5,
  },

  registerText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },

  loginLink: {
    marginTop: 20,
    textAlign: "center",
    color: "#1E3A8A",
    fontWeight: "600",
  },

});