import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import api from '../services/api';
// Assuming you have imported and configured useAuth
import { useAuth } from '../context/AuthContext'; 

export default function HomeScreen({ navigation }) {
    // --- Get dynamic user ID from AuthContext ---
    const { userId } = useAuth(); 
    const currentUserId = userId || 1; // Fallback only if AuthContext is not fully set up
    const userName = "User " + currentUserId; 

    // --- FUNCTION 1: Request Android Permissions ---
    const requestLocationPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: "SafeNet Location Permission",
                    message: "SafeNet needs access to your location for SOS alerts.",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
            console.warn(err);
            return false;
        }
    };

    // --- FUNCTION 2: Fallback for API Call without GPS Fix ---
    const sendBasicSOS = async () => {
        try {
            const sosData = {
                user_id: currentUserId,
                user_name: userName,
                location: 'Unknown (Location Service Unavailable)',
                latitude: null,
                longitude: null,
            };
            // Note: If API call fails here, it should only show an Alert, not crash the app.
            await api.post('/sos', sosData); 
            Alert.alert('Basic SOS Sent', 'Alert sent without accurate location due to device error.');
        } catch (error) {
             Alert.alert('Error', 'Failed to send basic SOS alert');
        }
    }


    // --- FUNCTION 3: Main SOS Trigger ---
    const sendSOS = async () => {
        const permissionGranted = await requestLocationPermission();
        
        // CRITICAL CHECK: If permission is denied, stop here.
        if (!permissionGranted) {
            Alert.alert('Permission Denied', 'Cannot send SOS without location access.');
            return;
        }

        // Use a flag to prevent the error handler from firing multiple times
        let locationAttempted = true;

        // Step 2: Get Location
        Geolocation.getCurrentPosition(
            async (position) => {
                // Success Path: Location is acquired
                if (!position || !position.coords) {
                     // Should not happen if permission is granted, but check prevents hard crash
                     sendBasicSOS(); 
                     return;
                }

                locationAttempted = false; // Mark success
                const { latitude, longitude } = position.coords;
                
                // Step 3 & 4: Send Rich Payload to Backend
                try {
                    const sosData = {
                        user_id: currentUserId,
                        user_name: userName,
                        latitude: latitude,
                        longitude: longitude,
                        location: `Lat: ${latitude}, Lon: ${longitude}`, 
                    };
                    await api.post('/sos', sosData);
                    
                    Alert.alert(
                        'SOS Sent!', 
                        `Alert sent successfully for ${userName} from location:\nLat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`
                    );
                } catch (error) {
                    console.error("SOS API Error:", error.response?.data || error.message);
                    Alert.alert('Error', 'Failed to send SOS alert to server.');
                }
            },
            (error) => {
                // Error Path: GPS Timeout, services disabled, etc.
                console.error("Geolocation Error Code:", error.code);
                
                // CRITICAL: Call fallback only if the successful path hasn't fired.
                if (locationAttempted) {
                     sendBasicSOS(); 
                }
            },
            // High timeout ensures we wait long enough before assuming failure
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000 }
        );
    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>SafeNet</Text>

            <TouchableOpacity
                style={[styles.card, { backgroundColor: '#ff9933' }]}
                onPress={() => navigation.navigate('Contacts')}
            >
                <Text style={styles.cardText}>Emergency Contacts</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.card, { backgroundColor: '#ff4d4d' }]}
                onPress={sendSOS} // Calls the enhanced function
            >
                <Text style={styles.cardText}>SOS</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.card, { backgroundColor: '#3399ff' }]}
                onPress={() => navigation.navigate('Settings')}
            >
                <Text style={styles.cardText}>Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.card, { backgroundColor: '#33cc33' }]}
                onPress={() => navigation.navigate('SafeRegion')}
            >
                <Text style={styles.cardText}>Safe Region</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f7f7f7', justifyContent: 'center' },
    title: { fontSize: 32, fontWeight: 'bold', alignSelf: 'center', marginBottom: 40 },
    card: { padding: 30, borderRadius: 16, marginBottom: 20, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 6, elevation: 4 },
    cardText: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
});