import React, { useState, useEffect } from 'react';
import { Button, Image, View, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../backend/firebaseConfig";

import { getStorage, ref, uploadBytes, uploadBytesResumable } from "firebase/storage";
import { getFirestore, doc, setDoc, getDocs, onSnapshot, orderBy,
        addDoc, collection, updateDoc, query, where, limit } 
    from 'firebase/firestore';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';

initializeApp(firebaseConfig);
const firestore = getFirestore();

export default function ForumScreen3() {
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [postID, setPostID] = useState("");
  //const [displayImage, setDisplayImage] = useState(null);


  async function queryForDocuments() {
    const customerOrdersQuery = query(
      collection(firestore, 'discussionForum'),
      orderBy('date', 'desc'),
      limit(20)
    );
    
    onSnapshot(
        customerOrdersQuery, 
        (querySnapshot) => {
        console.log(JSON.stringify(querySnapshot.docs.map((e) => e.data())));
        }
    );
    
  }
  queryForDocuments();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Pick an image from camera roll"/>
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      <Button 
        title="Work on uploading a message" 
      />
      <TouchableOpacity>
        <TextInput placeholder="Password" placeholderTextColor="#003f5c" onChangeText={(message) => setMessage(message)}/>
      </TouchableOpacity>
    </View>
  );
}