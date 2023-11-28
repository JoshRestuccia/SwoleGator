import React from "react";
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './HomeScreen';
import PairingScreen from "./PairingScreen";

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
    return(
        <View style={styles.tabView}>
            <Tab.Navigator initialRouteName="Home" screenOptions={{headerShown: true}}>
                <Tab.Screen name="Home" component={HomeScreen}/>
                <Tab.Screen name="Pairing" component={PairingScreen}/>
            </Tab.Navigator>
        </View>
    );
};

const styles = StyleSheet.create({
    tabView: {
        flexDirection:'row',
        flex: 1,
        position:'relative',
        backgroundColor:'gray',
        padding: 20
    },
    tapIcons: {
        flexBasis: 'auto',
    } 
});

export default BottomTabs;