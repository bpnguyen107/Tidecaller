import React, { useState, useEffect } from 'react'
import { Text, View } from 'react-native'
import { FontAwesome } from '@expo/vector-icons';

import { auth, app } from '../backend/firebaseConfig';
import { getFirestore, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from '@firebase/firestore';
import { TouchableOpacity } from 'react-native-gesture-handler';

const db = getFirestore(app);

const FavoriteScreen = () => {

  const [favorites, setFavorites] = useState([]);
  const [favOriginal, setFavOriginal] = useState([]);
  const [clicked, setClicked] = useState(new Map());

  const [userId, setUserId] = useState("bruh");
  const [favoriteData, setFavoriteData] = useState();

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
        var favoriteObjects = [...favoriteSnap.data().favoriteSpots];
        var favoriteNames = [];
        for (let i = 0; i < favoriteObjects.length; i++){
          favoriteNames.push(favoriteObjects[i].name);
        }
        setFavorites(favoriteNames);
      }
      else {
        console.log("No Favorite Data")
      }
    }
    getFavoriteData();
  }, [userId]) 

	useEffect(()=>{
    var clickedTemp = new Map();
    console.log("favorites length:", favorites.length)
    for (let i = 0; i < favorites.length; i++){
      clickedTemp.set(i, true);
    }
    setClicked(clickedTemp);
	}, [favorites])
    

  //pass in parameters
  async function updateFavorites(name) {
    await updateDoc(favoriteRef, {
      favoriteSpots: arrayUnion({"name": name})
    }).then(console.log("favorite update success"))
  }

  //pass in paramters
  async function removeFavorites(name) {
    await updateDoc(favoriteRef, { 
      favoriteSpots: arrayRemove({"name": name})
    }).then(console.log("favorite remove success"))
  }
  
  var printFavs = [];

  for (let i = 0; i < favorites.length; i++){
    // console.log(favorites[i]);
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
              removeFavorites(favorites[i]);
            }
            else {
              clickedTemp.set(i, true);
              updateFavorites(favorites[i]);
            }
            setClicked(clickedTemp);
          }}
        />
      </Text>
    </View>
    );
  }

  return (
  
  <View style={{ marginTop: 1, flex: 1 }}>
    {userId == "bruh" &&
      <TouchableOpacity onPress={() => editFavorites()}>
          <Text style={{fontSize:40}}>
            Go Login
          </Text>
      </TouchableOpacity>
    }
    {userId != "bruh" &&
      <View>
        { printFavs }
      </View>
    }
  </View>
  )
}

export default FavoriteScreen;