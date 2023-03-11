import React, { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Text } from 'react-native';

const MapScreen = ({ navigation }) => {

  const [loc, setLoc] = useState(null);

  useEffect(() => {
    console.log('something');
    const requestPermissions = async () => {
        const foreground = await Location.requestForegroundPermissionsAsync();
        if (foreground.granted) {
            const { granted } = await Location.getForegroundPermissionsAsync();
            if (!granted){
              console.log('Tracking Denied');
              return;
            }
        const position = await Location.watchPositionAsync(
            {
                // For better logs, we set the accuracy to the most sensitive option
                accuracy: Location.Accuracy.BestForNavigation,
            },
            (location) => {
              console.log('location null');
              setLoc(location);
            }
          );
        }
    };

    requestPermissions();

  }, []);

  let latitude_real = 0;
  let longitude_real = 0;
  if (loc !== null) {
      latitude_real = loc.coords.latitude;
      longitude_real = loc.coords.longitude;
  } else {
      //loading view
  }
  console.log(latitude_real);
  return (
    <View style={styles.container}>
      <MapView
      style={styles.map}
      region={{
        latitude: latitude_real,
        longitude: longitude_real,
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