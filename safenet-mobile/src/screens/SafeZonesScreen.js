import React,
{
  useEffect,
  useState
} from "react";

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Linking,
  StyleSheet
} from "react-native";

import * as Location
from "expo-location";

import {
  getDistance
}
from "geolib";

export default function SafeZonesScreen() {

  const [zones, setZones] =
    useState([]);

  const [userLocation,
    setUserLocation] =
    useState(null);

  useEffect(() => {

    loadLocation();

    fetch(
      "http://10.232.31.135:8000/safezones"
    )
      .then((res) =>
        res.json()
      )
      .then((data) => {

        setZones(data);

      });

  }, []);

  const loadLocation =
    async () => {

      const {
        status
      } =
      await Location
        .requestForegroundPermissionsAsync();

      if (
        status !== "granted"
      ) {
        return;
      }

      const location =
        await Location
          .getCurrentPositionAsync({});

      setUserLocation({
        latitude:
          location.coords.latitude,

        longitude:
          location.coords.longitude
      });

    };

  const openMaps =
    (lat, lng) => {

      Linking.openURL(

        `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`

      );

    };

  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        Safe Zones
      </Text>

      <FlatList
        data={zones}
        keyExtractor={(item) =>
          item.id.toString()
        }
        renderItem={({ item }) => {

          let distance =
            "Calculating...";

          if (
            userLocation
          ) {

            const meters =
              getDistance(

                userLocation,

                {
                  latitude:
                    item.latitude,

                  longitude:
                    item.longitude
                }

              );

            distance =
              (
                meters / 1000
              ).toFixed(1)
              + " km away";
          }

          return (

            <View
              style={styles.card}
            >

              <Text
                style={styles.name}
              >

                {
                  item.type ===
                  "Hospital"
                    ? "🏥"
                    : item.type ===
                      "Police"
                    ? "👮"
                    : "🛡"
                }

                {" "}
                {item.name}

              </Text>

              <Text
                style={styles.distance}
              >
                📍 {distance}
              </Text>

              <TouchableOpacity

                style={
                  styles.button
                }

                onPress={() =>
                  openMaps(
                    item.latitude,
                    item.longitude
                  )
                }

              >

                <Text
                  style={
                    styles.buttonText
                  }
                >
                  Open Maps
                </Text>

              </TouchableOpacity>

            </View>

          );
        }}
      />

    </View>

  );
}

const styles =
StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor:
      "#020617",
    padding: 20
  },

  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20
  },

  card: {
    backgroundColor:
      "#0f172a",

    padding: 20,

    borderRadius: 16,

    marginBottom: 15
  },

  name: {
    color: "white",

    fontSize: 18,

    fontWeight: "bold"
  },

  distance: {
    color: "#94a3b8",

    marginTop: 10,

    marginBottom: 15
  },

  button: {

    backgroundColor:
      "#2563eb",

    padding: 12,

    borderRadius: 10,

    alignItems:
      "center"
  },

  buttonText: {
    color: "white",
    fontWeight: "bold"
  }

});