// MapScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { getDatabase, ref, get } from 'firebase/database';

const MapScreen = ({ route }) => {
  const { routeName } = route.params;
  console.log(routeName)
  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!routeName) {
      setError('Route name not provided');
      return;
    }

    const fetchRoute = async () => {
      setLoading(true);
      setError(null);
      try {
        const db = getDatabase();
        const routeRef = ref(db, `routes/${routeName}`);
        const snapshot = await get(routeRef);

        if (snapshot.exists()) {
          setRouteData(snapshot.val());
        } else {
          setError(`Route '${routeName}' not found`);
        }
      } catch (error) {
        console.error('Error fetching route:', error);
        setError('Error fetching route data');
      } finally {
        setLoading(false);
      }
    };

    fetchRoute();
  }, [routeName]);

  return (
    <View>
      {loading && <Text>Loading route data...</Text>}
      {error && <Text>Error: {error}</Text>}

      {routeData && (
        <ScrollView>
          <Text>Route: {routeName}</Text>
          <View>
            <Text>Points:</Text>
            {Object.keys(routeData.points).map((pointKey, index) => {
              const point = routeData.points[pointKey];
              return (
                <View key={pointKey}>
                  <Text>
                    <Text style={{ fontWeight: 'bold' }}>Point {index + 1}:</Text>{'\n'}
                    Latitude: {point.latitude}{'\n'}
                    Longitude: {point.longitude}{'\n'}
                    Address: {point.address}{'\n'}
                  </Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default MapScreen;
