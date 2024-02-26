import React from 'react'
import { Settings, StyleSheet } from 'react-native';
import {createStackNavigator } from '@react-navigation/stack'
import Login from './screens/Login'
import SignUp from './screens/SignUp'
import HomeScreen from './screens/HomeScreen'
import Test from './screens/Test'
import PairingScreen from './screens/PairingScreen'
import ExerciseSelection from './screens/ExerciseSelection';
import GraphingScreen from './screens/GraphingScreen';
import Profile from './screens/Profile';
import UserSettings from './screens/UserSettings'

const Stack = createStackNavigator()

const HomeScreenNavigator = () => {
    return(
        <Stack.Navigator>
            <Stack.Screen
                name = "Home"
                component={HomeScreen}
                options={{ 
                    title: 'swolegator', 
                    headerTitleStyle: {fontFamily: 'Anta-Regular', fontSize: 35,},
                    headerTitleAlign: 'center',
                    headerTintColor: 'white',
                    headerStyle: {backgroundColor: 'black', height: 80},
                }}
            ></Stack.Screen>
            <Stack.Screen
                name = "PairDevice"
                component={PairingScreen}
                options={{ 
                    title: 'swolegator', 
                    headerTitleStyle: {fontFamily: 'Anta-Regular', fontSize: 35,},
                    headerTitleAlign: 'center',
                    headerTintColor: 'white',
                    headerStyle: {backgroundColor: 'black', height: 80},
                }}
            ></Stack.Screen>
        </Stack.Navigator>
    )
}

export{HomeScreenNavigator}
const NewLiftScreenNavigator = () => {
    return(
        <Stack.Navigator>
            <Stack.Screen
                name = "Exercise Selection"
                component={ExerciseSelection}
                options={{ 
                    title: 'swolegator', 
                    headerTitleStyle: {fontFamily: 'Anta-Regular', fontSize: 35,},
                    headerTitleAlign: 'center',
                    headerTintColor: 'white',
                    headerStyle: {backgroundColor: 'black', height: 80},
                }}
            ></Stack.Screen>
            <Stack.Screen
                name = "Graphing Screen"
                component={GraphingScreen}
                options={{ 
                    title: 'swolegator', 
                    headerTitleStyle: {fontFamily: 'Anta-Regular', fontSize: 35,},
                    headerTitleAlign: 'center',
                    headerTintColor: 'white',
                    headerStyle: {backgroundColor: 'black', height: 80},
                }}
            ></Stack.Screen>
        </Stack.Navigator>
    )
}

export{NewLiftScreenNavigator}
const ProfileScreenNavigator = () => {
    return(
        <Stack.Navigator>
            <Stack.Screen
                name = "Profile"
                component={Profile}
                options={{ 
                    title: 'swolegator', 
                    headerTitleStyle: {fontFamily: 'Anta-Regular', fontSize: 35,},
                    headerTitleAlign: 'center',
                    headerTintColor: 'white',
                    headerStyle: {backgroundColor: 'black', height: 80},
                }}
            ></Stack.Screen>
            <Stack.Screen
                name = "User Settings"
                component={UserSettings}
                options={{ 
                    title: 'swolegator', 
                    headerTitleStyle: {fontFamily: 'Anta-Regular', fontSize: 35,},
                    headerTitleAlign: 'center',
                    headerTintColor: 'white',
                    headerStyle: {backgroundColor: 'black', height: 80},
                }}
            ></Stack.Screen>
        </Stack.Navigator>
    )
}

export{ProfileScreenNavigator}

