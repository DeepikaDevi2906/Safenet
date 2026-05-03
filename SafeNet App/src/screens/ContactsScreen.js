import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Alert 
} from 'react-native';
import api from '../services/api'; 
import { useAuth } from '../context/AuthContext'; // Import to get dynamic userId

export default function ContactsScreen({ navigation }) {
  // Use the logged-in user ID from context
  const { userId } = useAuth(); 
  
  // NOTE: If userId is null, we shouldn't proceed, but we'll assume auth ensures a value
  // Convert userId to a number if your backend expects it that way, but often a string is fine
  const currentUserId = userId || 1; // Fallback for testing, but should be handled by Auth

  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({ name: '', phone: '' });
  const [editingContactId, setEditingContactId] = useState(null); 
  const [currentContact, setCurrentContact] = useState({ name: '', phone: '' }); 

  useEffect(() => {
    // Only fetch contacts if a userId is available
    if (currentUserId) {
      fetchContacts();
    }
  }, [currentUserId]);

  // Fetch contacts from backend
  const fetchContacts = async () => {
    try {
      const response = await api.get(`/contacts/${currentUserId}`);
      setContacts(response.data);
    } catch (error) {
      console.error("Error fetching contacts:", error.response?.data || error.message);
      Alert.alert('Error', 'Failed to load contacts. Please check your backend server.');
    }
  };

  // Add new contact
  const addContact = async () => {
    if (!newContact.name || !newContact.phone) {
      Alert.alert('Error', 'Name and phone are required');
      return;
    }
    try {
      // 💥 FIX: Correct endpoint for POST method is /contacts/{userId} 💥
      const response = await api.post(`/contacts/${currentUserId}`, newContact); 
      
      setNewContact({ name: '', phone: '' });
      fetchContacts();
      Alert.alert("Success", response.data.message || 'Contact added.');
    } catch (error) {
      console.error("Error adding contact:", error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.error || 'Failed to add contact.');
    }
  };

  // Delete contact
  const deleteContact = async (contactId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this contact?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              // Correct endpoint for DELETE method: /contacts/{userId}/{contactId}
              await api.delete(`/contacts/${currentUserId}/${contactId}`); 
              fetchContacts();
            } catch (error) {
              console.error("Error deleting contact:", error.response?.data || error.message);
              Alert.alert('Error', 'Failed to delete contact.');
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  // Start editing a contact
  const startEditContact = (contact) => {
    setEditingContactId(contact.id);
    setCurrentContact({ name: contact.name, phone: contact.phone });
  };

  // Save edited contact
  const saveEditContact = async (contactId) => {
    if (!currentContact.name || !currentContact.phone) {
      Alert.alert('Error', 'Name and phone are required');
      return;
    }
    try {
      // Correct endpoint for PUT method: /contacts/{userId}/{contactId}
      await api.put(`/contacts/${currentUserId}/${contactId}`, currentContact); 
      setEditingContactId(null); 
      setCurrentContact({ name: '', phone: '' });
      fetchContacts();
    } catch (error) {
      console.error("Error saving contact:", error.response?.data || error.message);
      Alert.alert('Error', 'Failed to save contact.');
    }
  };

  // Render each contact card
  const renderContact = ({ item }) => (
    <View style={styles.card}>
      {editingContactId === item.id ? (
        // Edit mode
        <View>
          <TextInput
            style={styles.editInput}
            value={currentContact.name}
            onChangeText={(text) => setCurrentContact({ ...currentContact, name: text })}
            placeholder="Name"
          />
          <TextInput
            style={styles.editInput}
            value={currentContact.phone}
            onChangeText={(text) => setCurrentContact({ ...currentContact, phone: text })}
            placeholder="Phone"
            keyboardType="phone-pad"
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.saveButton]} 
              onPress={() => saveEditContact(item.id)}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.cancelButton]} 
              onPress={() => setEditingContactId(null)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // Display mode
        <View>
          <Text style={styles.contactName}>{item.name}</Text>
          <Text style={styles.contactPhone}>{item.phone}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.editButton]} 
              onPress={() => startEditContact(item)}
            >
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.deleteButton]} 
              onPress={() => deleteContact(item.id)}
            >
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Add New Contact</Text>
      <TextInput
        placeholder="Name"
        value={newContact.name}
        onChangeText={(text) => setNewContact({ ...newContact, name: text })}
        style={styles.input}
      />
      <TextInput
        placeholder="Phone"
        value={newContact.phone}
        onChangeText={(text) => setNewContact({ ...newContact, phone: text })}
        style={styles.input}
        keyboardType="phone-pad"
      />
      <TouchableOpacity style={styles.addButton} onPress={addContact}>
        <Text style={styles.addButtonText}>Add Contact</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Emergency Contacts</Text>

      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id?.toString() || new Date().getTime().toString()} // Added safety check for key
        renderItem={renderContact}
        style={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>No emergency contacts added yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f0f4f7' },
  title: { fontSize: 28, fontWeight: 'bold', alignSelf: 'center', marginBottom: 20, color: '#333' },
  list: { marginBottom: 20 },
  card: { 
    backgroundColor: '#4da6ff', 
    padding: 20, 
    borderRadius: 12, 
    marginBottom: 15, 
    shadowColor: '#000', 
    shadowOpacity: 0.2, 
    shadowRadius: 4, 
    elevation: 3 
  },
  contactName: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  contactPhone: { fontSize: 16, color: '#fff', marginTop: 5, marginBottom: 10 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    padding: 10, 
    marginBottom: 10, 
    borderRadius: 8, 
    backgroundColor: '#fff' 
  },
  addButton: { 
    backgroundColor: '#ff8c00', 
    padding: 15, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginBottom: 20 
  },
  addButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end', 
    marginTop: 10,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginLeft: 10, 
  },
  editButton: {
    backgroundColor: '#fdd835', 
  },
  deleteButton: {
    backgroundColor: '#e53935', 
  },
  saveButton: {
    backgroundColor: '#28a745', 
  },
  cancelButton: {
    backgroundColor: '#777', 
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  editInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 8,
    borderRadius: 5,
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#7f8c8d'
  }
});