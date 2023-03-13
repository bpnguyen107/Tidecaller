import { StyleSheet, Text, TouchableOpacity, View, TextInput, SafeAreaView} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
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
  <SafeAreaView style={{flex: 1, backgroundColor: '#081319'}}> 
   <LinearGradient
      style={styles.container}
      colors={["#084254", "#081319"]}
    >
   
      <StatusBar style="light" />

      <Text style={{fontSize:30, fontWeight:'500', color:'#F9FFFF', marginBottom:10}}> 
        Welcome Back</Text>
      <Text style={{fontSize:16, fontWeight:'150', color: '#C4C8C8', marginBottom:240}}> Login to your account </Text>

    <View style={styles.inputContainer}>

      <TextInput 
        style={styles.input}
        placeholder="Email" 
        placeholderTextColor="#E0E0E0" 
        onChangeText={(email) => setEmail(email)} />
    
      <TextInput
        style={styles.input}
        placeholder="Password" 
        placeholderTextColor="#E0E0E0" 
        onChangeText={(password) => setPassword(password)} />
    </View>

      <TouchableOpacity  
        styles={styles.button}  
        onPress={() => { loginUser(email, password); setEmail(""); setPassword("") }} >
        <Text style={styles.buttonText}>
          Login User
        </Text>

      </TouchableOpacity>

      <TouchableOpacity 
      onPress={() => registerUser()}>
        <Text style={styles.registerButton}>
          Don't Have an Account? Register User
        </Text>
      </TouchableOpacity>

      <View>
        <Text>
          {errorDisplay}
        </Text>
      </View>

    
    </LinearGradient>
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButton: {
    fontSize: '48px',
  },
  inputContainer: {
    marginTop: 100,
    width: '80%',
    marginHorizontal: 50,
  },
  input: {
    backgroundColor: '#204B5F',
    color: '#fff',
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#204B5F',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
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
    marginBottom: 7,
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
  registerButton: {
    color: '#ccc',
    padding: 6,
    fontSize: 14,
    
  }
});

export default LoginScreen;