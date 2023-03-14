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

const Item = ({item, onPress, backgroundColor, textColor}) => (
  <View onPress={onPress} style={[styles.item, {backgroundColor}]}>
    <Image style={{width: '10%', height: '10%'}} source={{uri: item.profilePic ? item.profilePic : "https://cdn.discordapp.com/attachments/1067598393402200086/1085075999810670692/image.png"}}/>
    <Text style={[styles.title, {color: textColor}]}>{item.username ? item.username : "SysError"}</Text>
    <Image style={{width: '70%', height: '70%'}} source={{uri: item.imageUri ? item.imageUri : "https://cdn.discordapp.com/attachments/1067598393402200086/1085075999810670692/image.png"}}/> 
    <Text style={[styles.title, {color: textColor}]}>{item.message}</Text>
    <Text> Uploaded: {item.uploadTime ? item.uploadTime : "Egging Time"}</Text>
  </View>
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
