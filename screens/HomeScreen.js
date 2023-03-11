import { StyleSheet, Text, View, Modal, Pressable, FlatList, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';
import { useState, useEffect, useMemo } from 'react';
import { Calendar } from 'react-native-calendars';

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

const today = new Date();

const HomeScreen = ({ navigation }) => {
  const [tides, setTides] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState(today.toISOString().substring(0, 10));

  useEffect(() => {
    const selectedDate = new Date(selectedDay)
    const ISOdate = selectedDate.toISOString().substring(0, 10);
    const queryDate = ISOdate.split("-").join("");
    const url = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=predictions&begin_date=${queryDate}&end_date=${queryDate}&datum=MLLW&station=1612480&time_zone=lst_ldt&units=english&interval=hilo&format=json`

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log(data.predictions);
        setTides(data.predictions);
      })
      .catch((err) => {
        console.log(err.message);
      })
  }, [selectedDay])

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
          Alert.alert('Modal has been closed.');
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