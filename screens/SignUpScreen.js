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

    
    const navigate = useNavigation();
    
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged(user => {
        if (user) {
          navigate.navigate("Home")
        }
      })
      return unsubscribe;
    }, [] )
    

    //create a user with firebase auth + cloudfire database
    const createUser = async (username) => {
      //experimental code //makes sure that name field is filled out
      /*
      if (username == NULL){
        console.log("username input is empty");
        mapAuthCodeToMessage("username/empty");
        throw(error);
      }
      */
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        .then();
        console.log(userCredential.user);

        updateProfile(auth.currentUser, {
          displayName: username,
        }).then(() => {
            console.log("name is updated");
          }).then(() => {
            //create the user in the firebase cloudfire database
            const firestore = getFirestore();
            const userData = doc(firestore, `user/${auth.currentUser.uid}`)
            console.log(`CREATING USER DATA: user/${auth.currentUser.uid}`)
            console.log(`CURRENT USERNAME: ${auth.currentUser.displayName}`);
            function create() {
              const docData = {
                favoriteSpots: [],
                userId: auth.currentUser.uid,
                name: auth.currentUser.displayName,
              };
              setDoc(userData, docData, {merge: true});
            }
            create();
          }).catch((error) => {
            console.log("couldn't create user in firebase cloudfire")
        }).catch((error) => {
          console.log("couldn't update username");
      });
        
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
  //<TextInput onPress={() => createUser(email, password)}/> 
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
      <TouchableOpacity styles={styles.button} onPress={() => { createUser(), setEmail(""), setPassword("") }} >
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