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

const categories = [
  { name: 'General', backgroundColor: 'red' },
  { name: 'Seaglass', backgroundColor: 'blue' },
  { name: 'Surf', backgroundColor: 'yellow' },
  { name: 'Fish', backgroundColor: 'green' },
];

const RadioGroup = ({ options, filters, onSelect }) => {
  return (
    <View style={styles.radioContainer}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.name}
          onPress={() => onSelect(option.name)}
        >
          <Text
            style={[
              styles.radioButtonText,
              styles.radioButton,
              {
                backgroundColor: (filters === option.name) ? option.backgroundColor : '#f0f0f0',
                color: (filters === option.name) ? '#fff' : '#000',
                marginHorizontal: 5,
                overflow: "hidden"
              },
            ]}
          >
            {option.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

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
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState("General");

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
    if ((filter !== item.category)) {
      return null;
    }
    return (
      <Item
        item={item}
        backgroundColor='#6495ed'
        textColor='#D9DBE0'
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <RadioGroup
        options={categories}
        filters={filter}
        onSelect={(option) => setFilter(option)}
      />
      <FlatList style={styles.popularItems}
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.id}
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
    marginVertical: 8,
    alignContent: 'center',
  },
  title: {
    fontSize: 24,
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 20,
  },
  radioButton: {
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
  },
  radioButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ForumScreen;
