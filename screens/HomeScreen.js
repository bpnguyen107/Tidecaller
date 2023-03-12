import { StyleSheet, Text, View, Modal, Pressable, FlatList, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';
import { useState, useEffect, useMemo } from 'react';
import { Calendar } from 'react-native-calendars';
import * as Location from 'expo-location';

const Item = ({ hilo, date, height }) => {
  const time = date.slice(-5);

  return (
    <View style={styles.item}>
      <Text style={{ color: 'white', fontSize: 20, flexGrow: 1, textAlign: 'center', fontWeight: 'bold' }}>{(hilo == 'H') ? 'HIGH' : 'LOW'}</Text>
      <View style={styles.innerItem}>
        <Text style={styles.text}>{time}</Text>
        <Text style={styles.text}>{height} ft</Text>
      </View>
    </View>
  );
}

Number.prototype.toRadians = function () {
  return this * Math.PI / 180;
}

//Haversine formula
function distance(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const phi1 = lat1.toRadians();
  const phi2 = lat2.toRadians();
  const deltaPhi = (lat2 - lat1).toRadians();
  const deltaLambda = (lng2 - lng1).toRadians();

  const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2)
    + Math.cos(phi1) * Math.cos(phi2) *
    Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c;

  return d;
}

const today = new Date();
today.setMinutes(today.getMinutes() - today.getTimezoneOffset())

const HomeScreen = ({ navigation }) => {
  const [tides, setTides] = useState([]);
  const [location, setLocation] = useState(null);
  const [station, setStation] = useState("1612480");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState(today.toISOString().substring(0, 10));

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, [])

  useEffect(() => {
    if (location == null)
      return;

    (async () => {
      const response = await fetch('https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations.json?type=tidepredictions&units=english');
      const data = await response.json();
      const stations = data.stations;

      const lat = location.coords.latitude;
      const lng = location.coords.longitude;

      let closest = stations[0]
      let closestDistance = distance(closest.lat, closest.lng, lat, lng);
      for (let i = 1; i < stations.length; i++) {
        stationDistance = distance(stations[i].lat, stations[i].lng, lat, lng)
        if (stationDistance < closestDistance) {
          closestDistance = stationDistance;
          closest = stations[i];
        }
      }

      console.log("Station ID:", closest.id);
      console.log("Station Name:", closest.name);

      setStation(closest.id);
    })();
  }, [location])

  useEffect(() => {
    const selectedDate = new Date(selectedDay)
    const ISOdate = selectedDate.toISOString().substring(0, 10);
    const queryDate = ISOdate.split("-").join("");
    const url = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=predictions&begin_date=${queryDate}&end_date=${queryDate}&datum=MLLW&station=${station}&time_zone=lst_ldt&units=english&interval=hilo&format=json`

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log(data.predictions);
        setTides(data.predictions);
      })
      .catch((err) => {
        console.log(err.message);
      })
  }, [selectedDay, station])

  const marked = useMemo(() => {
    return {
      [selectedDay]: {
        selected: true,
        disableTouchEvent: true,
      }
    };
  }, [selectedDay]);

  const selectedDate = new Date(selectedDay);
  selectedDate.setDate(selectedDate.getDate() + 1);
  const displayedDate = selectedDate.toDateString();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Pressable onPress={() => setModalVisible(true)}>
        <View style={{
          borderColor: 'white',
          borderWidth: 2,
          marginVertical: 8,
          padding: 10,
          width: 250,
          height: 55,
          marginTop: 150,
        }}>
          <Text style={{ color: 'white', textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>{displayedDate}</Text>
        </View>
      </Pressable>
      <FlatList
        data={tides}
        renderItem={({ item }) => <Item hilo={item.type} date={item.t} height={item.v} />}
      />
      <View
        style={{
          backgroundColor: "#084254",
          width: "100%",
          flexDirection: "row",
          justifyContent: "center"
        }}
      >
        <Pressable onPress={() => setModalVisible(true)}>
          <FontAwesome style={{ marginVertical: 10 }} name="calendar" size={24} color="white" />
        </Pressable>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <TouchableOpacity
            activeOpacity={0.5}
            style={{
              height: '100%',
              opacity: 0.5
            }}
            onPress={() => {
              setModalVisible(!modalVisible);
            }}
          />
          <View style={styles.modalView}>
            <Pressable
              style={{ paddingTop: 10 }}
              onPress={() => setModalVisible(!modalVisible)}>
              <FontAwesome style={{ marginBottom: 10 }} name="calendar" size={24} color="white" />
            </Pressable>
            <Calendar
              theme={{
                calendarBackground: "#084254",
                dayTextColor: "#ffffff",
                monthTextColor: "#ffffff",
                selectedDayBackgroundColor: 'red',
                todayTextColor: '#00adf5',
              }}
              onDayPress={day => {
                console.log('selected day', day);
                setSelectedDay(day.dateString);
              }}
              markedDates={marked}
              initialDate={selectedDay}
              hideExtraDays
              enableSwipeMonths
            />
          </View>
        </View>
      </Modal>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a2d39',
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'white',
    borderWidth: 2,
    marginVertical: 8,
    padding: 10,
    width: 250,
    height: 55
  },
  innerItem: {
    color: 'white',
    flexDirection: 'col',
  },
  text: {
    color: 'white',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalView: {
    backgroundColor: '#084254',
    padding: 10,
    alignItems: 'center',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HomeScreen;