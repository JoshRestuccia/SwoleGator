import React from "react";
import {TabNavigationParams } from "./navigation-config";
import GraphingScreen from "./GraphingScreen";
import PairingScreen from "./PairingScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator<TabNavigationParams>();

const RootNavigator = () => {
    return(
        <Tab.Navigator initialRouteName="Pairing">
            <Tab.Screen name="Pairing" component={PairingScreen}/>
            <Tab.Screen name="Graphing" component={GraphingScreen} options={{title: "SwoleGator Data"}}/>
        </Tab.Navigator>
    )

};

export default RootNavigator;