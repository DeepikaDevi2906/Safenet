import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, PermissionsAndroid, Alert, TouchableOpacity } from 'react-native';

export default function SettingsScreen() {
    const [cameraEnabled, setCameraEnabled] = useState(false);
    const [micEnabled, setMicEnabled] = useState(false);

    // --- Core function to request Android permissions ---
    const requestPermission = async (permissionType, featureName, setToggleState) => {
        try {
            const granted = await PermissionsAndroid.request(
                permissionType,
                {
                    title: `${featureName} Monitoring Permission`,
                    message: `SafeNet needs ${featureName} access to detect threats.`,
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'Grant Access',
                }
            );
            
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                // Permission granted. Log success, enable toggle.
                setToggleState(true);
                Alert.alert("Activated", `${featureName} Monitoring is ON.`);
                // NOTE: Actual AI stream start function would go here.
            } else {
                // Permission denied. Toggle should remain off.
                setToggleState(false); 
                Alert.alert("Denied", `${featureName} Monitoring cannot start.`);
            }
        } catch (err) {
            console.warn(err);
            setToggleState(false);
        }
    };

    // --- Toggle Handlers ---
    const toggleCameraMonitoring = (value) => {
        // If the user turns the switch ON
        if (value) {
            requestPermission(
                PermissionsAndroid.PERMISSIONS.CAMERA, 
                'Camera', 
                setCameraEnabled
            );
        } else {
            // User turned the switch OFF
            setCameraEnabled(false); 
            Alert.alert("Deactivated", "Camera Monitoring is now OFF.");
        }
    };

    const toggleMicMonitoring = (value) => {
        // If the user turns the switch ON
        if (value) {
            requestPermission(
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, 
                'Microphone', 
                setMicEnabled
            );
        } else {
            // User turned the switch OFF
            setMicEnabled(false);
            Alert.alert("Deactivated", "Microphone Monitoring is now OFF.");
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Settings & AI Monitoring</Text>

            {/* Camera Monitoring Row */}
            <View style={styles.card}>
              <Text style={styles.featureText}>Camera Monitoring</Text>
              <Switch
                  onValueChange={toggleCameraMonitoring}
                  value={cameraEnabled}
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={cameraEnabled ? "#4da6ff" : "#f4f3f4"}
              />
            </View>

            {/* Microphone Monitoring Row */}
            <View style={styles.card}>
                <Text style={styles.featureText}>Microphone Monitoring</Text>
                <Switch
                    onValueChange={toggleMicMonitoring}
                    value={micEnabled}
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={micEnabled ? "#4da6ff" : "#f4f3f4"}
                />
            </View>
            
            {/* Status Display */}
            <View style={styles.statusCard}>
              <Text style={styles.statusText}>
                Status: Monitoring {cameraEnabled || micEnabled ? 'ON' : 'Off'}
              </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 25, backgroundColor: '#f9f9f9' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, color: '#2c3e50' },
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    featureText: { fontSize: 18, color: '#34495e' },
    statusCard: {
        backgroundColor: '#e6f7ff',
        padding: 20,
        borderRadius: 12,
        marginTop: 20,
        alignItems: 'center',
    },
    statusText: { 
      fontSize: 18, 
      fontWeight: 'bold', 
      color: '#3498db' 
    },
});