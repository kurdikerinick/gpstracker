import React, { useEffect, useState } from 'react';
import { View, StyleSheet,Alert , Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { getDatabase, ref, get } from 'firebase/database';
import { db } from '../firebase'; // Import your Firebase configuration
import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function MapComponent({ route }) {
  const { routeName } = route.params;
  const [routeData, setRouteData] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchRouteData = async () => {
      try {
        const dbRef = ref(getDatabase());
        const routeRef = ref(db, `routes/${routeName}`);
        const snapshot = await get(routeRef);

        if (snapshot.exists()) {
          setRouteData(snapshot.val());
        } else {
          console.warn(`Route '${routeName}' not found`);
        }
      } catch (error) {
        console.error('Error fetching route data:', error);
      }
    };

    fetchRouteData();
  }, [routeName]);

  useEffect(() => {
    const registerForPushNotificationsAsync = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
      
        if (status !== 'granted') {
          console.warn('Location permission not granted!');
          return;
        }
      
        const projectId =
          Constants?.expoConfig?.extra?.eas?.projectId ??
          Constants?.easConfig?.projectId;
      
        if (!projectId) {
          throw new Error('Project ID not found');
        }
      
        const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
        console.log('Expo Push Token:', tokenData.data);
      } catch (error) {
        console.error('Error getting Expo push token:', error);
      }
    };

    registerForPushNotificationsAsync();

    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      const { title, body } = notification.request.content;
      console.log('Notification received:', { title, body });
      setNotifications(prevNotifications => [...prevNotifications, { title, body }]);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
    };
  }, []);

  const sendNotification = async (title, body) => {
    try {
      const expoPushToken = await Notifications.getExpoPushTokenAsync();
      const message = {
        to: expoPushToken.data,
        sound: 'default',
        title,
        body,
        data: { someData: 'goes here' },
      };
  
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });
  
      const data = await response.json();
      console.log('Notification sent successfully:', data);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  
    // Display an alert notification
    Alert.alert(title, body);
  };
  return (
    <View style={styles.container}>
      {routeData && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 15.3527,
            longitude: 75.1266,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
        >
          {routeData.points && Object.entries(routeData.points).map(([pointKey, point], index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: point.latitude,
                longitude: point.longitude,
              }}
              title={point.address}
              onPress={() => {
                sendNotification('Bus Notification', `The bus has reached ${point.pointName}`);
              }}
            />
          ))}
        </MapView>
      )}
      <View style={styles.notificationContainer}>
        {notifications.map((notification, index) => (
          <Text key={index}>{notification.title}: {notification.body}</Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  notificationContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
});
