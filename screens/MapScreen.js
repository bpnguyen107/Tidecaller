import React, { useState, useEffect, useRef } from 'react';
import { Dimensions, StyleSheet, View, Text, Animated, Modal, Button, TouchableOpacity, Touchable } from 'react-native';
import MapView, { Callout, Marker, CalloutSubview } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Location from 'expo-location';
import { distance } from '../screens/HomeScreen.js'
import { MaterialIcons } from '@expo/vector-icons'; 
import { FontAwesome } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import { set } from 'react-native-reanimated';
import { FontAwesomeIcon } from '@expo/vector-icons';

export default function App() {
  const mapRef = useRef(null);
  const [favSet, setFavSet] = useState(false);
  const [station, setStation] = useState([]);
  const [nearby, setNearby] = useState({
    state: "",
    tidepredoffsets:{
      self: ""
    }, 
    type: "",
    timemeridian: 0,
    reference_id: 0,
    timezonecorr: 0,
    id: "",
    name: "",
    lat: 0,
    lng: 0,
    affiliations: "",
    portscode: "",
    products: null,
    disclaimers: null,
    notices: null,
    self: null,
    expand: null,
    tideType: ""
  });
  const [location, setLocation] = useState(null);
  const [markerCoords, setMarkerCoords] = useState(null);
  const [pin, setPin] = useState({ latitude: 37.78825, longitude: -122.4324 });
  const [region, setRegion] = useState({
    latitude: 34.06935,
    longitude: -118.44468,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421
  });
  
  const fetchStation = async() => {
    const response = await fetch('https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations.json?type=tidepredictions&units=english');
    const data = await response.json();
    const stations = data.stations;
    setStation(stations);
  }

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
    markerPressed(closest);
  }

  function calcNearbyArray(latitude, longitude){
    const lat = latitude;
    const lng = longitude;
    var distances = new Map();

    for (let i = 0; i < station.length; i++) {
      stationDistance = distance(station[i].lat, station[i].lng, lat, lng)
      distances.set(stationDistance, i);
    }
    distances = new Map([...distances.entries()].sort((a, b) => a[0] - b[0]));
    let tenClosestIndex = [];
    let counter = 0;
    for (let [key, value] of distances) {
      if (counter === 10){
        break;
      }
      tenClosestIndex.push(value);
      counter++;
    }

    var names = [];
    for (let i = 0; i < tenClosestIndex.length; i++){
      names.push({
        number: tenClosestIndex[i],
        description: station[tenClosestIndex[i]].name,
        geometry: { location: { lat: station[tenClosestIndex[i]].lat, lng: station[tenClosestIndex[i]].lng } }
      });
    }
    return names;
  }

  const favoriteSet = (e) => {
    setFavSet(e);
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

  const markerPressed = (e) => {
    const goToPoint = {
      longitude: e.lng,
      latitude: e.lat,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02
    };

      setRegion({
        latitude: e.lat,
        longitude: e.lng,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02
      })
      mapRef.current.animateToRegion(goToPoint, 500);
  };

  const markPressed = (m) => {
    const goToPoint = {
        longitude: region.longitude,
        latitude: region.latitude,
        latitudeDelta: 0.046,
        longitudeDelta: 0.046,
    };
    if (m.marker === 'marker-press') {
        goToPoint.longitude = m.coordinate.longitude;
        goToPoint.latitude = m.coordinate.latitude;
        goToPoint.latitudeDelta = 0.02;
        goToPoint.longitudeDelta = 0.02;
        setMarkerCoords({
          longitude: m.coordinate.longitude,
          latitude: m.coordinate.latitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        })
    }
    else if (m.marker === "marker-inside-overlay-press"){
      goToPoint.longitude = markerCoords.longitude;
      goToPoint.latitude = markerCoords.latitude;
      goToPoint.latitudeDelta = markerCoords.latitudeDelta;
      goToPoint.longitudeDelta = markerCoords.longitudeDelta;
    }
    //console.log(m.marker);
    //@ts-ignore
    mapRef.current.animateToRegion(goToPoint, 500);
};

  let currentLat = 0
  let currentLng = 0
  let stationInfo = [];
  if (location) {
    currentLat = location.coords.latitude;
    currentLng = location.coords.longitude;
    stationInfo = calcNearbyArray(currentLat, currentLng);
  }

  //console.log(region);

  return (
  <View>
    <View style={{ marginTop: 1, flex: 1 }}>
      <GooglePlacesAutocomplete
        placeholder='Search'
        fetchDetails={true}
        GooglePlacesSearchQuery={{
          rankby: "distance"
        }}
        onPress={(data, details) => {
          // 'details' is provided when fetchDetails = true
          //console.log(data, details);
          setRegion({
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          });
          calcNearby(details.geometry.location.lat, details.geometry.location.lng);
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
        ref={mapRef}
        onPress={(e) =>
          markPressed({
            coordinate: e.nativeEvent.coordinate,
            marker: e.nativeEvent.action,
          })
        }>
        <Marker coordinate={{
          //region instead of nearby
          latitude: nearby.lat,
          longitude: nearby.lng
        }}
        >
          <Callout tooltip>
            <View>
              <View style={styles.bubble}>
                <Text style={styles.name}> {nearby.name} </Text>
                <CalloutSubview
                  //style={styles.}
                  onPress={() => {
                    favoriteSet(!favSet);
                    console.log('onPress Clicked')
                  }}
                style = {[styles.name, { backgroundColor: favSet===false ? "#fff" : "#113c74"}]}>
                  <Text style={styles.name}> Button </Text>
                </CalloutSubview>
              </View>
              <View style={styles.arrowBorder}/>
              <View style={styles.arrow}/>
            </View>
          </Callout>
        </Marker>
        <Marker coordinate={{
          //region instead of nearby
          latitude: currentLat,
          longitude: currentLng
        }}>
          <View>
            <MaterialIcons name="location-history" size={40} color="#1c4152" />
          </View>
        </Marker>
      </MapView>
    </View>

        <View style={styles.favoritedTextBar}>
          <Text style={styles.favoritedText}> 
          
          {nearby.name} 
      
          </Text>
          <TouchableOpacity style={styles.favoriteButton}>
            <Text>
            FAV
            </Text>
          </TouchableOpacity>
        </View>

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
    ...StyleSheet.absoluteFillObject,
    height: 725,
    //width: Dimensions.get("window").width,
    //height: Dimensions.get("window").height
  },
  bubble: {
   flexDirection: "row",
   alignSelf: 'flex-start',
   backgroundColor: "#fff",
   borderRadius: 6,
   borderColor: "#ccc",
   borderWidth: 0.5,
   padding: 5,
   width: 300, 
  },
  name: {
    fontSize: 15,
    marginBottom: 5
  },
  arrow: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderTopColor: '#fff',
    borderWidth: 16,
    alignSelf: 'center',
    marginTop: -32,
  },
  arrowBorder: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderTopColor: '#007a87',
    borderWidth: 16,
    alignSelf: 'center',
    marginTop: -0.5,
  },
  favButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
  },
  favoritedText: {
    display: 'flex',
  },
  favoritedTextBar: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 750,
  },
  favoriteButton: {
    marginLeft: 5,
  }
});