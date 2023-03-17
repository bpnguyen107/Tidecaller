import React, { useState, useEffect } from 'react'
import { Dimensions, Text, View, StyleSheet } from 'react-native'
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { auth, app } from '../backend/firebaseConfig';
import { getFirestore, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from '@firebase/firestore';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';

const db = getFirestore(app);

const FavoriteScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);
  const [clicked, setClicked] = useState(new Map());
  const [userId, setUserId] = useState("bruh");
  const navigate = useNavigation();

  //finds the userId
  useEffect(() => {
    if (auth.currentUser?.uid != null) {
      setUserId(auth.currentUser.uid)
    }
  }, [])

  const favoriteRef = doc(db, "user", userId) //might have to place this elsewhere depending on timing

  useEffect(() => {
    async function getFavoriteData() {
      const favoriteSnap = await getDoc(favoriteRef);

      if (favoriteSnap.exists()) {
        console.log("Favorite Data: ", favoriteSnap.data().favoriteSpots);
        setFavorites(favoriteSnap.data().favoriteSpots);
      }
      else {
        console.log("No Favorite Data")
      }
    }
    getFavoriteData();
  }, [userId])

  useEffect(() => {
    var clickedTemp = new Map();
    console.log("favorites length:", favorites.length)
    for (let i = 0; i < favorites.length; i++) {
      clickedTemp.set(i, true);
    }
    setClicked(clickedTemp);
  }, [favorites])


  //pass in parameters
  async function updateFavorites(name, id) {
    await updateDoc(favoriteRef, {
      favoriteSpots: arrayUnion({ "name": name, "id": id })
    }).then(console.log("favorite update success"))
  }

  //pass in paramters
  async function removeFavorites(name, id) {
    await updateDoc(favoriteRef, {
      favoriteSpots: arrayRemove({ "name": name, "id": id })
    }).then(console.log("favorite remove success"))
  }

  var printFavs = [];

  for (let i = 0; i < favorites.length; i++) {
    // console.log(favorites[i]);
    printFavs.push(
      <View
        key={i}
        style={{
          backgroundColor: '#084254',
          borderRadius: 10,
          marginVertical: 8,
          marginLeft: 5,
          marginRight: 5,
          flexDirection: "row",
          justifyContent: 'space-between',
          padding: 20,
          alignItems: "center",
          height: 80
        }}
      >
        <Text style={{
          color: "white",
          fontSize: 22,
        }}
        multiline={true}
        >
          {favorites[i].name}
        </Text>
        <FontAwesome
          style={{
            marginLeft: 'auto',
            marginRight: 15
          }}
          name={clicked.get(i) === true ? "star" : "star-o"}
          size={30}
          color={clicked.get(i) === true ? "#FFD233" : "white"}
          onPress={() => {
            var clickedTemp = new Map([...clicked]);
            if (clickedTemp.get(i) === true) {
              clickedTemp.set(i, false);
              removeFavorites(favorites[i].name, favorites[i].id);
            }
            else {
              clickedTemp.set(i, true);
              updateFavorites(favorites[i].name, favorites[i].id);
            }
            setClicked(clickedTemp);
          }}
        />
        <MaterialIcons
          name="waves"
          size={24}
          color="white"
          onPress={() => {
            navigation.jumpTo('Home', { stationID: favorites[i].id, stationName: favorites[i].name })
          }}
        />
      </View>
    );
  }

  return (
  <LinearGradient
    style={styles.container}
    colors={['rgba(0,0,0,0.6)', 'transparent']}
  >
    <ScrollView>
      <View style={{marginTop: 10}}>
        {userId == "bruh" &&
          <TouchableOpacity 
            style={styles.button}
            onPress={() => {navigate.navigate("Login")}}
          >
            <Text
              style={{
                color: 'white',
                fontSize: 20,
                marginBottom: 20,
                align: 'center'
              }}
            >
              You Must Be Logged in to See Favorites
            </Text>
            <Text 
              style={styles.buttonText}
            >
              Go to Login Screen
            </Text>
          </TouchableOpacity>
        }
        {userId != "bruh" &&
          <View>
            { printFavs }
          </View>
        }
      </View>
    </ScrollView>
  </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#084254',
  },
  button: {
    alignItems: 'center',
    marginTop: Dimensions.get("window").height * 0.3
  },
  buttonText: {
    backgroundColor: '#F6DD7D',
    paddingHorizontal: 130,
    padding: 8,
    borderRadius: 20,
    overflow: 'hidden',
    color: '#204B5F',
    fontWeight: '600',
    fontSize: 16,
    // marginTop: 15,
    // marginBottom: 7,
  },
});

export default FavoriteScreen;