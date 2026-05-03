import React from 'react';
import {View, Text, Button} from 'react-native';

export default function DashboardScreen({route, navigation}) {
  const {user} = route.params;

  return (
    <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
      <Text>Welcome, {user.name}!</Text>
      <Button title="Go to Map" onPress={() => navigation.navigate('SafeRegionMap')} />
    </View>
  );
}
