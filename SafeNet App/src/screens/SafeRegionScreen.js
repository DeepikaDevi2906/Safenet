import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SafeRegionScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Safe Region</Text>
            <Text style={styles.subtitle}>
                Here you can show the safe area on a map or let users set geofences.
            </Text>
            
            {/* Display a controlled black box to meet the visual requirement */}
            <View style={styles.blackBox} />
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f9f9f9', alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', marginVertical: 10 },
    subtitle: { fontSize: 16, textAlign: 'center', paddingHorizontal: 10, marginBottom: 20 },
    blackBox: {
        width: '100%',
        height: '70%',
        backgroundColor: 'black', // The requested black box visual
        borderWidth: 1,
        borderColor: '#ccc'
    }
});