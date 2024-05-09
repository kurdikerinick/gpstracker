import React, { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import { db } from '../firebase.js';
import { ref, onValue } from 'firebase/database';

export default function MapComponent() {
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const routesRef = ref(db, 'routes');
        onValue(routesRef, (snapshot) => {
          const data = snapshot.val();
          console.log('Fetched routes:', data); 
          if (data) {
            setRoutes(Object.values(data));
          }
        });
      } catch (error) {
        console.error('Error fetching routes:', error);
      }
    };

    fetchRoutes();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 15.3527, // Initial latitude for centering the map
          longitude: 75.1266, // Initial longitude for centering the map
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {routes.map((route, index) => (
          route.points && (
            Object.values(route.points).map((point, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: point.latitude,
                  longitude: point.longitude,
                }}
                title={route.routeName}
                description={point.address}
              />
            ))
          )
        ))}
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
