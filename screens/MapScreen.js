import React, { useState, useEffect } from 'react';
import { Dimensions, StyleSheet, View, Text, Animated, Modal, Button, TouchableOpacity } from 'react-native';
import MapView, { Callout, Marker, CalloutSubview } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Location from 'expo-location';
import { distance } from '../screens/HomeScreen.js'
import { ScrollView } from 'react-native-gesture-handler';


export default function App() {
  const [station, setStation] = useState([]);
  const [nearby, setNearby] = useState([]);
  const [location, setLocation] = useState(null);
  const [pin, setPin] = useState({ latitude: 37.78825, longitude: -122.4324 });
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421
  });
  
  const fetchStation = async() => {
    const response = await fetch('https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations.json?type=tidepredictions&units=english');
    const data = await response.json();
    const stations = data.stations;
    setStation(stations);
  }

  function getStationInfo(stationObj){
    var names = [];
    for (let i = 0; i < stationObj.length; i++){
      names.push({
        number: i,
        description: stationObj[i].name,
        geometry: { location: { lat: stationObj[i].lat, lng: stationObj[i].lng } }
      });
    }
    return names;
  }

  // function clickedStation(stationInfoArray){

  // }

  function calcNearby(latitude, longitude){
    const lat = latitude;
    const lng = longitude;

    let closest = station[0]
    let closestDistance = distance(closest.lat, closest.lng, lat, lng);
    for (let i = 1; i < station.length; i++) {
      stationDistance = distance(station[i].lat, station[i].lng, lat, lng)
      if (stationDistance < closestDistance) {
        closestDistance = stationDistance;
        closest = station[i];
      }
    }
    setNearby(closest);
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
    fetchStation();
  }, [])

  let currentLat = 0
  let currentLng = 0
  if (location) {
    currentLat = location.coords.latitude
    currentLng = location.coords.longitude
  }

  let stationInfo = [];
  if (station !== []){
    stationInfo = getStationInfo(station);
  }

  return (
    <View style={{ marginTop: 1, flex: 1 }}>
      <GooglePlacesAutocomplete
        placeholder='Search'
        fetchDetails={true}
        GooglePlacesSearchQuery={{
          rankby: "distance"
        }}
        onPress={(data, details) => {
          console.log("Boob");
          // 'details' is provided when fetchDetails = true
          //console.log(data, details);
          setRegion({
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          });
          // calcNearby(details.geometry.location.lat, details.geometry.location.lng);
        }}
        query={{
          key: 'AIzaSyCtlqDstZqTuGiimjz5bOggecVpbILC5Ko',
          language: 'en',
          radius: 30000,
          location: `${currentLat}, ${currentLng}`
        }}
        predefinedPlaces={stationInfo}
        styles={{
          container: { flex: 0, position: "absolute", width: "100%", zIndex: 1 },
          listView: { backgroundColor: "white" }
        }}
      />
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
          //region instead of nearby
          latitude: nearby.lat,
          longitude: nearby.lng
        }}
        />
        <Marker
          coordinate={pin}
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
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  map: {
    ...StyleSheet.absoluteFillObject
    //width: Dimensions.get("window").width,
    //height: Dimensions.get("window").height
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  container2: {
    backgroundColor: 'black',
    marginTop: 10,
    position: 'absolute',
    alignItems: 'center'
  },
  center:{
    alignItems: 'center',
    position: 'absolute',

  }
});