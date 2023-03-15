import React, {useState, useEffect} from 'react'
import { Text, View } from 'react-native'

import { auth, app } from '../backend/firebaseConfig';
import { getFirestore, doc, getDoc, updateDoc } from '@firebase/firestore';
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

  async function updateFavorites() {

  }

  return (
    <View>
    <Text>FavoriteScreen</Text>

    <TouchableOpacity onPress={() => editFavorites()}>
      <Text style={{fontSize:40}}>
        Bruh
      </Text>
    </TouchableOpacity>
    </View>
  )
}

export default FavoriteScreen