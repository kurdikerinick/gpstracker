// App.js

import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapComponent from './components/map';

export default function App() {
    return (
      <View style={styles.container}>
        <MapComponent />
      </View>
    );
  }


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
