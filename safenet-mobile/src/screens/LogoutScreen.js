import React, { useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LogoutScreen({ navigation }) {

  useEffect(() => {
    const logout = async () => {

      await AsyncStorage.removeItem("token");

      await AsyncStorage.removeItem("username");

      navigation.reset({
        index: 0,
        routes: [
          {
            name: "Landing",
          },
        ],
      });
    };

    logout();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator
        size="large"
        color="#1E3A8A"
      />

      <Text
        style={{
          marginTop: 20,
          fontSize: 18,
        }}
      >
        Logging Out...
      </Text>
    </View>
  );
}