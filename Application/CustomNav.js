import React from 'react'
import { Settings, StyleSheet } from 'react-native';
import {createStackNavigator } from '@react-navigation/stack'
import Login from './screens/Login'
import SignUp from './screens/SignUp'
import HomeScreen from './screens/HomeScreen'
import PhotoSelector from './screens/PhotoSelector';
import SettingsScreen from './screens/Settings';
import PairingScreen from './screens/PairingScreen'
import ExerciseSelection from './screens/ExerciseSelection';
import GraphingScreen from './screens/GraphingScreen';
import Profile from './screens/Profile';
import UserSettings from './screens/UserSettings'
import ManageWorkouts from './screens/ManageWorkouts';
import FriendWorkout from './screens/FriendWorkout';

const Stack = createStackNavigator()

const HomeScreenNavigator = () => {
    return(
        <Stack.Navigator>
            <Stack.Screen
                name = "Main"
                component={HomeScreen}
                options={{ 
                    title: 'swolegator', 
                    headerTitleStyle: {fontFamily: 'Anta-Regular', fontSize: 35,},
                    headerTitleAlign: 'center',
                    headerTintColor: 'white',
                    headerStyle: {backgroundColor: 'black', height: 80},
                }}
            />
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
            />
        </Stack.Navigator>
    )
}
export{HomeScreenNavigator}


const NewLiftScreenNavigator = () => {
    return(
        <Stack.Navigator
            initialRouteName='Exercise Selection'>
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
            />
        </Stack.Navigator>
    )
}
export{NewLiftScreenNavigator}


const ProfileScreenNavigator = () => {
    return(
        <Stack.Navigator>
            <Stack.Screen
                name = "Main"
                component={Profile}
                options={{ 
                    title: 'swolegator', 
                    headerTitleStyle: {fontFamily: 'Anta-Regular', fontSize: 35,},
                    headerTitleAlign: 'center',
                    headerTintColor: 'white',
                    headerStyle: {backgroundColor: 'black', height: 80},
                }}
            />
            <Stack.Screen
                name = "User Settings"
                component={SettingsScreen}
                options={{ 
                    title: 'swolegator', 
                    headerTitleStyle: {fontFamily: 'Anta-Regular', fontSize: 35,},
                    headerTitleAlign: 'center',
                    headerTintColor: 'white',
                    headerStyle: {backgroundColor: 'black', height: 80},
                }}
            />
            <Stack.Screen
                name="Workouts"
                component={ManageWorkouts}
                options={{
                    title: 'swolegator', 
                    headerTitleStyle: {fontFamily: 'Anta-Regular', fontSize: 35,},
                    headerTitleAlign: 'center',
                    headerTintColor: 'white',
                    headerStyle: {backgroundColor: 'black', height: 80},
                }}
            />
             <Stack.Screen
                name="Change Profile Picture"
                component={PhotoSelector}
                options={{
                    title: 'swolegator', 
                    headerTitleStyle: {fontFamily: 'Anta-Regular', fontSize: 35,},
                    headerTitleAlign: 'center',
                    headerTintColor: 'white',
                    headerStyle: {backgroundColor: 'black', height: 80},
                }}
            />
            <Stack.Screen
                name="Friend Workout"
                component={FriendWorkout}
                options={{
                    title: 'swolegator', 
                    headerTitleStyle: {fontFamily: 'Anta-Regular', fontSize: 35,},
                    headerTitleAlign: 'center',
                    headerTintColor: 'white',
                    headerStyle: {backgroundColor: 'black', height: 80},
                }}
            />
        </Stack.Navigator>
    )
}
export{ProfileScreenNavigator}

