import React, {
  useState,
  useEffect
} from "react";

import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert
} from "react-native";

import * as Location from "expo-location";

import MapView, {
  Marker
} from "react-native-maps";

export default function TrackingScreen() {

  const [tracking, setTracking] =
    useState(false);

  const [latitude, setLatitude] =
    useState(null);

  const [longitude, setLongitude] =
    useState(null);

  const [lastUpdated, setLastUpdated] =
    useState("");

  useEffect(() => {

    let interval;

    if (tracking) {

      interval = setInterval(
        async () => {

          try {

            const location =
              await Location.getCurrentPositionAsync({});

            setLatitude(
              location.coords.latitude
            );

            setLongitude(
              location.coords.longitude
            );

            setLastUpdated(
              new Date().toLocaleTimeString()
            );

            console.log(
              "📍 Location Updated"
            );

          } catch (error) {

            console.log(error);

          }

        },
        10000
      );

    }

    return () => {

      if (interval) {
        clearInterval(interval);
      }

    };

  }, [tracking]);

  const startTracking =
    async () => {

      try {

        const { status } =
          await Location.requestForegroundPermissionsAsync();

        if (
          status !== "granted"
        ) {

          Alert.alert(
            "Permission Denied"
          );

          return;

        }

        const location =
          await Location.getCurrentPositionAsync({});

        setLatitude(
          location.coords.latitude
        );

        setLongitude(
          location.coords.longitude
        );

        setLastUpdated(
          new Date().toLocaleTimeString()
        );

        setTracking(true);

      } catch (error) {

        console.log(error);

      }

    };

  const stopTracking = () => {

    setTracking(false);

  };

  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        📍 Live Tracking
      </Text>

      {

        latitude &&
        longitude && (

          
          <MapView
  style={styles.map}
  initialRegion={{
    latitude: latitude || 13.0325922,
    longitude: longitude || 80.1545431,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01
  }}
  showsUserLocation={true}
  showsMyLocationButton={true}
  loadingEnabled={true}
>

  {
    latitude !== null &&
    longitude !== null && (

      <Marker
        coordinate={{
          latitude: latitude,
          longitude: longitude
        }}
        title="You Are Here"
        description="Current Location"
      />

    )
  }

</MapView>

        )

      }

      <View style={styles.card}>

        <Text style={styles.status}>

          {
            tracking
              ? "🟢 Tracking Active"
              : "🔴 Tracking Stopped"
          }

        </Text>

        <Text style={styles.text}>
          Latitude:
          {" "}
          {latitude || "--"}
        </Text>

        <Text style={styles.text}>
          Longitude:
          {" "}
          {longitude || "--"}
        </Text>

        <Text style={styles.text}>
          Last Updated:
          {" "}
          {lastUpdated || "--"}
        </Text>

      </View>

      {

        !tracking ?

          (

            <Pressable
              style={styles.startBtn}
              onPress={startTracking}
            >

              <Text style={styles.btnText}>
                Start Tracking
              </Text>

            </Pressable>

          )

          :

          (

            <Pressable
              style={styles.stopBtn}
              onPress={stopTracking}
            >

              <Text style={styles.btnText}>
                Stop Tracking
              </Text>

            </Pressable>

          )

      }

    </View>

  );

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    padding: 20,
    paddingTop: 50
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20
  },

  map: {
    width: "100%",
    height: 300,
    borderRadius: 15,
    marginBottom: 20
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 15,
    elevation: 4,
    marginBottom: 20
  },

  status: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15
  },

  text: {
    fontSize: 16,
    marginBottom: 8
  },

  startBtn: {
    backgroundColor: "#16A34A",
    padding: 18,
    borderRadius: 12
  },

  stopBtn: {
    backgroundColor: "#DC2626",
    padding: 18,
    borderRadius: 12
  },

  btnText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16
  }

});