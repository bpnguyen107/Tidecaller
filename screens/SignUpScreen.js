import { StyleSheet, Text, Touchable, TouchableOpacity, View, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

import { auth } from '../backend/firebaseConfig';

import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';


const SignUpScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUserName] = useState("");
    const [errorDisplay, setErrorDisplay] = useState("");
    const [userCreated, setUserCreated] = useState("");
    const [firebaseUpdate, setFireBaseUpdate] = useState("");

    
    const navigate = useNavigation();
    

    //create a user with firebase auth + cloudfire database
    const createUser = async () => {
      try {
        await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          console.log("User ", userCredential.user);
          updateProfile(auth.currentUser, {
            displayName: username,
            photoURL: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
          }).then(() => {
            console.log("username updated: ", auth.currentUser.displayName)
            setUserCreated("bruh")
            navigate.navigate("Profile")

          })
          .catch((error) => {
            console.log("fail name update: ", error)
          });
      })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
        })

      }
      catch(error) {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log("Error Code: " + errorCode);
          console.log("Error Message: " + errorMessage);
          mapAuthCodeToMessage(errorCode);
          return errorCode;
      }
    }
      
    
    
    function mapAuthCodeToMessage(authCode){
      switch (authCode) {
        case "auth/invalid-email":
          setErrorDisplay("Email provided is invalid");
          return "Email provided is invalid";
        case "auth/already-intialized":
          setErrorDisplay("Already Initialized");
          return "Already Initialized";
        case "auth/weak-password":
          setErrorDisplay("Weak Password");
          return "Weak Password";
        case "auth/email-already-in-use":
          setErrorDisplay("Email Already in Use");
          return "Email Already in Use";
        case "username/empty":
          setErrorDisplay("No Username Given");
          return "No UserName Given"
    
        default:
          return authCode;
      }
    }

    useEffect( () => {
      //navigate.navigate("Profile")

      async function createUserInFirestore(){
        const firestore = getFirestore();
        const userData = doc(firestore, `user/${auth.currentUser.uid}`)

        console.log(`CREATING USER DATA: user/${auth.currentUser.uid}`)
        console.log(`CURRENT USERNAME: ${auth.currentUser.displayName}`);
       
        const docData = {
          favoriteSpots: [],
          userId: auth.currentUser.uid,
          name: auth.currentUser.displayName,
          email: auth.currentUser.email,
        };
        setDoc(userData, docData, {merge: true});  
      }
      createUserInFirestore()

      //bug here doesn't reset the text fields
      setUserCreated("")
      setFireBaseUpdate("updated")
      setEmail("")
      setPassword("")
      setUserName("")

    }, [userCreated])


  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <Text> Sign Up </Text>

      <View style={styles.inputContainer}>

        <TextInput style={styles.input}
          placeholder="Name"
          placeholderTextColor="#003f5c"
          onChangeText={(name) => setUserName(name)}
        />

        <TextInput style={styles.input}
          placeholder="Email"
          placeholderTextColor="#003f5c"
          onChangeText={(email) => setEmail(email)}
        />

        <TextInput style={styles.input} secureTextEntry
          placeholder="Password"
          placeholderTextColor="#003f5c"
          onChangeText={(password) => setPassword(password)}
        />
      </View>

      <View styles={styles.buttonContainer}></View>
      <TouchableOpacity styles={styles.button} onPress={() => { createUser() }} >
        <Text style={styles.buttonText}>
          Create User
        </Text>
      </TouchableOpacity>
      <Text style={styles.errorText}>
        {errorDisplay}
      </Text>


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
  inputContainer: {
    width: '80%',
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  button: {
    backgroundColor: '#0782F9',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonOutline: {
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: "0782F9",
    borderWidth: 2,
  },
  buttonText: {
    color: 'black',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonOutlineText: {

  },
  errorText: {
    color: 'red',
  }
});

export default SignUpScreen;