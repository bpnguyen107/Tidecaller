import React, { useState, useEffect } from 'react'
import { Text, View } from 'react-native'
import { favArray } from '../screens/MapScreen.js'
import { FontAwesome } from '@expo/vector-icons';

const FavoriteScreen = () => {

  const [favorites, setFavorites] = useState([]);
  const [clicked, setClicked] = useState(new Map());


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
    <View style={{ marginTop: 1, flex: 1 }}>
      { printFavs }
    </View>
  )
}

export default FavoriteScreen;