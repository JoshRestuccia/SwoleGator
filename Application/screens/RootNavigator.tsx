import React from "react";
import {TabNavigationParams } from "./navigation-config";
import GraphingScreen from "./GraphingScreen";
import PairingScreen from "./PairingScreen";
import BluetoothComponent from "./ble_data.tsx"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator<TabNavigationParams>();

const RootNavigator = () => {
    return(
        <Tab.Navigator initialRouteName="Pairing">
            <Tab.Screen name="Pairing" component={PairingScreen}/>
            <Tab.Screen name="Graphing" component={GraphingScreen} options={{title: "SwoleGator Data"}}/>
            <Tab.Screen name="raw data" component={BluetoothComponent} options={{title: "Raw Data"}}/>
        </Tab.Navigator>
    )

};

export default RootNavigator;