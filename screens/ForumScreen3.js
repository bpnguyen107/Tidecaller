import React, {useState, useEffect} from 'react'
import { Text, View } from 'react-native'

import { auth, app } from '../backend/firebaseConfig';
import { getFirestore, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from '@firebase/firestore';
import { TouchableOpacity } from 'react-native-gesture-handler';

const db = getFirestore(app);

const FavoriteScreen = () => {
  const [userId, setUserId] = useState(auth.currentUser.uid);
  const [favoriteData, setFavoriteData] = useState();
  //finds the userId
  useEffect(() => {
    if (auth.currentUser?.uid != null) {
      setUserId(auth.currentUser.uid)
    }
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

  return (
    <View>
    <Text>FavoriteScreen</Text>

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

export default FavoriteScreen