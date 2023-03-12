import React, { useState, useEffect } from 'react';
import { Dimensions, StyleSheet, View, Text, Animated } from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Location from 'expo-location';
import { ScrollView } from 'react-native-gesture-handler';


export default function App() {
  const [station, setStation] = useState([]);
  const [caStation, setCaStation] = useState([]);
  const [location, setLocation] = useState(null);
  const [pin, setPin] = useState({latitude: 37.78825, longitude: -122.4324});
  const [region, setRegion] = useState({
    latitude: 37.78825, 
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421
  });
  const fetchStation = async () => {
    const response = await fetch(
     'https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations.json?type=tidepredictions&units=english'
    );
    const data = await response.json();
      setStation(data.stations);
  }

  useEffect(() => {
    const getPermissions = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log("Please grant location permissions");
        return;
      }
  
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    };
    getPermissions();
  }, [])
  fetchStation();
  let currentLat = 0
  let currentLng = 0

  if (location) {
    currentLat = location.coords.latitude
    currentLng = location.coords.longitude
  }

  return (
      <View style={{ marginTop: 50, flex: 1 }}>
        <GooglePlacesAutocomplete
          placeholder='Search'
          fetchDetails={true}
          GooglePlacesSearchQuery={{
            rankby: "distance"
          }}
          onPress={(data, details = null) => {
            // 'details' is provided when fetchDetails = true
            console.log(data, details);
            setRegion({
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421
            });
          }}
          query={{
            key: 'AIzaSyCtlqDstZqTuGiimjz5bOggecVpbILC5Ko',
            language: 'en',
            components: "country:us",
            types: "establishment",
            radius: 30000,
            location: `${currentLat}, ${currentLng}`
          }}
          styles={{
            container: { flex: 0, position: "absolute", width: "100%", zIndex: 1 },
            listView: { backgroundColor: "white" }
          }}
        ></GooglePlacesAutocomplete>
      <MapView
        style={styles.map} 
        region={{
          latitude: currentLat,
          longitude: currentLng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        provider="google"
      >
        <Marker coordinate={{
          latitude: region.latitude, 
          longitude: region.longitude}}
        ></Marker>
        <Marker
          coordinate={pin}
          pinColor="blue"
          draggable={true}
          onDragStart={(e) => {
            console.log("Drag start", e.nativeEvent.coordinates)
          }}
          onDragEnd={(e) => {
            setPin({
              latitude: e.nativeEvent.coordinate.latitude,
              longitude: e.nativeEvent.coordinate.longitude
            })
          }}
        >
          <Callout>
            <Text>I'm here</Text>
          </Callout>
        </Marker>
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  }
});