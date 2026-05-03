import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import api from '../services/api';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !phone || !password) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    setIsLoading(true);
    try {
      // API call to your Flask /register route
      const response = await api.post('/register', { name, email, phone, password });
      
      Alert.alert(
        'Success', 
        response.data.message || 'Registration successful. You can now log in.', 
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error) {
      console.error('Registration Failed:', error.response?.data || error.message);
      // Display the specific error message from your Flask backend
      Alert.alert('Registration Failed', error.response?.data?.message || 'Registration failed. Try a different email.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create SafeNet Account</Text>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Register</Text>
        <TextInput
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Phone Number"
          value={phone}
          onChangeText={setPhone}
          style={styles.input}
          keyboardType="phone-pad"
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Register Account</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>Already have an account? Sign In</Text>
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
    backgroundColor: '#e67e22', // Orange button color
    padding: 15, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginBottom: 15
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  linkText: { color: '#2980b9', fontSize: 14, textAlign: 'center', marginTop: 10 },
});