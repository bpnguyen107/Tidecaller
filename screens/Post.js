import React, { useState, useEffect } from 'react';
import { Button, Image, View, Text, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../backend/firebaseConfig";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, addDoc, collection, updateDoc } from 'firebase/firestore';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../backend/firebaseConfig';
import { LinearGradient } from 'expo-linear-gradient';


initializeApp(firebaseConfig);
const firestore = getFirestore();

export default function Post(navigation) {
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [postID, setPostID] = useState("");
  const [imageUrl, setImageUrl] = useState(undefined);
  const [category, setCategory] = useState('General');
  const [username, setUserName] = useState("Anonymous");
  const [userProfilePic, setUserProfilePic] = useState("")
  const navigate = useNavigation();

  

  const categories = [
    { name: 'General', backgroundGradient: ['#69D0EB', '#62A88D'], activeGradient:['#3F5CBF', '#356C81']},
    { name: 'Seaglass', backgroundGradient: ['#69D0EB', '#62A88D'], activeGradient:['#3F5CBF', '#356C81']},
    { name: 'Surf', backgroundGradient: ['#69D0EB', '#62A88D'], activeGradient: ['#3F5CBF', '#356C81']},
    { name: 'Fish', backgroundGradient: ['#69D0EB', '#62A88D'], activeGradient: ['#3F5CBF', '#356C81']},
  ];


  const RadioGroup = ({ options, selectedOption, onSelect }) => {
    return (
      <View style={styles.radioContainer}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.name}
          onPress={() => onSelect(option.name)}
        >
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            colors={selectedOption === option.name ? option.activeGradient : option.backgroundGradient}
            style={[
              styles.radioButtonText,
              styles.radioButton,
            ]}
          >
            <Text
              style={{
                color: selectedOption === option.name ? 'white' : 'white',
                textAlign: 'center',
              }}
            >
              {option.name}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </View>
    );
  };



  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };


  async function uploadMessages() {
    const currentDate = Date.now()
    try {
      const messageData = collection(firestore, `discussionForum`)
      async function addANewDocument() {
        const newDoc = await addDoc(messageData, {
          message: message,
          date: currentDate,
          category: category,
        })
        setPostID(newDoc.id)

        const postData = doc(firestore, `discussionForum/${newDoc.id}`)
        console.log("POSTID: ", newDoc.id)
        const docData = {
          id: newDoc.id,
        };
        await updateDoc(postData, docData);
      }
      await addANewDocument();
    }
    catch (error) {
      console.log("couldn't create a message in firebase cloudfire")
    }
  }

  useEffect(() => {
    if (postID == "")
      return;
    async function uploadImage() {
      if (image != null) {
        const date = Date.now()
        console.log("Image Uploaded")
        const img = await fetch(image);
        const ImageRef = ref(getStorage(), `${postID}.img`);
        const bytes = await img.blob();

        const metadata = {
          customMetadata: {
            message: message,
            date: date
          },
        };
        const imageUpload = await uploadBytesResumable(ImageRef, bytes, metadata)
          .then(
            async () => {
              console.log("Upload Finish")
              const storage = getStorage();
              const reference = ref(storage, `${postID}.img`)
              await getDownloadURL(reference).then((x) => {
                setImageUrl(x);
                console.log("Image Url: ", x)
                navigate.navigate("Forums") //navigate to forums page //timings may be off
              })
            }).catch((error) => {
              console.log(error.message)
            })
      }
    }
    uploadImage();

    //setUploadTime(getDate());
    //setUserName(auth.currentUser?.displayName);
    if (auth.currentUser?.displayName != null) {
      setUserName(auth.currentUser.displayName)
      setUserProfilePic(auth.currentUser.photoURL)
    }

  }, [postID])


  useEffect(() => {
    console.log("Uploading Image Uri");

    const currentDate = getDate();
    async function updateImageUri() {
      const ImageData = doc(firestore, `discussionForum/${postID}`)
      const docData = {
        imageUri: imageUrl,
        username: username,
        uploadTime: currentDate,
        profilePic: userProfilePic

      };
      await updateDoc(ImageData, docData)
    }
    updateImageUri().then(console.log("upload success"));

    //reset the post id
    setPostID("");
    //reset the screen
    setImage(null);
    setMessage("");
  }, [imageUrl])


  // Fixed nelsons date function :(
  function getDate() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const month = months[now.getMonth()];
    const day = now.getDate();
    const year = now.getFullYear();
    let hour = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour ? hour : 12;
    const formattedTime = hour + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + ampm;
    return `${month} ${day}, ${year} ${formattedTime}`;
  }


  return (
   
    <LinearGradient
    style={{flex:1, flexDirection: 'column'}}
    colors={["#436496", "#7CBCBF"]}
    start={{x: 0, y: 0}}
    end={{x: 1, y: 1}}>
      
      <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', marginTop: 40}}> 
        <Image 
          source={{ uri: image }} 
          style={{ aspectRatio: 15/16, height: 400}} />
      <TouchableOpacity
        style={{ backgroundColor: 'transparent', borderColor: '#0A1424', padding: 6, borderRadius: 5, marginTop: 10, borderWidth:1 }}
        onPress={pickImage}>
          <Text style={{ color: '#0A1424', textAlign: 'center' }}>Select Image</Text>
      </TouchableOpacity>
      </View>
    
    <View style={{ backgroundColor: '#0A1424', flex: 1, marginTop: 150, alignContent: 'center', flexDirection: 'column', alignItems: 'stretch' }}>
      
      <View style={{ position: 'relative', height: 40, marginTop: 10, width: '100%' }}>
        <TextInput 
          placeholder="Write something..." 
          placeholderTextColor="#D9DBE0" 
          maxLength={1000} 
          onChangeText={(message) => setMessage(message)}
          style={{ color: 'white', fontSize: 16, paddingHorizontal: 10, height: 40, marginLeft: 10, marginRight: 10 }}
          multiline={true}
          numberOfLines={3}/>
      <View style={{ position: 'absolute', bottom: -10, left: 20, right: 20, height: 0.75, backgroundColor: 'white' }}></View>
    </View>

    <View style={{marginTop: 20, marginLeft: 20, marginRight: 20}}>
      <Text style={{color: 'white', fontWeight: '700', fontSize:'20'}}>
        Add Category
      </Text>
      <View style={{marginTop: 5}}>
          <RadioGroup
            options={categories}
            selectedOption={category}
            onSelect={(option) => setCategory(option)}
          />
        </View>
    </View>
    <View>
   
    </View>

 
      <TouchableOpacity
        style={{justifyContent:'center', alignContent: 'center', marginRight: 40, marginLeft: 40, marginTop: 15}}
        onPress={() => {uploadMessages()}}>
          <LinearGradient 
          style={{borderRadius:40}}
          colors={['#3F5CBF', '#356C81']}>
            <Text style={{color:'white', fontWeight:'700', fontSize:'25', alignSelf: 'center', padding: 8 }}>
              Upload to Tidecaller
            </Text>
        </LinearGradient>
      </TouchableOpacity>
 
    </View>
    </LinearGradient>
  
  );
}

const styles = StyleSheet.create({
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
  // LinearGradient: {
  //   width: '100%', 
  //   height: '65%',
  //   flex: 0,
  //   marginTop: 0,
  // }
});