import React, { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Text } from 'react-native';

const MapScreen = ({ navigation }) => {
  /*
  const [position, setPosition] = useState<Location.LocationObject | null>(null);

  useEffect(() => {
    const requestPermissions = async () => {
        const foreground = await Location.requestForegroundPermissionsAsync();
        if (foreground.granted) {
            const { granted } = await Location.getForegroundPermissionsAsync();
            if (!granted) {
                console.log('location tracking denied');
                return;
            }
            const foregroundSubscription = await Location.watchPositionAsync(
                {
                    // For better logs, we set the accuracy to the most sensitive option
                    accuracy: Location.Accuracy.BestForNavigation,
                },
                (location) => {
                    if (location !== null) {
                        setPosition(location);
                    }
                }
            );
        }
    };
    requestPermissions();
}, []); */


  return (
    <View style={styles.container}>
      <MapView
      style={styles.map}
      region={{
        latitude: 34.06935,
        longitude: -118.44468,
        latitudeDelta: 0.020,
        longitudeDelta: 0.020,
      }}
    />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  }
});

export default MapScreen;