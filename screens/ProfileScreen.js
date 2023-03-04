import { StyleSheet, Text, Touchable, TouchableOpacity, View, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

import { signOut, getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from "../backend/firebaseConfig";


const auth = getAuth(app);

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
    

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />

            <Text> Login </Text>
             
            <TouchableOpacity>
                <Text>
                    Email: {auth.currentUser?.email}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity>
                <Text>
                    Name: {auth.currentUser?.displayName}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => signOutUser()}>
                <Text>
                    Sign Out
                </Text>
            </TouchableOpacity>

            
        </View>
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