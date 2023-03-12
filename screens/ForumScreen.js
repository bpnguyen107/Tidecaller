import * as React from 'react';
import {useState, useEffect} from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'sea glass',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'surf',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'fishing'  },
];

const Item = ({item, onPress, backgroundColor, textColor}) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, {backgroundColor}]}>
    <Text style={[styles.title, {color: textColor}]}>{item.title}</Text>
  </TouchableOpacity>
);

const ForumScreen = () => {
  const [selectedId, setSelectedId] = useState();
  const [image, setImage] = useState(null);

  const renderItem = ({item}) => {
    const backgroundColor = item.id === selectedId ? '#0000ff' : '#6495ed';
    const color = item.id === selectedId ? 'white' : 'black';
  
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    console.log(result);
  
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  

    return (
      <Item
        item={item}
        onPress={() => setSelectedId(item.id)}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };

  return (
    
    <SafeAreaView style={styles.container}>
      <FlatList style={styles.popularItems} inverted
        data={DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        extraData={selectedId}
      />

    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Upload!</Text>
    </View>

    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
    </View>

    </SafeAreaView>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0, //?
  },
  popularItems: {
    borderWidth: 4
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    height: 100,
    borderRadius: 9,
    alignContent: 'center',
  },
  title: {
    fontSize: 24,
  },
});

export default ForumScreen;
