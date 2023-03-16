import React, { useState, useEffect } from 'react';
import { Button, Image, View, Platform, Text, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../backend/firebaseConfig";
import { getStorage, ref, uploadBytes, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, setDoc, getDoc, addDoc, collection, updateDoc } from 'firebase/firestore';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../backend/firebaseConfig';


initializeApp(firebaseConfig);
const firestore = getFirestore();



export default function ForumScreen2(navigation) {
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [postID, setPostID] = useState("");
  const [imageUrl, setImageUrl] = useState(undefined);
  const [category, setCategory] = useState('General');
  const [username, setUserName] = useState("Anonymous");
  const [userProfilePic, setUserProfilePic] = useState("")

  const navigate = useNavigation();

  const categories = [
    { name: 'General', backgroundColor: 'red' },
    { name: 'Seaglass', backgroundColor: 'blue' },
    { name: 'Surf', backgroundColor: 'yellow' },
    { name: 'Fish', backgroundColor: 'green' },
  ];

  const RadioGroup = ({ options, selectedOption, onSelect }) => {
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
                  backgroundColor: (selectedOption === option.name) ? option.backgroundColor : '#f0f0f0',
                  color: (selectedOption === option.name) ? '#fff' : '#000',
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
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}

      {image &&
        <TouchableOpacity>
          <TextInput placeholder="Caption" placeholderTextColor="#003f5c" maxLength={1000} onChangeText={(message) => setMessage(message)} />
        </TouchableOpacity>
      }
      {
        image &&
        <View>
          <RadioGroup
            options={categories}
            selectedOption={category}
            onSelect={(option) => setCategory(option)}
          />
        </View>
      }
      {image && message &&
        <Button
          title="Upload"
          onPress={() => {
            uploadMessages()
          }} />
      }


    </View>
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
});