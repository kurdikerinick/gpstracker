import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MapComponent from './components/map';
import LoginScreen from './components/loginpage';
import HomeScreen from './components/home';
import MapScreen from './components/savelocations';
const Stack = createNativeStackNavigator();


export default function App() {


  return (


    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Map" component={MapComponent}options={{ headerShown: false }} />
      <Stack.Screen name="Mapscreen" component={MapScreen}options={{ headerShown: false }} />

      </Stack.Navigator>
    </NavigationContainer>

  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
