import React, { useState } from 'react';
import { View, TextInput, Pressable, Alert, Text } from 'react-native';
import { ref, push, set } from 'firebase/database';
import { db } from '../firebase';// Assuming firebase.js is where you initialize Firebase

export default function SaveLocationScreen() {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [address, setAddress] = useState('');

  const saveLocationToFirebase = () => {
    const locationsRef = ref(db, 'locations'); // Use the Firebase database instance from firebase.js

    const newLocationKey = push(locationsRef).key;
    const locationData = {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      address: address,
    };

    set(ref(db, `locations/${newLocationKey}`), locationData)
      .then(() => {
        Alert.alert('Success', 'Location saved successfully!');
        console.log("saved")
      })
      .catch((error) => {
        Alert.alert('Error', 'Failed to save location: ' + error.message);
        console.log("error")
      });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TextInput
        placeholder="Latitude"
        value={latitude}
        onChangeText={setLatitude}
        keyboardType="numeric"
        style={{ marginBottom: 10, padding: 10, borderWidth: 1 }}
      />
      <TextInput
        placeholder="Longitude"
        value={longitude}
        onChangeText={setLongitude}
        keyboardType="numeric"
        style={{ marginBottom: 10, padding: 10, borderWidth: 1 }}
      />
      <TextInput
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
        style={{ marginBottom: 10, padding: 10, borderWidth: 1 }}
      />
      <Pressable onPress={saveLocationToFirebase}>
        <Text>Save Location</Text>
      </Pressable>
    </View>
  );
}
