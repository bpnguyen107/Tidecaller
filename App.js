import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './screens/HomeScreen';
import MapScreen from './screens/MapScreen';
import SignUpScreen from './screens/SignUpScreen';
import LoginScreen from './screens/LoginScreen';
import ProfileScreen from './screens/ProfileScreen';
import FavoriteScreen from './screens/FavoriteScreen';
import ForumScreen from './screens/ForumScreen';
import SettingScreen from './screens/SettingScreen';

import { useState, useEffect } from 'react';
import { app } from "./backend/firebaseConfig";
import { getAuth } from 'firebase/auth';

const Drawer = createDrawerNavigator();


export default function App() {
  const [showUserOptions, setUserOptions] = useState(false);
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUserOptions(true);
      }
      else {
        setUserOptions(false);
      }
    })

    return unsubscribe;

  }, []);

  return (

    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{
          drawerStyle: {
            backgroundColor: '#084254',
          },
          drawerLabelStyle: {
            color: 'white'
          },
          headerStyle: {
            backgroundColor: '#081424'
          },
          headerTitleStyle: {
            color: 'white'
          },
        }}
      >
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Favorites" component={FavoriteScreen} />
        <Drawer.Screen name="Map" component={MapScreen} />
        <Drawer.Screen name="Forums" component={ForumScreen} />
        {showUserOptions ? (
          <Drawer.Screen name="Profile" component={ProfileScreen} />
        ) :
          <Drawer.Screen name="Login" component={LoginScreen} />}
        <Drawer.Screen options={{ drawerItemStyle: { height: 0 } }} name="Sign Up" component={SignUpScreen} />
        <Drawer.Screen name="Settings" component={SettingScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

