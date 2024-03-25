import React from 'react'
import {createStackNavigator } from '@react-navigation/stack'
import HomeScreen from './screens/HomeScreen'
import PhotoSelector from './screens/PhotoSelector';
import SettingsScreen from './screens/Settings';
import PairingScreen from './screens/PairingScreen'
import GraphingScreen from './screens/GraphingScreen';
import Profile from './screens/Profile';
import ManageWorkouts from './screens/ManageWorkouts';
import FriendWorkout from './screens/FriendWorkout';
import WorkoutsOfType from './screens/WorkoutsOfType';

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
            initialRouteName='Graphing Screen'>
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
            <Stack.Screen
                name="Workouts Of Type"
                component={WorkoutsOfType}
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

