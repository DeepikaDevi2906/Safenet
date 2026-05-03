import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';

export default function SOSScreen({ navigation }) {
  const sendSOS = () => {
    Alert.alert('SOS Sent!', 'Your emergency alert has been sent.');
    // Here you can integrate real SOS functionality later
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SOS</Text>
      <Button title="Send SOS" onPress={sendSOS} color="red" />
      <Button title="Back to Home" onPress={() => navigation.navigate('Home')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center', padding:16 },
  title: { fontSize:24, marginBottom:20, fontWeight:'bold' },
});
