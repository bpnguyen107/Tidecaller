import React, { useState, useEffect } from 'react'
import { Text, View } from 'react-native'
import { favArray } from '../screens/MapScreen.js'
import { FontAwesome } from '@expo/vector-icons';

import { auth, app } from '../backend/firebaseConfig';
import { getFirestore, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from '@firebase/firestore';
import { TouchableOpacity } from 'react-native-gesture-handler';

const db = getFirestore(app);

const FavoriteScreen = () => {

  const [favorites, setFavorites] = useState([]);
  const [clicked, setClicked] = useState(new Map());

  const [userId, setUserId] = useState(auth.currentUser.uid);
  const [favoriteData, setFavoriteData] = useState();
  //finds the userId
  useEffect(() => {
    if (auth.currentUser?.uid != null) {
      setUserId(auth.currentUser.uid)
    }
  }, [])


	useEffect(()=>{
    var fav = favArray();
		setFavorites(fav);
    var clickedTemp = new Map();
    console.log("favorites length:", fav.length)
    for (let i = 0; i < fav.length; i++){
      clickedTemp.set(i, true);
    }
    setClicked(clickedTemp);
	}, [])

  const favoriteRef = doc(db, "user", userId) //might have to place this elsewhere depending on timing

  async function editFavorites() {
    const favoriteSnap = await getDoc(favoriteRef);

    if (favoriteSnap.exists()) {
      console.log("Favorite Data: ", favoriteSnap.data().favoriteSpots);
      setFavoriteData(favoriteSnap.data().favoriteSpots)
    }
    else {
      console.log("No Favorite Data")
    }
  }

  //pass in parameters
  async function updateFavorites() {
    await updateDoc(favoriteRef, {
      favoriteSpots: arrayUnion({"name": "bruh123", "geopoint": "your mom's house"})
    }).then(console.log("favorite update success"))
  }

  //pass in paramters
  async function removeFavorites() {
    await updateDoc(favoriteRef, { 
      favoriteSpots: arrayRemove({"name": "bruh123", "geopoint": "your mom's house"})
    }).then(console.log("favorite remove success"))
  }
  
  var printFavs = [];

  for (let i = 0; i < favorites.length; i++){
    printFavs.push(
    <View key={i}>
      <Text>
        { favorites[i] }
        <FontAwesome 
          name={clicked.get(i)===true ? "star" : "star-o"}
          size={24}
          color={clicked.get(i)===true ? "#FFD233" : "black"}
          onPress={() => {
            var clickedTemp = new Map([...clicked]);
            if (clickedTemp.get(i) === true){
              clickedTemp.set(i, false);
            }
            else {
              clickedTemp.set(i, true);
            }
            setClicked(clickedTemp);
          }}
        />
      </Text>
    </View>);
  }

  return (
  <View>
    <View style={{ marginTop: 1, flex: 1 }}>
      { printFavs }
    </View>

    <TouchableOpacity onPress={() => editFavorites()}>
      <Text style={{fontSize:40}}>
        Bruh
      </Text>
    </TouchableOpacity>

    <TouchableOpacity onPress={() => updateFavorites()}>
      <Text style={{fontSize:40}}>
        Chicken
      </Text>
    </TouchableOpacity>

    <TouchableOpacity onPress={() => removeFavorites()}>
      <Text style={{fontSize:40}}>
        Ceramic
      </Text>
    </TouchableOpacity>
  </View>
  )
}

export default FavoriteScreen;