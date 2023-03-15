import * as React from 'react';
import { useState, useEffect } from 'react';
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
import { getFirestore, onSnapshot, orderBy, collection, query }
  from 'firebase/firestore';

const Item = ({ item, onPress, textColor }) => (
  <View onPress={onPress} style={[styles.item, { backgroundColor: '#183645' }]}>

    <View style={{ flexDirection: 'row', marginTop: 15, marginBottom: 15 }}>
      <Image
        style={{ width: '12%', aspectRatio: 1, marginLeft: 20, marginRight: 10, borderRadius: 50 }}
        source={{ uri: item.profilePic ? item.profilePic : "https://cdn.discordapp.com/attachments/1067598393402200086/1085075999810670692/image.png" }}
      />
      <View>
        <Text
          style={[styles.title, { color: textColor, fontWeight: '475' }]}>
          {item.username ? item.username : "SysError"}
        </Text>

        <Text style={{ color: '#C7C7CC' }}>
          Posted on {item.uploadTime ? item.uploadTime : "Egging Time"}
        </Text>
      </View>
    </View>
    <Image
      style={{ width: '100%', aspectRatio: 3 / 2 }}
      source={{ uri: item.imageUri ? item.imageUri : "https://cdn.discordapp.com/attachments/1067598393402200086/1085075999810670692/image.png" }}
    />
    <Text
      style={{
        color: textColor,
        marginLeft: 15,
        marginTop: 10,
      }}
    >
      Category: {item.category}
    </Text>
    <Text
      style={[styles.title, { color: textColor, marginBottom: 10, marginTop: 10, marginLeft: 15, marginRight: 15, fontSize: 20 }]}>
      {item.message}
    </Text>


  </View>
);


const ForumScreen = () => {
  const [selectedId, setSelectedId] = useState();
  const [image, setImage] = useState(null);
  const [items, setItems] = useState([])

  useEffect(() => {
    const db = getFirestore();
    const discussionForumQuery = query(collection(db, "discussionForum"), orderBy("date", "desc"))
    return onSnapshot(discussionForumQuery, (snapshot) => {
      const postData = [];
      snapshot.forEach((doc) => postData.push({ ...doc.data() }));
      setItems(postData);
    })
  }, [])

  const renderItem = ({ item }) => {
    const backgroundColor = item.id === selectedId ? '#6495ed' : '#6495ed';
    const color = item.id === selectedId ? '#D9DBE0' : '#D9DBE0';

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
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
      />

    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0A1419",
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  popularItems: {
    borderWidth: 0,
  },
  item: {
    padding: 2,
    alignContent: 'center',
  },
  title: {
    fontSize: 24,
  },
});

export default ForumScreen;
