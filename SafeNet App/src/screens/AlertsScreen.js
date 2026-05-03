// File: src/screens/AlertsScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import io from 'socket.io-client';
import api from '../services/api';

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Fetch initial alerts from backend
    fetchAlerts();

    // Connect to backend Socket.IO
    const socket = io('http://172.17.222.130:5000'); // Replace with your backend IP and port

    socket.on('connect', () => {
      console.log('Connected to alert server via Socket.IO');
    });

    // Listen for new alerts
    socket.on('new_alert', (data) => {
      setAlerts((prevAlerts) => [data, ...prevAlerts]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await api.get('/alerts');
      setAlerts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Emergency Alerts</Text>
      <FlatList
        data={alerts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.alertItem}>
            <Text style={styles.alertType}>{item.type.toUpperCase()}</Text>
            <Text>{item.message}</Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No alerts yet</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f7f7f7' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 16, alignSelf: 'center' },
  alertItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#ccc', marginBottom: 8, backgroundColor: '#fff', borderRadius: 8 },
  alertType: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  timestamp: { fontSize: 12, color: '#888', marginTop: 4 }
});
