import { StyleSheet, Text, Touchable, TouchableOpacity, View, TextInput, SafeAreaView} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { Link, NavigationContainerRefContext, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { MaterialIcons } from 'react-native-vector-icons/MaterialIcons';



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
                // favoriteSpots: [],
                // userId: auth.currentUser.uid,
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


    const handlePress = () => {
      navigation.navigate('Login');
      // call your second function here
    };

  



  //<TextInput onPress={() => createUser(email, password)}/> 
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#081319'}}> 
    <LinearGradient
      style={styles.container}
      colors={["#084254", "#081319"]}
    >
      <StatusBar style="light" />
      <Text style={{fontSize:30, fontWeight:'500', color:'#F9FFFF', marginBottom:10}}> 
        Register</Text>
      <Text style={{fontSize:16, fontWeight:'150', color: '#C4C8C8', marginBottom:280}}> Create your account </Text>

      <Text style={styles.errorText}>
        {errorDisplay}
      </Text>

      <View style={styles.inputContainer}>

        <TextInput style={styles.input}
          autoCapitalize='none'
          placeholder="Name"
          placeholderTextColor="#E0E0E0"
          onChangeText={(name) => setUserName(name)}
        />

        <TextInput style={styles.input}
          autoCapitalize='none'
          placeholder="Email"
          placeholderTextColor="#E0E0E0"
          onChangeText={(email) => setEmail(email)}
        />

        <TextInput style={styles.input} secureTextEntry
          autoCapitalize='none'
          placeholder="Password"
          placeholderTextColor="#E0E0E0"
          onChangeText={(password) => setPassword(password)}
        />
      </View>

      
      <View styles={styles.buttonContainer}></View>

      <TouchableOpacity styles={styles.button} 
        onPress={() => { createUser(), setEmail(""), setPassword("") }} >
        <Text style={styles.buttonText}>
          Register
        </Text>
      </TouchableOpacity>


    <View> 
      <TouchableOpacity onPress={handlePress}>
        <Text style={styles.signUpButton}>
          Have an Account? Log In
        </Text>
      </TouchableOpacity>

    </View>


      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    width: '80%',
  },
  input: {
    backgroundColor: '#204B5F',
    color: '#fff',
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonContainer: {
    backgroundColor: '#204B5F',
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#204B5F',
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
    backgroundColor: '#F6DD7D',
    paddingHorizontal: 130,
    padding: 8,
    borderRadius: 20,
    overflow: 'hidden',
    color: '#204B5F',
    fontWeight: '600',
    fontSize: 16,
    marginTop: 15,
  },
  signUpButton: {
    color: '#ccc',
    padding: 6,
    borderRadius: 4,
    overflow: 'hidden',
  },
  errorText: {
    marginTop: 15,
    color: '#DE4B5F',
  }
});

export default SignUpScreen;