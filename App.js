import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './screens/HomeScreen';
import MapScreen from './screens/MapScreen';
import SignUpScreen from './screens/SignUpScreen';
import LoginScreen from './screens/LoginScreen';
import ProfileScreen from './screens/ProfileScreen';

import { useState, useEffect } from 'react';
import { app } from "./backend/firebaseConfig";
import { getAuth } from 'firebase/auth';

const Drawer = createDrawerNavigator();


export default function App() {
  const [showUserOptions, setUserOptions] = useState(false);
  const [showUserOptions2, setUserOptions2] = useState(true);
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUserOptions(true);
      }
      else 
      {
        setUserOptions(false);
      }
    })

    return unsubscribe;

  }, [] );

  //{showUserOptions ? (
  //  <Drawer.Screen name="Profile" component={ProfileScreen} />
  //  ): <Drawer.Screen name="Login" component={LoginScreen} />}

  //<Drawer.Screen options={{showUserOptions2}? {drawerItemStyle: {height: 0}}: false} name="Profile" component={ProfileScreen} />
  //<Drawer.Screen options={{showUserOptions}? {drawerItemStyle: {height: 0}}: true} name="Login" component={LoginScreen} />

  return (
    
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Map" component={MapScreen} />
        {showUserOptions ? (
        <Drawer.Screen name="Profile" component={ProfileScreen} />
        ): 
        <Drawer.Screen name="Login" component={LoginScreen} />}
        <Drawer.Screen options={{drawerItemStyle: {height: 0}}} name="Sign Up" component={SignUpScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

