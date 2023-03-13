import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { useState, useEffect } from 'react';

import HomeScreen from './screens/HomeScreen';
import MapScreen from './screens/MapScreen';
import SignUpScreen from './screens/SignUpScreen';
import LoginScreen from './screens/LoginScreen';
import ProfileScreen from './screens/ProfileScreen';
import FavoriteScreen from './screens/FavoriteScreen';
import ForumScreen from './screens/ForumScreen';
import ForumScreen2 from './screens/ForumScreen2';

import { FontAwesome } from '@expo/vector-icons';
import { useFonts, Eczar_400Regular } from '@expo-google-fonts/eczar';
import { app } from "./backend/firebaseConfig";
import { getAuth } from 'firebase/auth';

function CustomDrawerContent(props) {
  let [fontsLoaded] = useFonts({
    Eczar_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label="Tidecaller"
        onPress={() => console.log("Pressed header")}
        labelStyle={{ color: '#c0e0ff', fontSize: 42, textAlign: 'center', fontFamily: 'Eczar_400Regular' }}
      />
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

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
        drawerContent={(props) => <CustomDrawerContent {...props} />}
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
            ),
            headerTitleStyle: {
              fontSize: 14
            },
            drawerLabel: "Home",
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
        <Drawer.Screen name="Forums" component={ForumScreen2}
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
      </Drawer.Navigator>
    </NavigationContainer >
  );
}

