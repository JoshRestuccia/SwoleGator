/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState, useEffect} from 'react';
//import type {PropsWithChildren} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PairingScreen from './screens/PairingScreen';
import SignUp from './screens/SignUp';
import Login from './screens/Login';
import HomeScreen from './screens/HomeScreen';
const Stack = createNativeStackNavigator();
export default function App() {
  //const [user, setUser] = useState(false);
  return (
    <NavigationContainer>
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: 'lightblue',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
        <Stack.Screen
          name="Sign Up"
          component={SignUp}
          options={{title: "Sign Up"}}
        />
        <Stack.Screen
        name="Login"
        component={Login}
        options={{title: "Login"}}
        />
        <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{title: "Home"}}
        />
        <Stack.Screen
        name="Pair Device"
        component={PairingScreen}
        options={{title: "Pair Device"}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
