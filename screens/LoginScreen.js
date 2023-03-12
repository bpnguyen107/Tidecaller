import { StyleSheet, Text, Touchable, TouchableOpacity, View, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

import { signInWithEmailAndPassword, getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

import { auth } from '../backend/firebaseConfig';
import { app } from "../backend/firebaseConfig";

function signOutUser() {
  signOut(auth).then(() => {
    console.log("Sign-out successful");
  }).catch((error) => {
    console.log("Error Code: ", error.code)
    console.log("Error Message: ", error.message);
  });
}

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorDisplay, setErrorDisplay] = useState("");


  const navigate = useNavigation();


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        navigate.navigate("Profile")
      }
      else {
        signOutUser();
      }
    },)

    return unsubscribe;
  }, []);


  function registerUser() {
    navigate.navigate("Sign Up");
  }

  const loginUser = async (email, password) => {
    const loginEmail = email;
    const loginPassword = password;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      console.log(userCredential.user);
      navigate.navigate("Profile");
    }
    catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("Error Code: " + errorCode);
      console.log("Error Message: " + errorMessage);
      mapAuthCodeToMessage(errorCode);
      return errorCode;
    };
  }

  function mapAuthCodeToMessage(authCode) {
    switch (authCode) {
      case "auth/wrong-password":
        setErrorDisplay("Incorrect Password");
        return "Incorrect Password";
      case "auth/invalid-email":
        setErrorDisplay("Invalid Email");

      default:
        return "";
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <Text> Login </Text>

      <TextInput placeholder="Email" placeholderTextColor="#003f5c" onChangeText={(email) => setEmail(email)} />

      <TextInput placeholder="Password" placeholderTextColor="#003f5c" onChangeText={(password) => setPassword(password)} />

      <TouchableOpacity onPress={() => { loginUser(email, password); setEmail(""); setPassword("") }} >
        <Text>
          Login User
        </Text>
        <TouchableOpacity onPress={() => registerUser()}>
          <Text>
            Register User
          </Text>
        </TouchableOpacity>
        <Text>
          {errorDisplay}
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
  loginButton: {
    fontSize: '48px',
  },
  inputButtons: {
    fontSize: 24,
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 20,
    elevation: 3,
    borderWidth: 1,
    width: 200,
    margin: 12,
    //backgroundColor: 'black',
  },
});

export default LoginScreen;