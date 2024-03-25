import React, {useState, useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoadingScreen from './screens/LoadingScreen';
import SignUp from './screens/SignUp';
import Login from './screens/Login';

import Landing from './screens/LandingScreen';
import auth from '@react-native-firebase/auth';
import { BLEProvider } from './api/ble/BLEContext';
import { FirestoreProvider } from './api/firestore/FirestoreAPI';
import { HomeScreenNavigator, NewLiftScreenNavigator, ProfileScreenNavigator } from './CustomNav';
import Icon from 'react-native-vector-icons/Octicons'
import AntIcon from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();


function UserStackGroup() {
  return(
    <BLEProvider>
      <Tabs.Navigator 
        screenOptions={{ headerShown: false }}
        >
          <Tabs.Screen
            name = "Home"
            component={HomeScreenNavigator}
            options = {{
              tabBarActiveTintColor: '#AD0000',
              tabBarStyle: {height: 65, backgroundColor:'white', fontSize: 20},
              tabBarLabelStyle: {fontSize: 10, marginBottom: 8},
              tabBarIconStyle: {marginTop: 10},
              tabBarIcon: ({ color, size }) => (
                <Icon name="graph" color={color} size={30} />
              ),
            }}
          />
          <Tabs.Screen
            name = "New Lift"
            component={NewLiftScreenNavigator}
            options = {{
              tabBarActiveTintColor: '#AD0000',
              tabBarStyle: {height: 65, backgroundColor:'white', fontSize: 20},
              tabBarLabelStyle: {fontSize: 10, marginBottom: 8},
              tabBarIconStyle: {marginTop: 10},
              tabBarIcon: ({ color, size }) => (
                <AntIcon name="plussquareo" color={color} size={30} />
              ),
            }}
          />
          <Tabs.Screen
              name = "Friend's Lifts"
                  component={Feed}
                   options = {{
                     tabBarActiveTintColor: '#AD0000',
                        tabBarStyle: {height: 65, backgroundColor:'white', fontSize: 20},
                        tabBarLabelStyle: {fontSize: 10, marginBottom: 8},
                       tabBarIconStyle: {marginTop: 10},
                       tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcon name="account-group" color={color} size={30} />
                                  ),
                                }}
                              />
          <Tabs.Screen
            name = "Profile"
            component={ProfileScreenNavigator}
            options = {{
              tabBarActiveTintColor: '#AD0000',
              tabBarStyle: {height: 65, backgroundColor:'white', fontSize: 20},
              tabBarLabelStyle: {fontSize: 10, marginBottom: 8},
              tabBarIconStyle: {marginTop: 10},
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcon name="account" color={color} size={30} />
              ),
            }}
          />

        </Tabs.Navigator>
    </BLEProvider>
  );
};

function GuestStackGroup() {
  return(
    <Stack.Navigator 
        initialRouteName='Landing'>
      <Stack.Screen 
        name="Landing"
        component={Landing}
        options={{
          title: "",
          headerStyle: {backgroundColor: 'black', height: 80},
          headerTintColor: 'white',}} >
      </Stack.Screen>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{title: "",
        headerStyle: {backgroundColor: 'black', height: 80},
        headerTintColor: '#323334',}}
      />
      <Stack.Screen
        name="Sign Up"
        component={SignUp}
        options={{title: "",
        headerStyle: {backgroundColor: 'black', height: 80, color: 'white'},
        headerTintColor: '#323334',}}
      />
    </Stack.Navigator>
  );
}

export default function App() {

  return(
    <NavigationContainer>
    <FirestoreProvider>
           <Stack.Navigator initialRouteName={auth().currentUser ? 'User Stack': 'Guest Stack'}>
            <Stack.Screen
              name="Loading"
              component={LoadingScreen}
              options={{title: 'Loading', headerShown: false}}
            />
            <Stack.Screen
              name="User Stack" 
              component={UserStackGroup}
              options={{title: "User Stack", headerShown: false}}
            />
            <Stack.Screen
              name="Guest Stack"
              component={GuestStackGroup}
              options={{title: "Guest Stack", headerShown: false}}
            />
        </Stack.Navigator>
    </FirestoreProvider>   
    </NavigationContainer>   
  )
}



/* export default function App() {
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

{         <Stack.Screen
        name="Root Navigator"
        component={RootNavigator}
        options={{title: "Root Navigator"}}
        /> 
}
        <Stack.Screen
        name="Graphing Screen"
        component={GraphingScreen}
        options={{title: "Graphing Screen"}}
        />
        <Stack.Screen
        name="SwoleGator Data"
        component={Data}
        options={{title: "SwoleGator Data"}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
 */