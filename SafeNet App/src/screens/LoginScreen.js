import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import api from '../services/api';
import { useAuth } from '../context/AuthContext'; 

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      // API call to your Flask /login route
      const response = await api.post('/login', { email, password });
      
      // Extract user_id from the response: { "user_id": user.id }
      const userId = response.data.user_id.toString();

      await login(userId); // Log user in and save ID to AsyncStorage
      
      // Use replace so the user can't hit 'back' to the login screen
      navigation.replace('Home'); 

    } catch (error) {
      console.error('Login Failed:', error.response?.data || error.message);
      // Display the specific message from your Flask backend
      Alert.alert('Login Failed', error.response?.data?.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to SafeNet</Text>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Sign In</Text>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.linkText}>Don't have an account? Register here</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
// ----------------------------------------------------
// Reusing your previous style definitions for a consistent look
// ----------------------------------------------------
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f0f4f7', justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', alignSelf: 'center', marginBottom: 40, color: '#2c3e50' },
  card: { padding: 25, borderRadius: 16, backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  sectionTitle: { fontSize: 24, fontWeight: '600', marginBottom: 20, color: '#34495e', alignSelf: 'center' },
  input: { 
    borderWidth: 1, 
    borderColor: '#bdc3c7', 
    padding: 12, 
    marginBottom: 15, 
    borderRadius: 8, 
    backgroundColor: '#ecf0f1',
    fontSize: 16
  },
  button: { 
    backgroundColor: '#3498db', // Blue button color
    padding: 15, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginBottom: 15
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  linkText: { color: '#3498db', fontSize: 14, textAlign: 'center', marginTop: 10 },
});