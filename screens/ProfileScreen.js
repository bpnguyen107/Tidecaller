import { StyleSheet, Text, TouchableOpacity, View, TextInput, SafeAreaView } from 'react-native';
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


    //direct to the login screen when the user signs out
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged(user => {
        if (!user) {
          navigate.navigate("Login");
        }
      })
      return unsubscribe;
    }, [] );

    const isFocused = useIsFocused()

    /*
    useEffect(() => {
        if(isFocused){
            setUserName(auth.currentUser.displayName);
        }
    }, [isFocused])
    */

    

    const userPath = doc(firestore, `user/${auth.currentUser.uid}`);
    //get data
    async function readASingleDocument() {
      console.log("Path?: " + userPath);
      const mySnapshot = await getDoc(userPath);
      if (mySnapshot.exists()) {
        console.log("Entered");
        const docData = mySnapshot.data();
        console.log(`My data is ${JSON.stringify(docData)}`);
        setUserData(JSON.stringify(docData));
        return JSON.stringify(docData);
      }
    }


  return (
  <SafeAreaView style={{flex: 1, backgroundColor: '#1B3E4F'}}> 
    <LinearGradient
      style={styles.container}
      colors={["#0F222C", '#0F222C']}
    >
  
      <StatusBar style="light" />

      <TouchableOpacity>
                <Text>
                    Name: {auth.currentUser?.displayName}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity>
                <Text>
                    {auth.currentUser?.email}
                </Text>
            </TouchableOpacity>
            

            <TouchableOpacity onPress={() => signOutUser()}>
                <Text>
                    Sign Out
                </Text>
            </TouchableOpacity>

          {/* <TouchableOpacity onPress={() => readASingleDocument()}>
            <Text>
              BRuh
            </Text>
            <Text>
              {userData}
            </Text>

          </TouchableOpacity> */}

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
});

export default ProfileScreen;