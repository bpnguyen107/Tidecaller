import React, { useState, useEffect } from 'react';
import { Button, Image, View, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../backend/firebaseConfig";

import { getStorage, ref, uploadBytes, uploadBytesResumable } from "firebase/storage";
import { getFirestore, doc, setDoc, getDoc, addDoc, collection, updateDoc } from 'firebase/firestore';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';

initializeApp(firebaseConfig);
const firestore = getFirestore();

export default function ForumScreen2() {
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [postID, setPostID] = useState("");
  //const [displayImage, setDisplayImage] = useState(null);



  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });


    if (!result.canceled) {
      setImage(result.assets[0].uri);
    } 
  };

    async function uploadImage() {
      if (image != NULL) {
        const img = await fetch(image);
        const ImageRef = ref(getStorage(), `image.jpg/${postID}`);
        const bytes = await img.blob();
        const imageUpload = await uploadBytesResumable(ImageRef, bytes)
      }
    }

    function uploadMessages() {
        const currentDate = Date.now()
        try {
              const messageData = collection(firestore, `discussionForum`)
              async function addANewDocument() {
                const newDoc = await addDoc(messageData, {
                  message: message,
                  date: currentDate,
              })
              setPostID(newDoc.id)
              
              const postData = doc(firestore, `discussionForum/${newDoc.id}`)
              console.log("POSTID: ", newDoc.id)
              const docData = {
                ID: newDoc.id
              };
              updateDoc(postData, docData);
            }
            addANewDocument()
          }
          catch(error){
            console.log("couldn't create a message in firebase cloudfire") }
            
    }
    function call () {
      //uploadMessages().then(uploadImage())
    }
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      <Button title="Work on uploading a message" onPress={call()}/>
      <TouchableOpacity>
        <TextInput placeholder="Password" placeholderTextColor="#003f5c" onChangeText={(message) => setMessage(message)}/>
      </TouchableOpacity>
    </View>
  );
}