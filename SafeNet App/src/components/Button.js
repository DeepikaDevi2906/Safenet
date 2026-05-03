import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

export default function Button({title, onPress}) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {backgroundColor: '#6200EE', padding: 12, borderRadius: 8, alignItems: 'center'},
  text: {color: '#fff', fontWeight: 'bold', fontSize: 16},
});
