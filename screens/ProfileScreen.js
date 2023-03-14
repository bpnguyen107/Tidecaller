import { StyleSheet, Text, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

import { signOut, getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from "../backend/firebaseConfig";


import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

//https://stackoverflow.com/questions/52805879/re-render-component-when-navigating-the-stack-with-react-navigation
import { useIsFocused } from '@react-navigation/native'


const auth = getAuth(app);
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

    

  const navigate = useNavigation();

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

    //const isFocused = useIsFocused();

    
    /*
    useEffect(() => {
        if(isFocused){
            setUserName(auth.currentUser.displayName);
        }
        readASingleDocument()
    }, [])
    */
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
    

    const userPath = doc(firestore, `user/${auth.currentUser.uid}`);
    //get data

    /*
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
    readASingleDocument()
    */
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#081319'}}> 
    <LinearGradient
      style={styles.container}
      colors={["#084254", "#081319"]}
    >

      <StatusBar style="light" />
 
      <Text style={{fontSize:30, fontWeight:'500', color:'#F9FFFF', marginBottom:10}}>
        Hello {userName}!
       </Text>

      <Text style={{fontSize:15, fontWeight:'400', color:'#C4C8C8', marginBottom: 100}}>
        {auth.currentUser.email}
      </Text>
      
      <TouchableOpacity 
        styles={styles.signoutTouch} 
        onPress={() => signOutUser()}>
           <Text styles={{fontSize:20, color:'#C4C8C8'}} >
             Sign Out
           </Text>
      </TouchableOpacity>
            
        </LinearGradient>
    </SafeAreaView>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }, 
  // signoutTouch: {
  //   backgroundColor: '#204B5F',
  //   width: '60%',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   marginTop: 40,
  // }, 
  // signoutButton: {
  //   backgroundColor: '#fff',
  //   color: 'white',
  // }

});

export default ProfileScreen;