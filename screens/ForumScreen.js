import * as React from 'react';
import {useState, useEffect} from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text, Image,
  TouchableOpacity,
  View,
  Button
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getFirestore, doc, setDoc, getDocs, onSnapshot, orderBy,
  addDoc, collection, updateDoc, query, where, limit } 
from 'firebase/firestore';
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../backend/firebaseConfig";


const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'sea glass',
    message: "1",
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'surf',
    message: "2",
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'fishing', 
    message: "3", },
];

const Item = ({item, onPress, backgroundColor, textColor}) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, {backgroundColor}]}>
    <Text style={[styles.title, {color: textColor}]}>{item.username}</Text>
    <Image style={{width: '70%', height: '70%'}} source={{uri: item.imageUri}}/> 
    <Text style={[styles.title, {color: textColor}]}>{item.message}</Text>
  </TouchableOpacity>
);

const ForumScreen = () => {
  const [selectedId, setSelectedId] = useState();
  const [image, setImage] = useState(null);
  const [items, setItems] = useState([])

  useEffect(() => {
    const db = getFirestore();
    const discussionForumQuery = query(collection(db, "discussionForum"), orderBy("date", "desc"))
    return onSnapshot(discussionForumQuery,(snapshot) => {
      const postData = [];
      snapshot.forEach((doc) => postData.push({... doc.data() }));
      //console.log(postData);  // <------
      setItems(postData);
    })
    }, [])
  
  //console.log(items)

  const renderItem = ({item}) => {
    const backgroundColor = item.id === selectedId ? '#6495ed' : '#6495ed';
    const color = item.id === selectedId ? 'black' : 'black';
  
  
  

    return (
      <Item
        item={item}
        //onPress={() => setSelectedId(item.id)}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };

  return (
    
    <SafeAreaView style={styles.container}>
      <FlatList style={styles.popularItems}
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        extraData={selectedId}
      />

    </SafeAreaView>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0, //?
  },
  popularItems: {
    borderWidth: 0
  },
  item: {
    padding: 2,
    marginVertical: 8,
    marginHorizontal: 0,
    height: 700,
    borderRadius: 9,
    alignContent: 'center',
  },
  title: {
    fontSize: 24,
  },
});

export default ForumScreen;
