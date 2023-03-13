import React, { useState, useEffect } from 'react';
import { Button, Image, View, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../backend/firebaseConfig";

import { getStorage, ref, uploadBytes, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, setDoc, getDoc, addDoc, collection, updateDoc } from 'firebase/firestore';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';

import { auth } from '../backend/firebaseConfig';

initializeApp(firebaseConfig);
const firestore = getFirestore();

export default function ForumScreen2() {
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [postID, setPostID] = useState("");
  const [imageUrl, setImageUrl] = useState(undefined);

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
      quality: 0.1,
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
          catch(error){
            console.log("couldn't create a message in firebase cloudfire") 
          }
    }

  useEffect(() => {
    if (postID == "")
      return;
    
    async function uploadImage() {
      if (image != null) {
        const date = Date.now()
        console.log("we are here")
        const img = await fetch(image);
        const ImageRef = ref(getStorage(), `${postID}.img`);
        const bytes = await img.blob();

        const metadata = {
          customMetadata: {message: message,
          date: date},
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
            })
        }).catch((error) => {
            console.log(error.message)
        })


      
      }
    }
    uploadImage();

    //reset the screen
    setImage(null);
    setMessage("");
  }, [postID])

  
  useEffect(() => {
    console.log("Uploading Image Uri")
    async function updateImageUri() {
    const ImageData = doc(firestore, `discussionForum/${postID}`)
    const docData = {
      imageUri: imageUrl,
      username: auth.currentUser?.displayName
    };
    await updateDoc(ImageData, docData)
  }
    updateImageUri();

    //reset the post id
    setPostID("");
  }, [imageUrl])


  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}

      {image &&
      <TouchableOpacity>
        <TextInput placeholder="Caption" placeholderTextColor="#003f5c" onChangeText={(message) => setMessage(message)}/>
      </TouchableOpacity>
      }
      {image && message &&
      <Button 
        title="Upload" 
        onPress={() => {
          uploadMessages()
        }}/>
      }
      
    </View>
  );
}