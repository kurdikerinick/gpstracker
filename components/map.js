import React, { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';

export default function MapComponent() {
  const [coordinates, setCoordinates] = useState(null);

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const response = await fetch('https://gpstracking-c79db-default-rtdb.firebaseio.com/.json');
        const { lat, lng } = await response.json();
        if (lat !== undefined && lng !== undefined) {
          setCoordinates({
            latitude: lat,
            longitude: lng,
          });
        }
      } catch (error) {
        console.error('Error fetching coordinates:', error);
      }
    };

    fetchCoordinates();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: coordinates ? coordinates.latitude : 0,
          longitude: coordinates ? coordinates.longitude : 0,
          latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
        }}
        
      >
        {coordinates && (
         <Marker
         coordinate={{
           latitude: coordinates ? coordinates.latitude : 0,
           longitude: coordinates ? coordinates.longitude : 0,
         }}
         title="Location"
         description={`Latitude: ${coordinates ? coordinates.latitude : 0}, Longitude: ${coordinates ? coordinates.longitude : 0}`}
       />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
