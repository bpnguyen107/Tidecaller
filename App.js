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
import { FontAwesome } from '@expo/vector-icons';

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
            color: 'white',
            fontWeight: 'bold',
          },
          headerStyle: {
            backgroundColor: '#081424'
          },
          headerTintColor: 'white',
          drawerActiveBackgroundColor: '#102c3c',
        }}
      >
        <Drawer.Screen name="Home" component={HomeScreen}
          options={{
            drawerIcon: ({ size }) => (
              <FontAwesome
                name="home"
                color="white"
                size={size}
              />
            )
          }}
        />
        <Drawer.Screen name="Favorites" component={FavoriteScreen}
          options={{
            drawerIcon: ({ size }) => (
              <FontAwesome
                name="star-o"
                color="white"
                size={size}
              />
            )
          }}
        />
        <Drawer.Screen name="Map" component={MapScreen}
          options={{
            drawerIcon: ({ size }) => (
              <FontAwesome
                name="map-o"
                color="white"
                size={size}
              />
            )
          }}
        />
        <Drawer.Screen name="Forums" component={ForumScreen}
          options={{
            drawerIcon: ({ size }) => (
              <FontAwesome
                name="paperclip"
                color="white"
                size={size}
              />
            )
          }}
        />
        {showUserOptions ? (
          <Drawer.Screen name="Profile" component={ProfileScreen}
            options={{
              drawerIcon: ({ size }) => (
                <FontAwesome
                  name="user"
                  color="white"
                  size={size}
                />
              )
            }}
          />
        ) :
          <Drawer.Screen name="Login" component={LoginScreen}
            options={{
              drawerIcon: ({ size }) => (
                <FontAwesome
                  name="user"
                  color="white"
                  size={size}
                />
              )
            }}
          />}
        <Drawer.Screen options={{ drawerItemStyle: { height: 0 } }} name="Sign Up" component={SignUpScreen} />
        <Drawer.Screen name="Settings" component={SettingScreen}
          options={{
            drawerIcon: ({ size }) => (
              <FontAwesome
                name="gears"
                color="white"
                size={size}
              />
            )
          }}
        />
      </Drawer.Navigator>
    </NavigationContainer >
  );
}

