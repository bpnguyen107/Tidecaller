import { StyleSheet, Text, SafeAreaView, TouchableOpacity, View, Image, Button} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';

import { signOut, getAuth, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { app } from "../backend/firebaseConfig";

import { auth } from '../backend/firebaseConfig';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

//https://stackoverflow.com/questions/52805879/re-render-component-when-navigating-the-stack-with-react-navigation
import { useIsFocused } from '@react-navigation/native'
import { getStorage, ref, uploadBytes, uploadBytesResumable, getDownloadURL  } from 'firebase/storage';

//const auth = getAuth(app);
const firestore = getFirestore();

//Sign Out Function
function signOutUser() {
  signOut(auth).then(() => {
    console.log("Sign-out successful");
  }).catch((error) => {
    console.log("Error Code: ", error.code)
    console.log("Error Message: ", error.message);
  });
}


const ProfileScreen = ({ navigation }) => {
    const [userData, setUserData] = useState("");
    const [userName, setUserName] = useState("");
    const [userProfile, setUserProfile] = useState(null);
    const [image, setImage] = useState(null);

    
    const userPath = doc(firestore, `user/${auth.currentUser.uid}`);
    const navigate = useNavigation();

  navigate.addListener('focus', () => {
    console.log("reset")
  });

  navigate.addListener('focus', () => {
    console.log("reset")
  });


    //direct to the login screen when the user signs out
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged(user => {
        if (!user) {
          navigate.navigate("Login");
        }
      })
      return unsubscribe;
    }, [] );

    useEffect(() => {
      async function readASingleDocument() {
        console.log("Path?: " + userPath);
        const mySnapshot = await getDoc(userPath);
        if (mySnapshot.exists()) {
          console.log("Entered");
          const docData = mySnapshot.data();
          console.log(`My data is ${JSON.stringify(docData)}`);
          setUserData(JSON.stringify(docData));
          setUserName(auth.currentUser.displayName)
          .then(console.log("good"));
          return JSON.stringify(docData);
        }
      }
      readASingleDocument();
    }, [])
    

    useEffect(() => {

      updateProfile(auth.currentUser, {
        photoURL: userProfile
      }).then(() => {
        console.log("userProfile updated: ", auth.currentUser.photoURL)
      })
      
    }, [userProfile])

    /*
    const uploadUserProfile = async () => {
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

      const img = await fetch(image);
      const ImageRef = ref(getStorage(), `user/${auth.currentUser.uid}.img`);
      const bytes = await img.blob();

      const imageUpload = await uploadBytesResumable(ImageRef, bytes)
      .then(
        async () => {
          console.log("User Profile UpLoad Finish")
          const reference = ref(getStorage(), `user/${auth.currentUser.uid}.img`)
          await getDownloadURL(reference).then((x) => {
            setUserUrl(x);
            console.log("Image Url: ", x)
          })
      }).catch((error) => {
          console.log(error.message)
      })
    }
    */

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

    useEffect(() => {

      async function caller() {
      const img = await fetch(image);
      const ImageRef = ref(getStorage(), `user/${auth.currentUser.uid}.img`);
      const bytes = await img.blob();

      const imageUpload = await uploadBytesResumable(ImageRef, bytes)
      .then(
        async () => {
          console.log("User Profile UpLoad Finish")
          const reference = ref(getStorage(), `user/${auth.currentUser.uid}.img`)
          await getDownloadURL(reference).then((x) => {
            setUserProfile(x);
            console.log("Image Url: ", x)
          })
      }).catch((error) => {
          console.log(error.message)
      })
    }
    caller();
    }, [image])



  return (

    <LinearGradient
      style={{flex:1, justifyContent: 'center'}}
      colors={["#436496", "#7CBCBF"]}
    >
      <TouchableOpacity 
      onPress={pickImage}
      >
      <Image 
      source={{ uri: auth.currentUser.photoURL, cache: 'default'}} 
      style={{ width: 250, height: 250, borderRadius: 150, marginBottom: 25, alignSelf: 'center', marginTop: 95, borderWidth:6, borderColor:'#0A1424'}} />
      </TouchableOpacity>
  
      <Text style={{fontSize:30, fontWeight:'600', color:'#0A1424', marginBottom:6, alignSelf: 'center'}}>
        Hello {userName}!
       </Text>

      <Text style={{fontSize:15, fontWeight:'400', color:'#0A1424', marginBottom: 100, alignSelf: 'center'}}>
        {auth.currentUser.email}
      </Text>
      <Button
        
        onPress={signOutUser}
        title="Sign Out"
        color="#0A1424"/>
   
    </LinearGradient>
 
  );

}

const styles = StyleSheet.create({
 
  signoutTouch: {
    backgroundColor: '#204B5F',
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  }, 

});

export default ProfileScreen;