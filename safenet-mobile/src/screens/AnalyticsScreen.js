import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
  Alert,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../api/api";

export default function ContactsScreen() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [relationship, setRelationship] =
    useState("");

  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const userId =
        await AsyncStorage.getItem(
          "user_id"
        );

      const response =
        await API.get(
          `/contacts/${userId}`
        );

      setContacts(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addContact = async () => {
    try {
      const userId =
        await AsyncStorage.getItem(
          "user_id"
        );

      await API.post("/contacts", {
        user_id: parseInt(userId),
        name,
        phone,
        relationship,
      });

      Alert.alert(
        "Success",
        "Contact Added"
      );

      setName("");
      setPhone("");
      setRelationship("");

      loadContacts();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteContact = async (id) => {
    try {
      await API.delete(
        `/contacts/${id}`
      );

      loadContacts();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Emergency Contacts
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
      />

      <TextInput
        style={styles.input}
        placeholder="Relationship"
        value={relationship}
        onChangeText={
          setRelationship
        }
      />

      <Pressable
        style={styles.addButton}
        onPress={addContact}
      >
        <Text style={styles.buttonText}>
          Add Contact
        </Text>
      </Pressable>

      <FlatList
        data={contacts}
        keyExtractor={(item) =>
          item.id.toString()
        }
        renderItem={({ item }) => (
          <View style={styles.contactCard}>
            <Text style={styles.contactName}>
              👤 {item.name}
            </Text>

            <Text>
              📞 {item.phone}
            </Text>

            <Text>
              ❤️ {item.relationship}
            </Text>

            <Pressable
              style={styles.deleteButton}
              onPress={() =>
                deleteContact(item.id)
              }
            >
              <Text
                style={{
                  color: "white",
                }}
              >
                Delete
              </Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F7FA",
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1E3A8A",
  },

  input: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },

  addButton: {
    backgroundColor: "#1E3A8A",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
  },

  contactCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },

  contactName: {
    fontSize: 18,
    fontWeight: "bold",
  },

  deleteButton: {
    marginTop: 10,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
});